export interface TrackLevelDetail {
  title: string;
  duration: string;
  description: string;
  tools: string[];
  outcomes: string[];
  project: string;
  image: string;
}

export interface TrackDetail {
  slug: string;
  title: string;
  audience: string;
  duration: string;
  format: string;
  summary: string;
  heroVideo: { src: string; poster: string };
  highlights: string[];
  learningOutcomes: string[];
  levels: TrackLevelDetail[];
  admissionSteps: { title: string; description: string }[];
  ctaLabel: string;
}

export const trackDetails: TrackDetail[] = [
  {
    slug: 'track-1-little-programmer',
    title: 'Track 1 · Little Programmer',
    audience: 'Ages 7-8 · Beginners',
    duration: '9 months',
    format: 'Live online · Small batches',
    summary:
      'A playful introduction to coding through visual programming, math puzzles, and design prompts. Learners build confidence by creating their own stories, games, and websites.',
    heroVideo: {
      src: '/video/academy/track-1.mp4',
      poster:
        'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80',
    },
    highlights: [
      'STEM.org-aligned visual programming curriculum',
      'Focus on imagination, sequencing, and creative storytelling',
      'Weekly design showcases to celebrate progress',
    ],
    learningOutcomes: [
      'Introduction to coding and programming language basics',
      'Sequences, simple math concepts, conditionals, and user events',
      'Loops, building games, and designing animated stories',
      'Website structure fundamentals: headers, footers, images, and forms',
    ],
    levels: [
      {
        title: 'Level 1 · ScratchJr',
        duration: '4 months',
        description:
          'Drag-and-drop programming that builds sequencing skills and inspires storytelling through characters, backgrounds, and sounds.',
        tools: ['ScratchJr'],
        outcomes: ['Coding fundamentals', 'Conditional thinking', 'Animating original stories'],
        project: 'Create an animated storybook that responds to taps and swipes.',
        image: 'https://images.unsplash.com/photo-1501696461415-6bd6660c6746?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Level 2 · Scratch',
        duration: '4 months',
        description:
          'Advance to richer game mechanics, scoring systems, and interactive animations using visual blocks and variables.',
        tools: ['Scratch'],
        outcomes: ['Loops and variables', 'User events and scoring', 'Game design fundamentals'],
        project: 'Build a multi-level arcade game with custom sprites and sound effects.',
        image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Level 3 · Wix Website',
        duration: '1 month',
        description:
          'Design a personal website with sections, galleries, and forms while learning the parts of a web page and good layout habits.',
        tools: ['Wix'],
        outcomes: ['Website design fundamentals', 'Working with images and forms', 'Personal site launch'],
        project: 'Publish a personal profile website with an “About me” and project gallery.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    admissionSteps: [
      { title: 'Register', description: 'Sign up for a free trial class to meet the mentor and see the toolkit.' },
      { title: 'Experience', description: 'Your child attends the trial and explores interactive challenges.' },
      { title: 'Connect', description: 'Our team shares feedback, the roadmap, and answers parent questions.' },
      { title: 'Enroll', description: 'Confirm the seat with the first payment and receive orientation materials.' },
    ],
    ctaLabel: 'Book a FREE Trial Class',
  },
  {
    slug: 'track-2-young-builder',
    title: 'Track 2 · Young Builder',
    audience: 'Ages 9-12 · Confident explorers',
    duration: '9 months',
    format: 'Live online · Project-based studios',
    summary:
      'Bridging visual coding to text-based thinking. Learners deepen logic with sensors, dive into Python play, and ship their first responsive web stories.',
    heroVideo: {
      src: '/video/academy/track-2.mp4',
      poster:
        'https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?auto=format&fit=crop&w=1600&q=80',
    },
    highlights: [
      'Maker challenges mixing hardware simulations and creative code',
      'Weekly code reviews with mentors for debugging confidence',
      'Showcase nights for family and friends every month',
    ],
    learningOutcomes: [
      'Master conditional logic, sensors, and event-driven flows',
      'Transition from blocks to Python syntax with clean code habits',
      'Design responsive web pages with reusable components',
      'Plan, storyboard, and present projects with clarity',
    ],
    levels: [
      {
        title: 'Level 1 · Creative Coding Lab',
        duration: '3 months',
        description:
          'Advanced block programming with sensors, sound design, and multiplayer-style mechanics to stretch logic skills.',
        tools: ['Scratch', 'micro:bit simulator'],
        outcomes: ['Sensor-driven games', 'State management with variables', 'Event orchestration'],
        project: 'Design a cooperative game that reacts to sound, timers, and player choices.',
        image: 'https://images.unsplash.com/photo-1484807352052-23338990c6c6?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Level 2 · Python Playgrounds',
        duration: '3 months',
        description:
          'Move into text-based coding with Turtle art, mini-games, and data stories. Emphasis on readable code and debugging.',
        tools: ['Python', 'Turtle', 'Pygame Zero'],
        outcomes: ['Loops and functions', 'Debugging practices', 'Math-driven visuals'],
        project: 'Create a mini-game with keyboard controls, scoring, and motion physics.',
        image: 'https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Level 3 · Interactive Web Stories',
        duration: '3 months',
        description:
          'Build responsive pages with layouts, typography, forms, and simple animations to tell personal or community stories.',
        tools: ['HTML', 'CSS', 'Canva'],
        outcomes: ['Responsive layouts', 'Accessibility-first design', 'Form handling basics'],
        project: 'Launch a multi-section story site featuring interviews, galleries, and a contact form.',
        image: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    admissionSteps: [
      { title: 'Register', description: 'Reserve a seat and share the learner’s interests and past projects.' },
      { title: 'Trial Studio', description: 'Join a live studio session to explore sensors, Python, and design prompts.' },
      { title: 'Roadmap Review', description: 'Mentor provides skill mapping and recommends the best pacing.' },
      { title: 'Enroll', description: 'Lock in the schedule, get the starter kit, and meet the learning pod.' },
    ],
    ctaLabel: 'Book a FREE Trial Class',
  },
  {
    slug: 'track-3-future-founder',
    title: 'Track 3 · Future Founder',
    audience: 'Ages 12-16 · Portfolio-ready makers',
    duration: '10 months',
    format: 'Live online · Studio labs + mentoring',
    summary:
      'From front-end craft to entrepreneurship. Learners design polished interfaces, build web apps, and graduate with a portfolio plus freelancing playbooks.',
    heroVideo: {
      src: '/video/academy/track-3.mp4',
      poster:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
    },
    highlights: [
      'Design + build cycles with critique from product mentors',
      'Career labs covering proposals, client communication, and pricing',
      'Demo day to present capstone apps to parents and peers',
    ],
    learningOutcomes: [
      'Strong foundations in HTML, CSS, JavaScript, and component-based UI',
      'Rapid prototyping with Figma and Webflow for production-quality pages',
      'Collaboration using GitHub, issue tracking, and code reviews',
      'Freelancing readiness: proposals, scoping, and delivery rituals',
    ],
    levels: [
      {
        title: 'Level 1 · Frontend Foundations',
        duration: '3 months',
        description:
          'Deep dive into semantic HTML, modern CSS, and JavaScript fundamentals with hands-on landing page builds.',
        tools: ['HTML', 'CSS', 'JavaScript', 'Tailwind'],
        outcomes: ['Responsive layouts', 'Reusable components', 'Accessibility-first UI'],
        project: 'Ship a responsive brand site with animations, forms, and a component library.',
        image: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Level 2 · Product Studio',
        duration: '3 months',
        description:
          'Prototype and publish with Figma and Webflow/Bubble, focusing on UX flows, CMS content, and launch checklists.',
        tools: ['Figma', 'Webflow', 'Bubble'],
        outcomes: ['UX prototyping', 'CMS-driven sites', 'Launch-readiness'],
        project: 'Design and publish a marketing site with CMS collections and animations.',
        image: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Level 3 · Freelance Launchpad',
        duration: '4 months',
        description:
          'Career labs on positioning, proposals, delivery rituals, and client communication paired with real project simulations.',
        tools: ['GitHub', 'Notion', 'Upwork'],
        outcomes: ['Portfolio storytelling', 'Proposal frameworks', 'Client-ready documentation'],
        project: 'Deliver a capstone web app with repository, documentation, and recorded walkthrough.',
        image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    admissionSteps: [
      { title: 'Apply', description: 'Share interests, prior coding exposure, and target outcomes.' },
      { title: 'Trial Build', description: 'Join a studio lab to prototype with guidance from mentors.' },
      { title: 'Plan', description: 'Receive a personalized roadmap and capstone proposal outline.' },
      { title: 'Launch', description: 'Secure enrollment, set milestones, and join the cohort community.' },
    ],
    ctaLabel: 'Book a FREE Trial Class',
  },
];
