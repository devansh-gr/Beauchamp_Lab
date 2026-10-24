// Copy sourced verbatim from the live site (research/raw/dc_script.js) unless noted.
import type { FocusArea, Link, Person, Project } from './types'
import { asset } from '../lib/asset'

export const LAB = {
  name: 'The Output Layer Lab',
  shortName: 'Output Layer Lab',
  pi: 'Beauchamp Lab',
  tagline: 'Neuromotor systems and technology',
  university: 'Carnegie Mellon University',
  email: 'jabeauchamp@cmu.edu',
  joinIntro: 'The Output Layer Lab is always looking to connect with curious, motivated researchers across levels of experience.',
  contactIntro: 'Reach out about anything.',
  formspree: 'https://formspree.io/f/mjgnvdzg',
  hero:
    'We study how the nervous system generates and controls movement, using spinal motoneurons (the output layer of the neuromotor system) to estimate upstream signaling from spinal, cortical, and subcortical sources. We translate that understanding into technologies for rehabilitation, assistive devices, and human-machine interfaces.',
  overview:
    'Our lab develops and applies neurotechnology to open a window into the human central nervous system. We use the output layer of the neuromotor system (spinal motoneurons) to estimate the upstream signalling within spinal, cortical, and subcortical structures. We ask how people control movement, what goes wrong in neural pathology and injury, and whether we can restore function using neurotechnology.',
}

export const FOCUS_AREAS: FocusArea[] = [
  { title: 'Neuromotor Control in Health, Disease, and Injury', desc: '' },
  { title: 'Assistive and Rehabilitative Technology', desc: '' },
  { title: 'Noninvasive Indexing of Arousal and Attentional State', desc: '' },
]

export const PI: Person & { title: string; dept: string; bio: string[] } = {
  slug: 'drew-beauchamp',
  name: 'James (Drew) Beauchamp, PhD',
  role: 'Principal Investigator',
  title: 'Assistant Professor',
  dept: 'Biomedical Engineering & Neuroscience Institute',
  likes: 'Likes coffee, cycling, and starting new projects.',
  photo: asset('/people/drew-beauchamp.jpg'),
  photoPos: '50% 30%',
  // bio: cmu.edu/bme/People/Faculty/profile/jbeaucha.html
  bio: [
    'PhD in Biomedical Engineering (Neural Engineering), Northwestern University, with Julius Dewald and CJ Heckman.',
    'BSE and MS in Biomedical Engineering, Arizona State University.',
    'Postdoctoral training with Doug Weber at Carnegie Mellon University.',
  ],
  links: [
    { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=zmPty2AAAAAJ&hl=en' },
    { label: 'ORCID', href: 'https://orcid.org/0000-0003-2288-8672' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/james-drew-beauchamp' },
    { label: 'Neuroscience Institute', href: 'https://www.cmu.edu/ni/people/faculty/drew-beauchamp' },
    { label: 'CMU BME', href: 'https://www.cmu.edu/bme/People/Faculty/profile/jbeaucha.html' },
    { label: 'Email', href: 'mailto:jabeauchamp@cmu.edu' },
  ],
}

// Ordered by seniority (PhD, MS, undergrad), then last name.
export const MEMBERS: Person[] = [
  { slug: 'andy-vo', name: 'Andy Vo', role: 'BME PhD Student', likes: 'Likes: climbing, video games, and sensation', photo: asset('/people/andy-vo.jpg'), photoPos: '50% 80%' },
  { slug: 'anabelle-creveling', name: 'Anabelle Creveling', role: 'MINT MS Student' },
  { slug: 'kate-mould', name: 'Kate Mould', role: 'BME MS Student' },
  { slug: 'vicky-yang', name: 'Vicky Yang', role: 'MINT MS Student', likes: 'Likes: theater, photography, and spending time with my cat Kokomi.', photo: asset('/people/vicky-yang.jpg'), photoPos: '50% 58%' },
  { slug: 'ben-kadison', name: 'Ben Kadison', role: 'Undergraduate Researcher', likes: 'Likes: espresso, traveling, decomposing time-series data', photo: asset('/people/ben-kadison.jpg'), photoPos: '50% 52%' },
]

export const COLLABORATORS: Person[] = [
  { slug: 'prakarsh-yadav', name: 'Prakarsh Yadav', role: 'PhD Student', likes: 'Likes: video games, soccer, trivia', photo: asset('/people/prakarsh-yadav.jpg'), photoPos: '50% 25%' },
]

export const PROJECTS: Project[] = [
  {
    num: '01',
    slug: 'latent-inputs',
    title: 'Estimating the latent inputs controlling motor output',
    short: 'Invert a motoneuron’s firing to recover the commands it received.',
    viz: 'RecruitmentRaster',
    body: 'Spinal motoneurons are the final common pathway through which all motor intent flows, converting central commands into muscle contractions and, ultimately, movement. Importantly, the firing behavior of motoneurons can be estimated with high-density surface electromyography (HDsEMG). We are developing approaches to estimate the synaptic inputs a motoneuron receives, along with its intrinsic properties, based on its firing behavior alone. Currently, this takes the form of a reverse engineering approach: we use the observed output behavior of a motoneuron and invert it to recover the underlying input commands, combining generative biophysical modeling with manifold optimization. Ongoing efforts are extending this framework with machine learning and AI methods.',
    subs: [],
  },
  {
    num: '02',
    slug: 'injury-and-disease',
    title: 'Motor commands and motoneuron properties in neural injury and disease',
    short: 'What changes at the motoneuron after stroke and TBI, and can we restore it?',
    body: 'How do the synaptic inputs to motoneurons, and their intrinsic properties, change following neural injury or disease, and how do these changes contribute to motor impairment? The natural follow-up question is whether we can restore or mediate the differences we observe. Our initial efforts focus on stroke and traumatic brain injury (TBI).',
    subs: [
      { num: '2.1', title: 'Stroke and vagus nerve stimulation.', body: 'We are investigating vagus nerve stimulation (VNS), an FDA-approved treatment, to understand whether it produces the neurophysiological changes its proposed mechanism predicts, how those changes shape motoneuron behavior, and whether motoneuron behavior can be used a priori to predict an individual’s response profile.' },
      { num: '2.2', title: 'TBI and locus coeruleus-norepinephrine dysfunction.', body: 'Supported by the Chuck Noll Foundation, this project uses spinal motoneurons as a noninvasive window into locus coeruleus-norepinephrine (LC-NE) dysfunction in chronic TBI. The work reframes motor impairment in this population, moving it from an opaque behavioral phenotype toward a tractable circuit-level problem, opening a path toward mechanism-based patient stratification and the rational deployment of emerging LC-directed therapies.' },
    ],
  },
  {
    num: '03',
    slug: 'arousal-and-attention',
    title: 'Noninvasive indexing of arousal and attentional state',
    short: 'Read neuromodulatory tone from a peripheral signal, in real time.',
    viz: 'NeuromodDial',
    body: 'Spinal motoneurons express channels sensitive to endogenous neuromodulators, including norepinephrine and serotonin, making their firing behavior a unique, peripherally accessible window into a person’s internal state. We are developing computational approaches that use motoneuron firing patterns to noninvasively index fluctuations in arousal and attentional state in humans, with the goal of turning a peripheral electrophysiological signal into a real-time readout of central neuromodulatory tone.',
    subs: [],
  },
  {
    num: '04',
    slug: 'internal-state',
    title: 'Influence of internal state on motor control',
    short: 'Is motoneuron gain learned, perceived, or predicted?',
    viz: 'NeuromodDial',
    body: 'Monoamines govern the excitability of much of the nervous system, including the gain state of spinal motoneurons. We are interested in how this gain state, and the monoaminergic drive from the brainstem that controls it, fits within traditional frameworks of motor control. Is gain state learned, perceived, or predicted, and through what mechanisms?',
    subs: [],
  },
]

export const MENTORSHIP = {
  title: 'Mentorship Strategy',
  desc: 'Our mentorship strategy and lab dynamic hinge on the premise that everyone is unique. No one shares the same background, prior experiences, or beliefs, and that’s what makes us a strong team. The mentorship we offer is unique to the individual: we want everyone in the lab to become the best possible version of themselves and achieve their goals with confidence. Upon joining, we’ll meet with you regularly to define your objectives and how we can best help you reach them, and we’ll set a communication and work-plan strategy tailored to how you work and communicate best. We ultimately believe that if you are successful, the lab is successful.',
}

export const MASTERS = {
  title: 'Master’s Students',
  intro: 'We welcome master’s students across a broad spectrum of backgrounds. Reach out with your background and interests. A core mission of the lab is to use spinal motoneurons as a window into how the human nervous system operates. Our approach spans several areas, so students can contribute in different ways depending on their skills and interests.',
  areas: [
    { num: '01', title: 'Computational & Modeling', body: 'We develop computational approaches to reverse engineer the inputs that spinal motoneurons receive, treating them as the output layer of the biological neural network and decoding their behavior to map the network itself. Students interested in signal processing, biomedical engineering, or computational neuroscience fit well here.' },
    { num: '02', title: 'Clinical & Translational Research', body: 'Our computational work runs parallel to our human clinical research, applying the same motor unit decoding techniques to pathologies like stroke, TBI, and spinal cord injury. We also work with implanted stimulating electrodes to help restore movement. Relevant backgrounds include neuroengineering, clinical research, and biomechanics.' },
    { num: '03', title: 'Experimental & Systems Engineering', body: 'We use experimental paradigms to interface with human participants, including robotic systems that control and perturb movement while recording motoneuron activity. Students interested in robotics, mechatronics, or experimental design will find opportunities here.' },
  ],
}

export const PHD: { title: string; desc: string; programs: Link[] } = {
  title: 'PhD Students',
  desc: 'We are recruiting PhD students for upcoming cohorts. Get in touch to discuss fit, ongoing projects, and the application process. We are recruiting for the following programs:',
  programs: [
    { label: 'Biomedical Engineering', href: 'https://www.cmu.edu/bme/Academics/graduate-programs/phd_program.html' },
    { label: 'Ph.D. in Systems Neuroscience (PSN)', href: 'https://www.cmu.edu/ni/academics/grad/programs/phd-systems-neuroscience' },
    { label: 'Ph.D. in Neural Computation (PNC)', href: 'https://www.cmu.edu/ni/academics/grad/programs/phd-neural-computation' },
  ],
}

export const POSITIONS = [
  { title: 'Postdoctoral Researcher', desc: 'We are recruiting a postdoctoral researcher to help lead ongoing projects and expand our lab in new directions. Get in touch to discuss fit, current projects, and available funding.' },
]

export const NAV: Link[] = [
  { label: 'Research', href: '/research' },
  { label: 'People', href: '/people' },
  { label: 'Publications', href: '/publications' },
  { label: 'Join', href: '/join' },
  { label: 'Contact', href: '/contact' },
]
