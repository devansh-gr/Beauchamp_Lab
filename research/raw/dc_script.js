
class Component extends DCLogic {
  state = {
    page: 'home',
    name: '',
    email: '',
    message: '',
    submitted: false
  };

  FOCUS_AREAS = [
    { title: 'Neuromotor Control in Health, Disease, and Injury', desc: '' },
    { title: 'Assistive and Rehabilitative Technology', desc: '' },
    { title: 'Noninvasive Indexing of Arousal and Attentional State', desc: '' }
  ];

  MEMBERS = [
    { name: 'Andy Vo', role: 'BME PhD Student', likes: 'Likes: climbing, video games, and sensation', photo: 'assets/andy-vo.jpg', photoPos: '50% 80%' },
    { name: 'Kate Mould', role: 'BME MS Student', likes: 'Likes:', photo: null },
    { name: 'Anabelle Creveling', role: 'MINT MS Student', likes: 'Likes:', photo: null },
    { name: 'Vicky Yang', role: 'MINT MS Student', likes: 'Likes: theater, photography, and spending time with my cat Kokomi.', photo: 'assets/vicky-yang.jpg', photoPos: '50% 58%' },
    { name: 'Ben Kadison', role: 'Undergraduate Researcher', likes: 'Likes: espresso, traveling, decomposing time-series data', photo: 'assets/ben-kadison.jpg', photoPos: '50% 52%' }
  ];

  COLLABORATORS = [
    { name: 'Prakarsh Yadav', affiliation: 'PhD Student', likes: 'Likes: video games, soccer, trivia', photo: 'assets/prakarsh-yadav.jpg', photoPos: '50% 25%' }
  ];

  LAB_OVERVIEW = 'Our lab develops and applies neurotechnology to open a window into the human central nervous system. We use the output layer of the neuromotor system (spinal motoneurons) to estimate the upstream signalling within spinal, cortical, and subcortical structures. We ask how people control movement, what goes wrong in neural pathology and injury, and whether we can restore function using neurotechnology.';

  PROJECTS = [
    {
      num: '1',
      title: 'Estimating the latent inputs controlling motor output',
      body: 'Spinal motoneurons are the final common pathway through which all motor intent flows, converting central commands into muscle contractions and, ultimately, movement. Importantly, the firing behavior of motoneurons can be estimated with high-density surface electromyography (HDsEMG). We are developing approaches to estimate the synaptic inputs a motoneuron receives, along with its intrinsic properties, based on its firing behavior alone. Currently, this takes the form of a reverse engineering approach: we use the observed output behavior of a motoneuron and invert it to recover the underlying input commands, combining generative biophysical modeling with manifold optimization. Ongoing efforts are extending this framework with machine learning and AI methods.',
      subs: []
    },
    {
      num: '2',
      title: 'Motor commands and motoneuron properties in neural injury and disease',
      body: 'How do the synaptic inputs to motoneurons, and their intrinsic properties, change following neural injury or disease, and how do these changes contribute to motor impairment? The natural follow-up question is whether we can restore or mediate the differences we observe. Our initial efforts focus on stroke and traumatic brain injury (TBI).',
      subs: [
        { num: '2.1', title: 'Stroke and vagus nerve stimulation.', body: 'We are investigating vagus nerve stimulation (VNS), an FDA-approved treatment, to understand whether it produces the neurophysiological changes its proposed mechanism predicts, how those changes shape motoneuron behavior, and whether motoneuron behavior can be used a priori to predict an individual\u2019s response profile.' },
        { num: '2.2', title: 'TBI and locus coeruleus-norepinephrine dysfunction.', body: 'Supported by the Chuck Noll Foundation, this project uses spinal motoneurons as a noninvasive window into locus coeruleus-norepinephrine (LC-NE) dysfunction in chronic TBI. The work reframes motor impairment in this population, moving it from an opaque behavioral phenotype toward a tractable circuit-level problem, opening a path toward mechanism-based patient stratification and the rational deployment of emerging LC-directed therapies.' }
      ]
    },
    {
      num: '3',
      title: 'Noninvasive indexing of arousal and attentional state',
      body: 'Spinal motoneurons express channels sensitive to endogenous neuromodulators, including norepinephrine and serotonin, making their firing behavior a unique, peripherally accessible window into a person\u2019s internal state. We are developing computational approaches that use motoneuron firing patterns to noninvasively index fluctuations in arousal and attentional state in humans, with the goal of turning a peripheral electrophysiological signal into a real-time readout of central neuromodulatory tone.',
      subs: []
    },
    {
      num: '4',
      title: 'Influence of internal state on motor control',
      body: 'Monoamines govern the excitability of much of the nervous system, including the gain state of spinal motoneurons. We are interested in how this gain state, and the monoaminergic drive from the brainstem that controls it, fits within traditional frameworks of motor control. Is gain state learned, perceived, or predicted, and through what mechanisms?',
      subs: []
    }
  ];

  MASTERS = {
    title: "Master's Students",
    intro: "We welcome master's students across a broad spectrum of backgrounds. Reach out with your background and interests. A core mission of the lab is to use spinal motoneurons as a window into how the human nervous system operates. Our approach spans several areas, so students can contribute in different ways depending on their skills and interests.",
    areas: [
      { num: '1', title: 'Computational & Modeling', body: 'We develop computational approaches to reverse engineer the inputs that spinal motoneurons receive, treating them as the output layer of the biological neural network and decoding their behavior to map the network itself. Students interested in signal processing, biomedical engineering, or computational neuroscience fit well here.' },
      { num: '2', title: 'Clinical & Translational Research', body: 'Our computational work runs parallel to our human clinical research, applying the same motor unit decoding techniques to pathologies like stroke, TBI, and spinal cord injury. We also work with implanted stimulating electrodes to help restore movement. Relevant backgrounds include neuroengineering, clinical research, and biomechanics.' },
      { num: '3', title: 'Experimental & Systems Engineering', body: 'We use experimental paradigms to interface with human participants, including robotic systems that control and perturb movement while recording motoneuron activity. Students interested in robotics, mechatronics, or experimental design will find opportunities here.' }
    ]
  };

  MENTORSHIP = { title: 'Mentorship Strategy', desc: 'Our mentorship strategy and lab dynamic hinge on the premise that everyone is unique. No one shares the same background, prior experiences, or beliefs, and that\u2019s what makes us a strong team. The mentorship we offer is unique to the individual: we want everyone in the lab to become the best possible version of themselves and achieve their goals with confidence. Upon joining, we\u2019ll meet with you regularly to define your objectives and how we can best help you reach them, and we\u2019ll set a communication and work-plan strategy tailored to how you work and communicate best. We ultimately believe that if you are successful, the lab is successful.' };

  PHD = {
    title: 'PhD Students',
    desc: 'We are recruiting PhD students for upcoming cohorts. Get in touch to discuss fit, ongoing projects, and the application process. We are recruiting for the following programs:',
    programs: [
      { name: 'Biomedical Engineering', url: 'https://www.cmu.edu/bme/Academics/graduate-programs/phd_program.html' },
      { name: 'Ph.D. in Systems Neuroscience (PSN)', url: 'https://www.cmu.edu/ni/academics/grad/programs/phd-systems-neuroscience' },
      { name: 'Ph.D. in Neural Computation (PNC)', url: 'https://www.cmu.edu/ni/academics/grad/programs/phd-neural-computation' }
    ]
  };

  POSITIONS = [
    { title: 'Postdoctoral Researcher', desc: 'We are recruiting a postdoctoral researcher to help lead ongoing projects and expand our lab in new directions. Get in touch to discuss fit, current projects, and available funding.' }
  ];

  goTo(page) {
    this.setState({ page });
  }

  async submitContact() {
    this.setState({ sending: true, submitError: false });
    try {
      const res = await fetch('https://formspree.io/f/mjgnvdzg', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.state.name,
          email: this.state.email,
          message: this.state.message
        })
      });
      if (res.ok) {
        this.setState({ submitted: true, sending: false });
      } else {
        this.setState({ submitError: true, sending: false });
      }
    } catch (e) {
      this.setState({ submitError: true, sending: false });
    }
  }

  navStyle(key) {
    const active = this.state.page === key;
    return {
      fontSize: '14px',
      fontWeight: active ? 700 : 500,
      color: active ? '#C41230' : '#141414',
      cursor: 'pointer'
    };
  }

  renderVals() {
    const page = this.state.page;
    const navDefs = [
      { key: 'home', label: 'Home' },
      { key: 'people', label: 'People' },
      { key: 'projects', label: 'Research' },
      { key: 'positions', label: 'Open Positions' },
      { key: 'updates', label: 'Updates' }
    ];

    return {
      isHome: page === 'home',
      isPeople: page === 'people',
      isProjects: page === 'projects',
      isPositions: page === 'positions',
      isUpdates: page === 'updates',
      isContact: page === 'contact',

      navItems: navDefs.map(n => ({
        label: n.label,
        style: this.navStyle(n.key),
        onClick: () => this.goTo(n.key)
      })),

      goHome: () => this.goTo('home'),
      goPeople: () => this.goTo('people'),
      goProjects: () => this.goTo('projects'),
      goContact: () => this.goTo('contact'),

      focusAreas: this.FOCUS_AREAS,
      members: this.MEMBERS.map(m => ({ ...m, noPhoto: !m.photo })),
      collaborators: this.COLLABORATORS.map(c => ({ ...c, hasPhoto: !!c.photo, noPhoto: !c.photo, hasLikes: !!c.likes })),
      labOverview: this.LAB_OVERVIEW,
      projects: this.PROJECTS,
      mentorship: this.MENTORSHIP,
      masters: this.MASTERS,
      phd: this.PHD,
      positions: this.POSITIONS,

      name: this.state.name,
      email: this.state.email,
      message: this.state.message,
      setName: (e) => this.setState({ name: e.target.value }),
      setEmail: (e) => this.setState({ email: e.target.value }),
      setMessage: (e) => this.setState({ message: e.target.value }),
      submitted: this.state.submitted,
      notSubmitted: !this.state.submitted,
      sending: this.state.sending,
      submitError: this.state.submitError,
      sendLabel: this.state.sending ? 'Sending…' : 'Send Message',
      submit: () => this.submitContact()
    };
  }
}
