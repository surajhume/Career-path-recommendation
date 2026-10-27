
const qualifications = [
  "8th Pass",
  "10th Pass",
  "12th Science",
  "12th Commerce",
  "12th Arts",
  "Diploma - Engineering",
  "Diploma - Non-Engineering",
  "Graduation - Science",
  "Graduation - Commerce",
  "Graduation - Arts",
  "Graduation - Professional (CA, CS, Law)",
  "Post Graduation - Science",
  "Post Graduation - Commerce",
  "Post Graduation - Arts",
  "PhD",
  "International High School Diploma",
  "Online Certifications (AI/ML/Data Science)",
  "Professional Certifications (AWS, PMP, Google, Microsoft)",
];

const exams = {
  govt: [
    "UPSC Civil Services",
    "SSC CGL",
    "IBPS Bank PO",
    "Railway Recruitment Board",
    "State PSC Exams",
    "Defence Services (NDA/CDS/SSB)",
    "PSU Exams (ONGC, NTPC, IOCL, SAIL)",
    "LIC AAO",
    "SSC JE",
  ],
  private: [
    "CAT (MBA entrance)",
    "GRE/GMAT",
    "IELTS/TOEFL",
    "Google Career Certificates",
    "Coursera Specializations",
    "AWS Certification",
    "PMP Certification",
    "Digital Marketing Certification",
  ],
};

const careerGoals = [
  "Software Developer",
  "Data Scientist",
  "Civil Services (IAS/IPS)",
  "Bank PO",
  "Entrepreneur",
  "Teacher/Professor",
  "Researcher",
  "Artist",
  "Sports Professional",
  "Machine Learning Engineer",
  "Product Manager",
  "Digital Marketer",
  "Blockchain Developer",
  "Cybersecurity Specialist",
  "Content Creator/YouTuber",
  "Financial Analyst",
];

const careerPaths = {
  "8th Pass": ["Basic vocational courses", "Apprenticeships", "Skill development programs"],
  "10th Pass": ["ITI courses", "Diploma courses", "Start vocational training", "Apprenticeship"],
  "12th Science": ["Engineering", "Medical", "Pure Science degrees", "Data Science courses"],
  "12th Commerce": ["B.Com", "Chartered Accountancy", "Banking exams preparation"],
  "12th Arts": ["BA", "Civil Services preparation", "Journalism"],
  "Diploma - Engineering": ["Lateral entry to Engineering degree", "Technical jobs"],
  "Diploma - Non-Engineering": ["Job in relevant field", "Professional certificates"],
  "Graduation - Science": ["M.Sc", "Research", "Software Developer", "Data Scientist"],
  "Graduation - Commerce": ["MBA", "Bank PO", "Accounting jobs", "Financial Analyst"],
  "Graduation - Arts": ["MA", "Civil Services", "Teaching", "Content Creation"],
  "Graduation - Professional (CA, CS, Law)": ["Professional practice", "Corporate jobs", "Consulting"],
  "Post Graduation - Science": ["PhD", "Research", "Higher teaching", "Corporate R&D"],
  "Post Graduation - Commerce": ["Higher studies", "Financial services", "Consulting"],
  "Post Graduation - Arts": ["PhD", "Research", "Teaching", "Policy making"],
  "PhD": ["Research", "University professor", "Consulting"],
  "International High School Diploma": ["Apply to International Universities", "Online Courses", "Internships Abroad"],
  "Online Certifications (AI/ML/Data Science)": ["Build Portfolio", "Freelance Projects", "Apply for Tech Jobs"],
  "Professional Certifications (AWS, PMP, Google, Microsoft)": ["Specialize career", "Consulting", "Corporate roles"],
};

const goalPaths = {
  "Software Developer": [
    "Complete B.Tech or relevant degree",
    "Learn programming languages",
    "Internships",
    "Apply to IT companies",
  ],
  "Data Scientist": [
    "Learn statistics and programming",
    "Take AI/ML courses",
    "Work on projects",
    "Apply for data science roles",
  ],
  "Civil Services (IAS/IPS)": [
    "Graduate in any stream",
    "Start UPSC preparation",
    "Appear for exams",
    "Join services",
  ],
  "Bank PO": ["Graduate", "Prepare for banking exams", "Clear exams", "Join banks"],
  "Entrepreneur": ["Identify business idea", "Create business plan", "Raise funds", "Launch startup"],
  "Teacher/Professor": [
    "Complete relevant degree",
    "Clear teaching eligibility tests",
    "Apply for teaching jobs",
  ],
  "Researcher": ["Post graduation", "Join research institutes", "Publish papers"],
  "Artist": ["Develop portfolio", "Take art courses", "Participate in exhibitions"],
  "Sports Professional": ["Train rigorously", "Participate in tournaments", "Join professional clubs"],
  "Machine Learning Engineer": [
    "Complete degree in CS/Math",
    "Specialize in ML/AI courses",
    "Build projects",
    "Apply for ML engineer roles",
  ],
  "Product Manager": [
    "Gain experience in tech or business",
    "Learn product management",
    "Work on projects",
    "Apply to PM roles",
  ],
  "Digital Marketer": [
    "Learn digital marketing skills",
    "Gain certifications",
    "Work on campaigns",
    "Apply to marketing roles",
  ],
  "Blockchain Developer": [
    "Learn blockchain basics",
    "Build decentralized apps",
    "Contribute to open source",
    "Apply to blockchain firms",
  ],
  "Cybersecurity Specialist": [
    "Study cybersecurity concepts",
    "Get certifications (CEH, CISSP)",
    "Work on security projects",
    "Join cybersecurity companies",
  ],
  "Content Creator/YouTuber": [
    "Identify niche",
    "Create content regularly",
    "Grow audience",
    "Monetize platform",
  ],
  "Financial Analyst": [
    "Learn finance and analytics",
    "Gain certifications (CFA)",
    "Work on financial models",
    "Join finance companies",
  ],
};

const backupPlans = {
  "Failed Govt Exams": [
    "Try alternate government exams",
    "Pursue higher education",
    "Explore private sector jobs",
    "Take online skill courses",
  ],
  "Tech Career Roadblocks": [
    "Switch to related fields like testing or support",
    "Take up freelancing",
    "Learn new skills",
    "Consider entrepreneurship",
  ],
  "Entrepreneurship Risks": [
    "Have a fallback job plan",
    "Keep learning business skills",
    "Network extensively",
    "Seek mentorship",
  ],
};

/* ------------------------------------------------------------------ *
 *  Recommendation data (added in v2)
 *  Everything below feeds engine.js. See README "Extending the data".
 * ------------------------------------------------------------------ */

/**
 * Interests the user can pick. `id` is what career profiles reference.
 */
const interests = [
  { id: "tech", label: "Building software & technology" },
  { id: "data", label: "Working with data & numbers" },
  { id: "business", label: "Business & strategy" },
  { id: "finance", label: "Money, markets & banking" },
  { id: "creative", label: "Art, design & creativity" },
  { id: "people", label: "Teaching & helping people" },
  { id: "research", label: "Research & discovery" },
  { id: "publicservice", label: "Public service & governance" },
  { id: "sports", label: "Sports & fitness" },
  { id: "security", label: "Security & protecting systems" },
  { id: "media", label: "Writing, video & storytelling" },
  { id: "entrepreneurship", label: "Starting & building ventures" },
];

/**
 * Skill catalogue. `learn` is a short, generic pointer on where to start.
 */
const skills = [
  // Technical
  { id: "programming", label: "Programming fundamentals", category: "Technical", learn: "Start with CS50x or freeCodeCamp, then build small projects." },
  { id: "python", label: "Python", category: "Technical", learn: "Python basics, then libraries relevant to your goal (pandas, NumPy)." },
  { id: "dsa", label: "Data structures & algorithms", category: "Technical", learn: "Practise arrays, trees, graphs and recursion on a coding-practice site." },
  { id: "web", label: "Web development", category: "Technical", learn: "HTML, CSS, JavaScript, then a framework; deploy something real." },
  { id: "databases", label: "SQL & databases", category: "Technical", learn: "Learn SQL joins, indexes and basic schema design." },
  { id: "git", label: "Git & version control", category: "Technical", learn: "Use Git and GitHub for every project, including pull requests." },
  { id: "cloud", label: "Cloud basics", category: "Technical", learn: "Entry-level cloud certification (e.g. AWS Cloud Practitioner)." },
  { id: "networking", label: "Computer networking", category: "Technical", learn: "TCP/IP, DNS, HTTP, firewalls; a networking fundamentals course." },
  { id: "linux", label: "Linux & command line", category: "Technical", learn: "Practise shell, permissions, processes on a Linux VM." },
  { id: "security", label: "Security fundamentals", category: "Technical", learn: "OWASP Top 10, cryptography basics, capture-the-flag practice." },
  { id: "blockchain", label: "Blockchain & smart contracts", category: "Technical", learn: "Learn Ethereum basics and write a simple Solidity contract." },
  { id: "ml", label: "Machine learning", category: "Technical", learn: "An introductory ML course, then end-to-end projects on real data." },

  // Data & maths
  { id: "statistics", label: "Statistics & probability", category: "Data & Maths", learn: "Descriptive stats, distributions, hypothesis testing." },
  { id: "maths", label: "Linear algebra & calculus", category: "Data & Maths", learn: "Khan Academy or NPTEL courses on linear algebra and calculus." },
  { id: "dataviz", label: "Data visualisation", category: "Data & Maths", learn: "Practise charts with a BI tool or a plotting library." },
  { id: "excel", label: "Spreadsheets & Excel", category: "Data & Maths", learn: "Formulas, pivot tables, lookups, basic modelling." },
  { id: "analytics", label: "Business & web analytics", category: "Data & Maths", learn: "Learn to read funnels, cohorts and campaign metrics." },
  { id: "quant", label: "Quantitative aptitude", category: "Data & Maths", learn: "Daily timed practice: percentages, ratios, data interpretation." },
  { id: "reasoning", label: "Logical reasoning", category: "Data & Maths", learn: "Puzzles, syllogisms, seating arrangements; timed mock tests." },

  // Business
  { id: "finance", label: "Accounting & financial modelling", category: "Business", learn: "Financial statements, valuation basics, build a 3-statement model." },
  { id: "business", label: "Business planning", category: "Business", learn: "Write a lean business plan; study unit economics." },
  { id: "marketing", label: "Digital marketing & SEO", category: "Business", learn: "SEO, social, email and paid-ads fundamentals; run a small campaign." },
  { id: "sales", label: "Sales & negotiation", category: "Business", learn: "Practise pitching and handling objections with real prospects." },
  { id: "product", label: "Product thinking", category: "Business", learn: "User research, prioritisation, writing a product requirements doc." },

  // People & communication
  { id: "communication", label: "Communication", category: "People & Communication", learn: "Practise clear speaking and writing; get feedback regularly." },
  { id: "writing", label: "Writing", category: "People & Communication", learn: "Write regularly; edit ruthlessly; publish a blog or essays." },
  { id: "public_speaking", label: "Public speaking", category: "People & Communication", learn: "Join a speaking club; record and review yourself." },
  { id: "leadership", label: "Leadership & teamwork", category: "People & Communication", learn: "Lead a club or project; learn to delegate and give feedback." },
  { id: "teaching", label: "Teaching & mentoring", category: "People & Communication", learn: "Tutor peers; learn lesson planning and assessment design." },
  { id: "research", label: "Research methods", category: "People & Communication", learn: "Literature reviews, experiment design, citing and reproducibility." },

  // Creative & personal
  { id: "creativity", label: "Design & creativity", category: "Creative & Personal", learn: "Daily practice, a portfolio, and design fundamentals." },
  { id: "video", label: "Video & storytelling", category: "Creative & Personal", learn: "Shooting, editing and scripting short-form and long-form video." },
  { id: "fitness", label: "Physical fitness", category: "Creative & Personal", learn: "Structured training with progression and recovery." },
  { id: "time", label: "Time management & discipline", category: "Creative & Personal", learn: "Weekly planning, deep-work blocks and revision schedules." },
  { id: "gk", label: "General knowledge & current affairs", category: "Creative & Personal", learn: "Daily newspaper reading plus monthly current-affairs revision." },
  { id: "problem_solving", label: "Problem solving", category: "Creative & Personal", learn: "Break problems down; practise case studies and puzzles." },
];

/**
 * Qualification -> numeric level and stream.
 * level: 1=8th, 2=10th, 3=12th/diploma, 4=graduation, 5=post-graduation, 6=doctorate
 * stream: science | commerce | arts | tech | professional | vocational | any
 */
const qualificationProfiles = {
  "8th Pass": { level: 1, stream: "vocational" },
  "10th Pass": { level: 2, stream: "vocational" },
  "12th Science": { level: 3, stream: "science" },
  "12th Commerce": { level: 3, stream: "commerce" },
  "12th Arts": { level: 3, stream: "arts" },
  "Diploma - Engineering": { level: 3.5, stream: "tech" },
  "Diploma - Non-Engineering": { level: 3.5, stream: "vocational" },
  "Graduation - Science": { level: 4, stream: "science" },
  "Graduation - Commerce": { level: 4, stream: "commerce" },
  "Graduation - Arts": { level: 4, stream: "arts" },
  "Graduation - Professional (CA, CS, Law)": { level: 4.5, stream: "professional" },
  "Post Graduation - Science": { level: 5, stream: "science" },
  "Post Graduation - Commerce": { level: 5, stream: "commerce" },
  "Post Graduation - Arts": { level: 5, stream: "arts" },
  "PhD": { level: 6, stream: "any" },
  "International High School Diploma": { level: 3, stream: "any" },
  "Online Certifications (AI/ML/Data Science)": { level: 3.5, stream: "tech" },
  "Professional Certifications (AWS, PMP, Google, Microsoft)": { level: 4, stream: "professional" },
};

/**
 * One profile per entry in `careerGoals`.
 *  summary    one-line description
 *  minLevel   minimum qualification level usually expected
 *  streams    preferred streams ("any" = open to all)
 *  interests  interest ids that fit this career
 *  skills     [{ id, weight }] weight: 3 critical, 2 important, 1 nice-to-have
 *  exams      relevant exams / certifications (free text)
 *  backup     key into `backupPlans` (optional)
 *  roadmap    ordered stages, each { title, weeks, tasks[] }
 */
const careerProfiles = {
  "Software Developer": {
    summary: "Design, build and maintain software for web, mobile and backend systems.",
    minLevel: 3,
    streams: ["tech", "science"],
    interests: ["tech", "data"],
    skills: [
      { id: "programming", weight: 3 }, { id: "dsa", weight: 3 }, { id: "problem_solving", weight: 3 },
      { id: "web", weight: 2 }, { id: "databases", weight: 2 }, { id: "git", weight: 2 },
      { id: "cloud", weight: 1 }, { id: "communication", weight: 1 },
    ],
    exams: ["Campus placements", "Company coding assessments"],
    backup: "Tech Career Roadblocks",
    roadmap: [
      { title: "Foundations", weeks: 8, tasks: ["Learn one language well (Python, Java or JavaScript)", "Solve 50 beginner coding problems", "Learn Git and publish code on GitHub"] },
      { title: "Core computer science", weeks: 12, tasks: ["Study data structures and algorithms", "Learn SQL and basic database design", "Understand how the web works (HTTP, APIs)"] },
      { title: "Build and prove it", weeks: 12, tasks: ["Build and deploy 2-3 full projects", "Contribute to an open-source project", "Apply for internships or apprenticeships"] },
      { title: "Get hired", weeks: 8, tasks: ["Practise mock technical interviews", "Polish resume, GitHub and LinkedIn", "Apply to IT companies and startups"] },
    ],
  },
  "Data Scientist": {
    summary: "Turn raw data into insight using statistics, programming and machine learning.",
    minLevel: 4,
    streams: ["science", "tech"],
    interests: ["data", "tech", "research"],
    skills: [
      { id: "python", weight: 3 }, { id: "statistics", weight: 3 }, { id: "databases", weight: 2 },
      { id: "ml", weight: 2 }, { id: "dataviz", weight: 2 }, { id: "problem_solving", weight: 2 },
      { id: "communication", weight: 2 }, { id: "excel", weight: 1 },
    ],
    exams: ["Online ML / Data Science certifications"],
    backup: "Tech Career Roadblocks",
    roadmap: [
      { title: "Maths and programming base", weeks: 8, tasks: ["Learn Python, pandas and NumPy", "Revise probability and statistics", "Learn SQL for data extraction"] },
      { title: "Analysis and visualisation", weeks: 6, tasks: ["Clean and explore three real datasets", "Build dashboards or charts that tell a story", "Learn hypothesis testing and A/B testing"] },
      { title: "Machine learning", weeks: 12, tasks: ["Complete an introductory ML course", "Build regression and classification models", "Learn model evaluation and validation"] },
      { title: "Portfolio and applications", weeks: 8, tasks: ["Publish 3 end-to-end projects with write-ups", "Take part in a data competition", "Apply for analyst and data science roles"] },
    ],
  },
  "Civil Services (IAS/IPS)": {
    summary: "Serve in the administrative, police or foreign services through the UPSC exam.",
    minLevel: 4,
    streams: ["any"],
    interests: ["publicservice", "people"],
    skills: [
      { id: "gk", weight: 3 }, { id: "writing", weight: 3 }, { id: "reasoning", weight: 2 },
      { id: "communication", weight: 2 }, { id: "time", weight: 2 }, { id: "quant", weight: 1 },
      { id: "public_speaking", weight: 1 },
    ],
    exams: ["UPSC Civil Services", "State PSC Exams"],
    backup: "Failed Govt Exams",
    roadmap: [
      { title: "Eligibility and syllabus", weeks: 4, tasks: ["Confirm eligibility, age limit and attempt count", "Study the prelims and mains syllabus and past papers", "Choose an optional subject"] },
      { title: "Foundation study", weeks: 24, tasks: ["Read NCERT books for core subjects", "Build a daily newspaper and current-affairs habit", "Start answer-writing practice"] },
      { title: "Prelims preparation", weeks: 16, tasks: ["Revise static subjects in cycles", "Take full-length mock tests weekly", "Analyse mistakes after every test"] },
      { title: "Mains and interview", weeks: 20, tasks: ["Write timed answers daily", "Join a test series for mains", "Prepare for the personality test with mock interviews"] },
    ],
  },
  "Bank PO": {
    summary: "Join a public or private bank as a probationary officer via IBPS/SBI exams.",
    minLevel: 4,
    streams: ["any"],
    interests: ["finance", "business"],
    skills: [
      { id: "quant", weight: 3 }, { id: "reasoning", weight: 3 }, { id: "communication", weight: 2 },
      { id: "gk", weight: 2 }, { id: "time", weight: 2 }, { id: "finance", weight: 1 },
    ],
    exams: ["IBPS Bank PO", "LIC AAO"],
    backup: "Failed Govt Exams",
    roadmap: [
      { title: "Understand the exam", weeks: 2, tasks: ["Check eligibility and the exam pattern", "Download previous-year papers", "Make a weekly study plan"] },
      { title: "Section-wise preparation", weeks: 12, tasks: ["Practise quantitative aptitude daily", "Practise reasoning puzzles and seating arrangements", "Improve English and banking awareness"] },
      { title: "Mock tests", weeks: 8, tasks: ["Take two full mocks a week", "Track accuracy and speed per section", "Revise weak topics"] },
      { title: "Prelims, mains and interview", weeks: 10, tasks: ["Appear for prelims and mains", "Prepare for group exercise and interview", "Complete document verification and join"] },
    ],
  },
  "Entrepreneur": {
    summary: "Identify a problem, build a business around it and grow it sustainably.",
    minLevel: 1,
    streams: ["any"],
    interests: ["entrepreneurship", "business", "creative"],
    skills: [
      { id: "business", weight: 3 }, { id: "leadership", weight: 3 }, { id: "sales", weight: 2 },
      { id: "finance", weight: 2 }, { id: "communication", weight: 2 }, { id: "problem_solving", weight: 2 },
      { id: "marketing", weight: 1 },
    ],
    exams: [],
    backup: "Entrepreneurship Risks",
    roadmap: [
      { title: "Find a real problem", weeks: 4, tasks: ["Interview 20 potential customers", "Pick one problem worth solving", "Write a one-page business idea"] },
      { title: "Validate cheaply", weeks: 8, tasks: ["Build the smallest possible version", "Get 10 people to try or pay for it", "Measure what they actually do"] },
      { title: "Plan and fund", weeks: 8, tasks: ["Create a business plan and basic financial model", "Register the business and open a bank account", "Explore bootstrapping, grants or investors"] },
      { title: "Launch and grow", weeks: 12, tasks: ["Launch to your first customers", "Track revenue, costs and retention monthly", "Find a mentor and build a small team"] },
    ],
  },
  "Teacher/Professor": {
    summary: "Educate students in schools or colleges and shape curricula.",
    minLevel: 4,
    streams: ["any"],
    interests: ["people", "research"],
    skills: [
      { id: "teaching", weight: 3 }, { id: "communication", weight: 3 }, { id: "public_speaking", weight: 2 },
      { id: "research", weight: 2 }, { id: "leadership", weight: 1 }, { id: "writing", weight: 1 },
    ],
    exams: ["CTET / TET", "UGC NET", "State SET"],
    backup: null,
    roadmap: [
      { title: "Qualify in your subject", weeks: 12, tasks: ["Complete your degree (B.Ed. for school teaching, Master's for college)", "Strengthen subject depth", "Identify your target level (school, college, university)"] },
      { title: "Eligibility tests", weeks: 16, tasks: ["Register for CTET/TET or UGC NET as appropriate", "Take mock tests and revise syllabus", "Clear the eligibility test"] },
      { title: "Build teaching experience", weeks: 12, tasks: ["Tutor or assist in classes", "Design and deliver a sample lesson", "Collect student feedback"] },
      { title: "Apply", weeks: 8, tasks: ["Prepare a teaching statement and CV", "Apply to schools, colleges and universities", "Prepare for demo lectures"] },
    ],
  },
  "Researcher": {
    summary: "Create new knowledge through structured study, experiments and publication.",
    minLevel: 5,
    streams: ["science", "arts"],
    interests: ["research", "data"],
    skills: [
      { id: "research", weight: 3 }, { id: "writing", weight: 3 }, { id: "statistics", weight: 2 },
      { id: "problem_solving", weight: 2 }, { id: "python", weight: 1 }, { id: "reasoning", weight: 1 },
    ],
    exams: ["GATE / UGC NET / CSIR NET", "University PhD entrance tests"],
    backup: null,
    roadmap: [
      { title: "Postgraduate foundation", weeks: 24, tasks: ["Complete a Master's in your field", "Do a research-based dissertation", "Find a faculty mentor"] },
      { title: "Research skills", weeks: 12, tasks: ["Learn literature review and citation tools", "Learn statistics and experimental design", "Replicate a published study"] },
      { title: "Entry to research", weeks: 16, tasks: ["Qualify NET/GATE for fellowships", "Apply to research institutes and PhD programmes", "Prepare a research proposal"] },
      { title: "Publish", weeks: 24, tasks: ["Write a first paper with your supervisor", "Present at a conference", "Build a network of collaborators"] },
    ],
  },
  "Artist": {
    summary: "Create original work in visual art, design, music or performance.",
    minLevel: 1,
    streams: ["arts", "vocational"],
    interests: ["creative", "media"],
    skills: [
      { id: "creativity", weight: 3 }, { id: "time", weight: 1 }, { id: "marketing", weight: 1 },
      { id: "communication", weight: 1 }, { id: "video", weight: 1 },
    ],
    exams: ["Art school entrance (NID, NIFT, UCEED, CEED)"],
    backup: null,
    roadmap: [
      { title: "Develop your craft", weeks: 24, tasks: ["Practise daily and finish pieces", "Learn the fundamentals of your medium", "Study artists you admire"] },
      { title: "Build a portfolio", weeks: 12, tasks: ["Curate 10-15 of your best works", "Create an online portfolio", "Document your process"] },
      { title: "Get seen", weeks: 12, tasks: ["Join group exhibitions or showcases", "Share work on social platforms", "Apply to residencies, competitions or art schools"] },
      { title: "Earn from your art", weeks: 16, tasks: ["Take commissions or freelance work", "Price your work sustainably", "Build a returning audience"] },
    ],
  },
  "Sports Professional": {
    summary: "Compete at a high level or build a career in sport.",
    minLevel: 1,
    streams: ["any"],
    interests: ["sports", "people"],
    skills: [
      { id: "fitness", weight: 3 }, { id: "time", weight: 2 }, { id: "leadership", weight: 2 },
      { id: "communication", weight: 1 },
    ],
    exams: ["District / state selection trials", "SAI talent schemes"],
    backup: null,
    roadmap: [
      { title: "Train with structure", weeks: 24, tasks: ["Join a coach or academy", "Follow a periodised training plan", "Track nutrition, sleep and recovery"] },
      { title: "Compete", weeks: 24, tasks: ["Enter school, district and state tournaments", "Record results and review video", "Work on mental resilience"] },
      { title: "Go professional", weeks: 24, tasks: ["Attend selection trials", "Join a professional club or academy", "Apply for sports quota schemes where eligible"] },
      { title: "Plan for the long term", weeks: 8, tasks: ["Complete your education alongside training", "Learn about coaching and sports-science pathways", "Build a post-playing career plan"] },
    ],
  },
  "Machine Learning Engineer": {
    summary: "Build, deploy and maintain machine learning systems in production.",
    minLevel: 4,
    streams: ["science", "tech"],
    interests: ["tech", "data", "research"],
    skills: [
      { id: "python", weight: 3 }, { id: "ml", weight: 3 }, { id: "maths", weight: 2 },
      { id: "statistics", weight: 2 }, { id: "programming", weight: 2 }, { id: "git", weight: 2 },
      { id: "cloud", weight: 1 },
    ],
    exams: ["Online ML certifications", "Cloud ML certifications"],
    backup: "Tech Career Roadblocks",
    roadmap: [
      { title: "Maths and code", weeks: 10, tasks: ["Refresh linear algebra, calculus and probability", "Become fluent in Python and NumPy", "Learn Git and testing basics"] },
      { title: "Core ML", weeks: 12, tasks: ["Complete an ML specialisation", "Implement classic algorithms from scratch", "Learn deep-learning basics with a major framework"] },
      { title: "Engineering for ML", weeks: 10, tasks: ["Learn to package and serve a model as an API", "Learn cloud basics and containers", "Set up experiment tracking"] },
      { title: "Projects and roles", weeks: 10, tasks: ["Ship 2-3 deployed ML projects", "Read and reproduce a paper", "Apply for ML engineer roles"] },
    ],
  },
  "Product Manager": {
    summary: "Decide what to build and why, aligning users, business and engineering.",
    minLevel: 4,
    streams: ["tech", "commerce", "professional"],
    interests: ["tech", "business", "people"],
    skills: [
      { id: "product", weight: 3 }, { id: "communication", weight: 3 }, { id: "analytics", weight: 2 },
      { id: "business", weight: 2 }, { id: "leadership", weight: 2 }, { id: "problem_solving", weight: 2 },
    ],
    exams: ["Product management certifications", "CAT (MBA entrance)"],
    backup: "Tech Career Roadblocks",
    roadmap: [
      { title: "Learn the craft", weeks: 6, tasks: ["Study product discovery and prioritisation", "Learn to write product requirement documents", "Understand how software teams ship"] },
      { title: "Get close to products", weeks: 12, tasks: ["Take on product-like work in your current role or a side project", "Practise user interviews", "Learn basic SQL and analytics"] },
      { title: "Show your thinking", weeks: 8, tasks: ["Write 3 product teardowns", "Build or run a small product end to end", "Practise product-sense interview questions"] },
      { title: "Apply", weeks: 8, tasks: ["Target associate PM or APM programmes", "Network with product managers", "Apply to PM roles"] },
    ],
  },
  "Digital Marketer": {
    summary: "Grow audiences and revenue through search, social, email and paid channels.",
    minLevel: 3,
    streams: ["commerce", "arts"],
    interests: ["business", "media", "creative"],
    skills: [
      { id: "marketing", weight: 3 }, { id: "analytics", weight: 3 }, { id: "writing", weight: 2 },
      { id: "creativity", weight: 2 }, { id: "communication", weight: 1 }, { id: "excel", weight: 1 },
    ],
    exams: ["Digital Marketing Certification", "Google Career Certificates"],
    backup: null,
    roadmap: [
      { title: "Learn the channels", weeks: 6, tasks: ["Learn SEO, social media and email marketing", "Learn paid ads basics", "Get a recognised digital marketing certificate"] },
      { title: "Practise on real campaigns", weeks: 8, tasks: ["Run a small campaign for a local business or your own page", "Set up analytics and track conversions", "Write a short case study of the results"] },
      { title: "Specialise", weeks: 8, tasks: ["Pick one specialism (SEO, paid, content or analytics)", "Learn the leading tools in that area", "Earn an advanced certification"] },
      { title: "Apply", weeks: 6, tasks: ["Build a portfolio of case studies", "Apply to agencies and in-house marketing roles", "Consider freelance clients"] },
    ],
  },
  "Blockchain Developer": {
    summary: "Build decentralised applications and smart contracts.",
    minLevel: 3,
    streams: ["tech", "science"],
    interests: ["tech", "finance", "security"],
    skills: [
      { id: "blockchain", weight: 3 }, { id: "programming", weight: 3 }, { id: "security", weight: 2 },
      { id: "web", weight: 2 }, { id: "git", weight: 2 }, { id: "dsa", weight: 1 }, { id: "finance", weight: 1 },
    ],
    exams: ["Blockchain developer certifications"],
    backup: "Tech Career Roadblocks",
    roadmap: [
      { title: "Programming and web base", weeks: 8, tasks: ["Become comfortable in JavaScript or TypeScript", "Learn Git and basic web development", "Understand cryptography basics (hashing, signatures)"] },
      { title: "Blockchain fundamentals", weeks: 6, tasks: ["Learn how blocks, consensus and wallets work", "Study Ethereum and the EVM", "Learn Solidity"] },
      { title: "Build dApps", weeks: 10, tasks: ["Write and test smart contracts", "Build a front end that talks to a contract", "Learn common smart-contract vulnerabilities"] },
      { title: "Contribute and apply", weeks: 8, tasks: ["Contribute to an open-source blockchain project", "Take part in a hackathon", "Apply to blockchain firms"] },
    ],
  },
  "Cybersecurity Specialist": {
    summary: "Protect systems, networks and data from attackers.",
    minLevel: 3,
    streams: ["tech", "science"],
    interests: ["security", "tech"],
    skills: [
      { id: "security", weight: 3 }, { id: "networking", weight: 3 }, { id: "linux", weight: 2 },
      { id: "problem_solving", weight: 2 }, { id: "programming", weight: 1 }, { id: "cloud", weight: 1 },
    ],
    exams: ["CompTIA Security+", "CEH", "CISSP (with experience)"],
    backup: "Tech Career Roadblocks",
    roadmap: [
      { title: "IT foundations", weeks: 8, tasks: ["Learn networking (TCP/IP, DNS, HTTP)", "Get comfortable with Linux", "Learn basic scripting"] },
      { title: "Security concepts", weeks: 10, tasks: ["Study security fundamentals and common attacks", "Learn cryptography basics", "Get an entry-level certification such as Security+"] },
      { title: "Hands-on practice", weeks: 12, tasks: ["Practise on capture-the-flag platforms", "Build a home lab", "Do vulnerability assessments on systems you own"] },
      { title: "Certify and apply", weeks: 8, tasks: ["Earn an intermediate certification (e.g. CEH)", "Write up your lab work", "Apply to SOC and security analyst roles"] },
    ],
  },
  "Content Creator/YouTuber": {
    summary: "Build an audience with consistent, valuable content and monetise it.",
    minLevel: 2,
    streams: ["any"],
    interests: ["media", "creative", "entrepreneurship"],
    skills: [
      { id: "video", weight: 3 }, { id: "creativity", weight: 3 }, { id: "writing", weight: 2 },
      { id: "marketing", weight: 2 }, { id: "communication", weight: 2 }, { id: "analytics", weight: 1 },
    ],
    exams: [],
    backup: "Entrepreneurship Risks",
    roadmap: [
      { title: "Choose a niche", weeks: 3, tasks: ["List topics you can talk about for years", "Study 10 successful channels in the niche", "Define who you are making content for"] },
      { title: "Create consistently", weeks: 16, tasks: ["Publish on a fixed schedule", "Learn basic filming, audio and editing", "Review analytics and improve each video"] },
      { title: "Grow the audience", weeks: 16, tasks: ["Learn titles, thumbnails and hooks", "Collaborate with other creators", "Build an email list or community"] },
      { title: "Monetise", weeks: 12, tasks: ["Enable platform monetisation when eligible", "Add sponsorships or affiliate income", "Create your own product or service"] },
    ],
  },
  "Financial Analyst": {
    summary: "Evaluate investments and company performance to guide financial decisions.",
    minLevel: 4,
    streams: ["commerce", "professional"],
    interests: ["finance", "data", "business"],
    skills: [
      { id: "finance", weight: 3 }, { id: "excel", weight: 3 }, { id: "quant", weight: 2 },
      { id: "communication", weight: 2 }, { id: "statistics", weight: 1 }, { id: "dataviz", weight: 1 },
      { id: "business", weight: 1 }, { id: "python", weight: 1 },
    ],
    exams: ["CFA", "FRM", "CA / CMA"],
    backup: null,
    roadmap: [
      { title: "Finance fundamentals", weeks: 8, tasks: ["Learn to read financial statements", "Learn corporate-finance and valuation basics", "Become fast in Excel"] },
      { title: "Modelling", weeks: 10, tasks: ["Build a three-statement model for a listed company", "Build a DCF valuation", "Write an equity research note"] },
      { title: "Credentials", weeks: 24, tasks: ["Register for CFA Level I (or an equivalent)", "Follow a structured study schedule", "Take mock exams"] },
      { title: "Get hired", weeks: 8, tasks: ["Prepare for finance and case interviews", "Apply to banks, research firms and corporates", "Network with practising analysts"] },
    ],
  },
};

/* Make the data available to Node (tests) as well as the browser. */
const CareerData = {
  qualifications, exams, careerGoals, careerPaths, goalPaths, backupPlans,
  interests, skills, qualificationProfiles, careerProfiles,
};
if (typeof module !== "undefined" && module.exports) {
  module.exports = CareerData;
}
