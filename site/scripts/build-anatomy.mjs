// Builds public/anatomy/pathway.glb from BodyParts3D OBJ meshes.
// Usage: node scripts/build-anatomy.mjs <bodyparts3d parts dir>
// Expects vert.tsv (atlas to L2) and skel.tsv (other upper body bones) beside the parts dir.
// Sources and licenses: see public/anatomy/CREDITS.txt.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { Document, NodeIO } from '@gltf-transform/core'
import { EXTMeshoptCompression, KHRMeshQuantization } from '@gltf-transform/extensions'
import { simplify, weld, quantize, meshopt, dedup, prune } from '@gltf-transform/functions'
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer'
import * as THREE from 'three'
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const [partsDir] = process.argv.slice(2)

// BodyParts3D element files (FJ ids) per group, from partof/isa_element_parts.txt.
const GROUPS = {
  cortex: 'FJ1732 FJ1739 FJ1744 FJ1746 FJ1748 FJ1750 FJ1758 FJ1759 FJ1767 FJ1783 FJ1785 FJ1787 FJ1789 FJ1791 FJ1797 FJ1800 FJ1833 FJ1835 FJ1841 FJ1733 FJ1740 FJ1745 FJ1747 FJ1749 FJ1751 FJ1784 FJ1786 FJ1788 FJ1790 FJ1792 FJ1798 FJ1801 FJ1806 FJ1807 FJ1814 FJ1834 FJ1836 FJ1842',
  cerebellum: 'FJ1781 FJ1830',
  brainstem: 'FJ1738 FJ1762 FJ1769 FJ1770 FJ1775 FJ1779 FJ1810 FJ1817 FJ1822 FJ1826 FJ1831',
  biceps: 'FJ1512 FJ1478',
}
// Atlas to L2, top to bottom.
const elements = (f) => [...new Set(readFileSync(join(partsDir, '..', f), 'utf8').trim().split('\n').map((l) => l.split('\t')[1]))]
const VERTEBRAE = elements('vert.tsv')
// Rib cage, sternum, clavicles, scapulae, arms, hands, L3 to L5, sacrum, hip bones. No skull.
const SKELETON = elements('skel.tsv')

// BodyParts3D is in mm, z up. Convert to y up.
const toY = (x, y, z) => [x, z, -y]

function readObj(id) {
  const pos = []
  const idx = []
  for (const line of readFileSync(join(partsDir, `${id}.obj`), 'utf8').split('\n')) {
    if (line.startsWith('v ')) {
      const [, x, y, z] = line.trim().split(/\s+/).map(Number)
      pos.push(...toY(x, y, z))
    } else if (line.startsWith('f ')) {
      const v = line.trim().split(/\s+/).slice(1).map((t) => parseInt(t) - 1)
      for (let i = 1; i < v.length - 1; i++) idx.push(v[0], v[i], v[i + 1])
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setIndex(idx)
  return g
}

const group = (ids) => mergeGeometries(ids.map(readObj))

// Spinal canal centre at each vertebra: cast a front-to-back ray along the midline; hits
// alternate entering and leaving bone, and the widest gap outside bone is the canal.
function canalCentre(geo) {
  geo.computeBoundingBox()
  const { min, max } = geo.boundingBox
  const midY = (min.y + max.y) / 2
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }))
  let best = { gap: 0, z: 0, y: midY }
  for (const dy of [-4, -2, 0, 2, 4]) {
    const ray = new THREE.Raycaster(new THREE.Vector3(0, midY + dy, max.z + 10), new THREE.Vector3(0, 0, -1))
    const zs = ray.intersectObject(mesh).map((h) => h.point.z)
    for (let i = 1; i + 1 < zs.length; i += 2) {
      const gap = zs[i] - zs[i + 1]
      if (gap > best.gap) best = { gap, z: (zs[i] + zs[i + 1]) / 2, y: midY + dy }
    }
  }
  // The axis (dens) can block every ray; skip vertebrae with no canal found.
  return best.gap ? new THREE.Vector3(0, best.y, best.z) : null
}

const vertebrae = VERTEBRAE.map(readObj)
const brainstem = group(GROUPS.brainstem.split(' '))
brainstem.computeBoundingBox()
const bsBottom = brainstem.boundingBox.min.y

// Cord: tapered tube from the base of the brainstem through each canal centre to L1/L2 (conus).
const canals = vertebrae.map(canalCentre)
const pts = canals.filter(Boolean)
const first = pts[0]
pts.unshift(new THREE.Vector3(0, bsBottom + 6, first.z + 2))
const curve = new THREE.CatmullRomCurve3(pts)
const cordGeo = new THREE.TubeGeometry(curve, 200, 1, 16, false)
{
  // Taper: ~5 mm radius at the cervical enlargement, narrowing to the conus.
  const p = cordGeo.attributes.position
  const n = cordGeo.attributes.normal
  for (let i = 0; i < p.count; i++) {
    const t = Math.floor(i / 17) / 200
    const c = curve.getPointAt(t)
    const r = t > 0.92 ? 5 * (1 - (t - 0.92) / 0.08) + 0.5 : 4 + 1.5 * Math.exp(-(((t - 0.2) / 0.1) ** 2))
    p.setXYZ(i, c.x + n.getX(i) * r, c.y + n.getY(i) * r, c.z + n.getZ(i) * r)
  }
}

// Motor axon path, schematic: leaves the cord at C6 and runs to the biceps belly.
const biceps = group(GROUPS.biceps.split(' '))
biceps.computeBoundingBox()
const bc = biceps.boundingBox.getCenter(new THREE.Vector3())
const c6 = canals[5]
const axonCurve = new THREE.CatmullRomCurve3([
  c6,
  c6.clone().add(new THREE.Vector3(-25, -8, 10)),
  new THREE.Vector3(bc.x + 20, c6.y - 40, bc.z - 10),
  new THREE.Vector3(bc.x, bc.y + 20, bc.z - 5),
])
const axonGeo = new THREE.TubeGeometry(axonCurve, 120, 1.2, 8, false)

const meshes = {
  cortex: group(GROUPS.cortex.split(' ')),
  cerebellum: group(GROUPS.cerebellum.split(' ')),
  brainstem,
  cord: cordGeo,
  skeleton: mergeGeometries([...vertebrae, ...SKELETON.map(readObj)]),
  axon: axonGeo,
  biceps,
}

// Centre the whole figure on the origin.
const all = new THREE.Box3()
for (const g of Object.values(meshes)) {
  g.computeBoundingBox()
  all.union(g.boundingBox)
}
const centre = all.getCenter(new THREE.Vector3())

const doc = new Document()
const buf = doc.createBuffer()
const scene = doc.createScene('pathway')
for (const [name, g0] of Object.entries(meshes)) {
  let g = g0.index ? g0 : mergeVertices(g0)
  g = g.clone()
  g.translate(-centre.x, -centre.y, -centre.z)
  g.deleteAttribute('uv')
  g.computeVertexNormals()
  const pos = doc.createAccessor().setType('VEC3').setArray(new Float32Array(g.attributes.position.array)).setBuffer(buf)
  const nor = doc.createAccessor().setType('VEC3').setArray(new Float32Array(g.attributes.normal.array)).setBuffer(buf)
  const ind = doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(g.index.array)).setBuffer(buf)
  const prim = doc.createPrimitive().setAttribute('POSITION', pos).setAttribute('NORMAL', nor).setIndices(ind)
  const mesh = doc.createMesh(name).addPrimitive(prim)
  scene.addChild(doc.createNode(name).setMesh(mesh))
  console.log(name, g.attributes.position.count, 'verts')
}

await MeshoptEncoder.ready
await doc.transform(
  dedup(),
  weld(),
  simplify({ simplifier: MeshoptSimplifier, ratio: 0.35, error: 0.0008 }),
  prune(),
  quantize(),
  meshopt({ encoder: MeshoptEncoder, level: 'high' }),
)
doc.createExtension(KHRMeshQuantization).setRequired(true)
doc.createExtension(EXTMeshoptCompression).setRequired(true)

const out = join(import.meta.dirname, '..', 'public', 'anatomy')
mkdirSync(out, { recursive: true })
const io = new NodeIO().registerExtensions([EXTMeshoptCompression, KHRMeshQuantization]).registerDependencies({ 'meshopt.encoder': MeshoptEncoder })
const glb = await io.writeBinary(doc)
writeFileSync(join(out, 'pathway.glb'), glb)
console.log('pathway.glb', (glb.byteLength / 1024).toFixed(0), 'KB')
