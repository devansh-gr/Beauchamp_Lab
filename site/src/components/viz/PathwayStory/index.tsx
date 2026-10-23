import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import type { PathwayStoryProps } from '../types'

// Anatomy: BodyParts3D (DBCLS) and NeuroMorpho.Org v_e_moto4. Built by scripts/build-anatomy.mjs.
const URL = '/anatomy/pathway.glb'

type Step = PathwayStoryProps['step']
type Part = 'cortex' | 'cerebellum' | 'brainstem' | 'cord' | 'spine' | 'axon' | 'motoneuron' | 'biceps' | 'humerus' | 'grid'

const ACTIVE: Record<Step, Part[]> = {
  0: ['cortex'],
  1: ['brainstem', 'cord'],
  2: ['motoneuron'],
  3: ['axon', 'biceps', 'grid'],
}
// Parts framed by the camera at each step.
const FRAME: Record<Step, Part[]> = {
  0: ['cortex', 'cerebellum'],
  1: ['cortex', 'cord'],
  2: ['motoneuron'],
  3: ['cord', 'biceps'],
}

const RED = new THREE.Color('#ef3a47')
const TISSUE = new THREE.Color('#d8d2c4')
const BONE = new THREE.Color('#6d6e71')

function useAnatomy() {
  const [scene, setScene] = useState<THREE.Group | null>(null)
  useEffect(() => {
    let live = true
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
    loader.load(URL, (g) => {
      // One material per part so each can be highlighted on its own.
      g.scene.traverse((o) => {
        if (o instanceof THREE.Mesh) o.material = new THREE.MeshStandardMaterial()
      })
      addGrid(g.scene)
      if (live) setScene(g.scene)
    })
    return () => {
      live = false
    }
  }, [])
  return scene
}

/** 8x8 HD-sEMG grid laid on the front of the biceps. */
function addGrid(scene: THREE.Group) {
  const biceps = scene.getObjectByName('biceps')!
  const box = new THREE.Box3().setFromObject(biceps)
  const c = box.getCenter(new THREE.Vector3())
  const geo = new THREE.SphereGeometry(1.1, 8, 6)
  const grid = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial(), 64)
  const m = new THREE.Matrix4()
  for (let i = 0; i < 64; i++) {
    const x = ((i % 8) - 3.5) * 4
    const y = (Math.floor(i / 8) - 3.5) * 6
    m.setPosition(c.x + x, c.y + y, box.max.z + 2)
    grid.setMatrixAt(i, m)
  }
  grid.name = 'grid'
  scene.add(grid)
}

function frameFor(scene: THREE.Group, parts: Part[], aspect: number) {
  const box = new THREE.Box3()
  for (const p of parts) box.union(new THREE.Box3().setFromObject(scene.getObjectByName(p)!))
  const target = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const fov = (35 * Math.PI) / 180
  const fit = Math.max(size.y, size.x / Math.min(aspect, 1.6)) * 0.5
  const dist = fit / Math.tan(fov / 2) + size.z
  // Three-quarter view from the front-right.
  const pos = target.clone().add(new THREE.Vector3(0.45, 0.12, 1).normalize().multiplyScalar(dist))
  return { target, pos }
}

function Rig({ scene, step, reduced }: { scene: THREE.Group; step: Step; reduced: boolean }) {
  const { camera, size, invalidate } = useThree()
  const goal = useMemo(() => frameFor(scene, FRAME[step], size.width / size.height), [scene, step, size])
  const look = useMemo(() => goal.target.clone(), [])

  useEffect(() => {
    scene.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return
      const part = o.name as Part
      const bone = part === 'spine' || part === 'humerus'
      const on = ACTIVE[step].includes(part)
      const mat = o.material as THREE.MeshStandardMaterial
      if (part === 'grid') {
        o.visible = on
        mat.color.set('#f6f4ef')
        return
      }
      mat.color.copy(on ? RED : bone ? BONE : TISSUE)
      mat.emissive.copy(on ? RED : new THREE.Color(0))
      mat.emissiveIntensity = on ? 0.2 : 0
      mat.roughness = 0.55
      mat.transparent = !on
      mat.opacity = on ? 1 : bone ? 0.12 : 0.35
      mat.depthWrite = on
      mat.needsUpdate = true
    })
    if (reduced) {
      camera.position.copy(goal.pos)
      look.copy(goal.target)
      camera.lookAt(look)
    }
    invalidate()
  }, [scene, step, goal, reduced, camera, look, invalidate])

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 3)
    camera.position.lerp(goal.pos, k)
    look.lerp(goal.target, k)
    camera.lookAt(look)
    if (camera.position.distanceTo(goal.pos) > 0.05) invalidate()
  })
  return null
}

export default function PathwayStory({ step, className = '' }: PathwayStoryProps) {
  const scene = useAnatomy()
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div className={className} role="img" aria-label="3D anatomy: brain, brainstem and spinal cord, a spinal motoneuron, and the biceps with an 8 by 8 surface EMG grid.">
      {scene && (
        <Canvas frameloop="demand" dpr={[1, 2]} camera={{ fov: 35, near: 1, far: 5000, position: [300, 200, 900] }}>
          <hemisphereLight args={['#ffffff', '#202024', 1.1]} />
          <directionalLight position={[300, 500, 400]} intensity={2} />
          <directionalLight position={[-400, 100, -300]} intensity={0.8} color="#ef3a47" />
          <primitive object={scene} />
          <Rig scene={scene} step={step} reduced={reduced} />
        </Canvas>
      )}
    </div>
  )
}
