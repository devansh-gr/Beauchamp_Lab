export interface Link {
  label: string
  href: string
}

export interface Person {
  slug: string
  name: string
  role: string
  likes?: string
  photo?: string
  photoPos?: string
  links?: Link[]
}

export interface SubProject {
  num: string
  title: string
  body: string
}

export interface Project {
  num: string
  slug: string
  title: string
  short: string
  body: string
  subs: SubProject[]
  viz?: 'RecruitmentRaster'
}

export interface FocusArea {
  title: string
  desc: string
}

export type PubType = 'journal' | 'preprint' | 'conference'

export interface Publication {
  year: number
  title: string
  authors: string
  venue: string
  type: PubType
  doi?: string
  firstAuthor?: boolean
  date?: string
  source?: string
}

