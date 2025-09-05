// CaseStudy data model and sample data for portfolio case studies
export interface CaseStudy {
  id: string; // unique slug or id
  title: string;
  heroImage: string; // path or URL
  subheadline: string; // New field for carousel summary
  context: string; // Markdown
  challenge: string; // Markdown
  keyDecisions: Array<{
    title: string;
    description: string; // Markdown
    images?: string[];
  }>;
  tags: string[];
  date: string; // ISO format
  role: string;
  tools: string[];
  client?: string;
  scope?: string[];
  timeline?: string;
  metrics?: Array<{
    value: number;
    label: string;
    suffix?: string;
    prefix?: string;
  }>;
  reflections?: Array<{
    title: string;
    body: string;
  }>;
  learningSummary?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'wbl-lims',
    title: 'Wasatch BioLabs',
    heroImage: '/images/wbl-lims.png',
    subheadline: 'A fast-growing biotech startup needed a scalable, user-friendly Laboratory Information Management System (LIMS) to support rapid R&D and regulatory compliance.',
    context: `**Client:** Wasatch BioLabs`,
    challenge: `The legacy LIMS was fragmented, slow, and error-prone. Scientists struggled with data entry, tracking, and reporting, leading to workflow bottlenecks and compliance risks.`,
    keyDecisions: [
      {
        title: 'Prioritizing Sample Order Flows',
        description: `We focused on the sample order creation and tracking flows early. This decision came from feedback that scientists spent too much time navigating between fragmented screens. Streamlining the flow reduced back-and-forth navigation, meaning users could create and track orders without breaking focus.`,
        images: ['/images/wbl-lims.png']
      },
      {
        title: 'Role-Based Dashboards',
        description: `We chose to design dashboards tailored for different user roles rather than a generic landing page. This decision ensured that lab managers, technicians, and admins immediately saw the tools and data most relevant to their work. Users gained efficiency by reducing the clutter of irrelevant information.`,
        images: ['/images/portfolio.png']
      },
      {
        title: 'Progressive Onboarding',
        description: `Instead of a lengthy walkthrough, onboarding was broken into lightweight tooltips revealed as users performed tasks. This helped lower the learning curve for new lab staff and avoided overwhelming them with instructions. Users felt more confident starting on day one.`,
        images: ['/images/wbl-lims.png']
      },
      {
        title: 'Batch Actions for Efficiency',
        description: `We introduced bulk-edit and batch actions in sample management. The choice was based on the high volume of repetitive data entry reported by technicians. By supporting multi-selection and editing, users cut task times significantly and reduced input errors.`,
        images: ['/images/portfolio.png']
      },
      {
        title: 'Transparent Reporting Structure',
        description: `We redesigned reporting from rigid static PDFs into customizable, filterable reports inside the app. This gave users direct control over what they exported and reduced the reliance on external spreadsheets. Users felt empowered and trusted the system more.`,
        images: ['/images/wbl-lims.png']
      },
      {
        title: 'Consistent Navigation Patterns',
        description: `We standardized navigation across all core modules with a left-hand persistent sidebar instead of top-level tabs that shifted between contexts. The consistency reduced user disorientation, allowing faster task switching and fewer clicks to find features.`,
        images: ['/images/portfolio.png']
      },
      {
        title: 'Lightweight User Management',
        description: `We avoided a heavy "enterprise" permissions setup and instead created a simplified role + custom rule system. The decision balanced flexibility with usability, so lab managers could adjust roles without needing IT. Users gained faster access and admins had less overhead.`,
        images: ['/images/wbl-lims.png']
      },
      {
        title: 'Minimalist Data Density',
        description: `Instead of crowding data tables, we surfaced only the most critical columns by default and allowed users to toggle additional ones. This decision prevented cognitive overload and gave users control. Scientists could focus on what mattered while still having depth when needed.`,
        images: ['/images/portfolio.png']
      }
    ],
    tags: ['LIMS', 'UX Research', 'Design System'],
    date: '2024-05-15',
    role: 'Lead UX Designer',
    tools: ['Figma', 'Tailwind CSS', 'React'],
    client: 'Wasatch BioLabs',
    scope: ['UX Research', 'UI Design', 'Design System'],
    timeline: 'Jan 2024 – May 2024',
    metrics: [
      {
        value: 45,
        label: 'Faster Data Entry',
        suffix: '%'
      },
      {
        value: 78,
        label: 'User Satisfaction',
        suffix: '%'
      },
      {
        value: 60,
        label: 'Fewer Errors',
        suffix: '%'
      }
    ],
    reflections: [
      {
        title: "Balancing Competing Stakeholder Needs",
        body: "I learned to mediate between the CEO's desire for detailed reporting and lab technicians' need for speed and simplicity."
      },
      {
        title: "Designing for Scalability",
        body: "By creating modular UI components and flexible data structures, I ensured the platform could evolve with new lab requirements."
      },
      {
        title: "The Value of Progressive Onboarding",
        body: "Introducing guidance only when needed kept users from feeling overwhelmed while learning a complex system."
      }
    ],
    learningSummary: "This project reinforced the importance of deeply understanding user workflows before making major design decisions."
  },
  // Add more case studies as needed
];

// Ready for finalized content and future embed support 