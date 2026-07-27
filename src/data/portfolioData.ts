import { Project, SkillCategory, Service, Certification, TimelineEvent, BlogPost, StatItem, Language } from '../types';

export const PERSONAL_INFO = {
  name: 'NÉHÉMIE ONUN KAMBONGH',
  shortName: 'Néhémie Onun',
  title: {
    fr: 'Développeur Full Stack | Ingénieur en Génie Informatique | Passionné d\'IA, Cloud & Cybersécurité',
    en: 'Full Stack Developer | Computer Engineer | AI, Cloud & Cybersecurity Enthusiast'
  },
  slogan: {
    fr: 'Transformer les idées en solutions numériques innovantes.',
    en: 'Transforming ideas into innovative digital solutions.'
  },
  location: 'Lubumbashi, République Démocratique du Congo',
  email: 'nehemieonun182@gmail.com',
  phone: '+243 970 000 000', // Example DRC format, easily editable
  whatsapp: 'https://wa.me/24397000000',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  facebook: 'https://facebook.com',
  experienceYears: 3,
  completedProjects: 18,
  certificationsCount: 7,
  availability: {
    fr: 'Disponible pour stages, projets & freelance',
    en: 'Available for internships, projects & freelance'
  },
  typewriterTitles: {
    fr: [
      'Développeur Full Stack Senior',
      'Ingénieur en Génie Informatique',
      'Passionné d\'Intelligence Artificielle',
      'Architecte Cloud & Réseaux',
      'Analyste en Cybersécurité'
    ],
    en: [
      'Senior Full Stack Developer',
      'Computer Engineer',
      'AI & Machine Learning Enthusiast',
      'Cloud & Network Architect',
      'Cybersecurity Analyst'
    ]
  },
  bio: {
    fr: 'Ingénieur passionné en Génie Informatique basé à Lubumbashi (RDC), spécialisé en développement web et mobile modernes, conception d\'architectures cloud et intégration d\'intelligence artificielle. Avec une solide rigueur technique et une vision orientée impact, je conçois des applications hautement performantes, sécurisées et centrées sur l\'utilisateur.',
    en: 'Passionate Computer Engineer based in Lubumbashi (DRC), specialized in modern web & mobile development, cloud architecture design, and artificial intelligence integration. Driven by technical excellence and real-world impact, I design high-performance, secure, user-centric applications.'
  },
  goals: {
    fr: [
      'Bâtir des infrastructures Cloud résilientes pour les entreprises africaines.',
      'Intégrer des moteurs IA légers pour résoudre des problématiques locales (santé, gestion, éducation).',
      'Promouvoir les meilleures pratiques de cybersécurité et de développement éco-conçu.'
    ],
    en: [
      'Build resilient Cloud infrastructures for emerging African enterprises.',
      'Integrate edge AI engines to solve local challenges (healthcare, logistics, education).',
      'Promote cybersecurity best practices and green software engineering.'
    ]
  }
};

export const STATS: StatItem[] = [
  {
    id: 'projects',
    value: 18,
    suffix: '+',
    label: { fr: 'Projets Réalisés', en: 'Projects Delivered' },
    icon: 'FolderCheck'
  },
  {
    id: 'experience',
    value: 3,
    suffix: ' ans',
    label: { fr: 'Années d\'Expérience', en: 'Years of Experience' },
    icon: 'Briefcase'
  },
  {
    id: 'certs',
    value: 7,
    suffix: '',
    label: { fr: 'Certifications', en: 'Certifications Earned' },
    icon: 'Award'
  },
  {
    id: 'tech',
    value: 15,
    suffix: '+',
    label: { fr: 'Technologies Maîtrisées', en: 'Technologies Mastered' },
    icon: 'Code2'
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'ur-gedt-portal',
    title: 'UR-GEDT Portal Management System',
    category: 'web',
    image: '/src/assets/images/project_gedt_portal_1784810864067.jpg',
    featured: true,
    description: {
      fr: 'Plateforme académique complète de gestion documentaire, d\'archivage et de suivi des étudiants pour l\'unité de recherche UR-GEDT.',
      en: 'Complete academic portal for document management, digital archiving, and student workflow tracking for the UR-GEDT research unit.'
    },
    fullDescription: {
      fr: 'Le système UR-GEDT Portal est une solution Web d\'entreprise conçue pour numériser l\'ensemble du flux documentaire d\'une unité de recherche universitaire. Il intègre un système d\'authentification par rôles (Étudiants, Chercheurs, Administration), la génération automatique de certificats PDF sécurisés avec QR Code, un moteur de recherche plein texte à haute vitesse et un dashboard analytique réactif.',
      en: 'The UR-GEDT Portal is an enterprise web solution built to digitize the entire document workflow of a university research unit. It features role-based access control (Students, Researchers, Admins), automated secure PDF certificate generation with QR Codes, high-speed full-text search, and a responsive analytical dashboard.'
    },
    tags: ['React', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'Prisma', 'Tailwind CSS'],
    githubUrl: 'https://github.com/nehemieonun/ur-gedt-portal',
    demoUrl: 'https://ur-gedt-demo.app',
    metrics: [
      { label: { fr: 'Fichiers Indexés', en: 'Indexed Documents' }, value: '5,000+' },
      { label: { fr: 'Temps de Recherche', en: 'Search Latency' }, value: '< 80ms' }
    ]
  },
  {
    id: 'smartfix-ai-rdc',
    title: 'SmartFix AI RDC',
    category: 'ai',
    image: '/src/assets/images/project_smartfix_ai_1784810876217.jpg',
    featured: true,
    description: {
      fr: 'Assistant intelligent de diagnostic matériel et logiciel pour smartphones et ordinateurs, avec détection automatique des pannes par vision IA.',
      en: 'Intelligent hardware and software diagnostic assistant for smartphones and PCs, featuring automated AI visual and telemetry fault detection.'
    },
    fullDescription: {
      fr: 'SmartFix AI RDC est une plateforme innovante combinant vision par ordinateur et modèles de langage Gemini pour guider les techniciens et utilisateurs dans la réparation de leurs équipements informatiques. L\'application permet de scanner une carte mère, d\'analyser les composants défectueux, d\'estimer le coût des pièces en RDC et de générer un rapport de réparation guidé étape par étape.',
      en: 'SmartFix AI RDC combines computer vision and Gemini language models to guide technicians and end users in hardware/software repair. It scans motherboards, identifies burnt or damaged components, calculates local spare part costs in DRC, and generates step-by-step interactive repair guides.'
    },
    tags: ['React', 'Gemini API', 'TypeScript', 'Python', 'Tailwind CSS', 'Firebase'],
    githubUrl: 'https://github.com/nehemieonun/smartfix-ai-rdc',
    demoUrl: 'https://smartfix-ai-rdc.app',
    metrics: [
      { label: { fr: 'Précision Diagnostic', en: 'Diagnostic Precision' }, value: '94.2%' },
      { label: { fr: 'Pannes Référencées', en: 'Cataloged Faults' }, value: '1,200+' }
    ]
  },
  {
    id: 'mariage-invitation-site',
    title: 'Site Web Invitation Mariage Design',
    category: 'web',
    image: '/src/assets/images/project_wedding_invite_1784810886962.jpg',
    featured: true,
    description: {
      fr: 'Site web d\'invitation de mariage luxueux et interactif avec confirmation RSVP en temps réel, compte à rebours, carte Google Maps et livre d\'or.',
      en: 'Luxury interactive wedding invitation web experience featuring real-time RSVP tracking, live countdown, Google Maps location, and guestbook.'
    },
    fullDescription: {
      fr: 'Une expérience numérique haut de gamme créée pour célébrer des unions mémorables. Ce site intègre des animations raffinées en Framer Motion, un système de confirmation de présence (RSVP) synchronisé en temps réel avec notification WhatsApp / Email, une galerie photo interactive, et les itinéraires d\'accès au lieu de la réception.',
      en: 'A high-end digital experience crafted for memorable wedding celebrations. Features refined Framer Motion micro-animations, real-time RSVP guest tracking with automated WhatsApp & Email confirmations, interactive photo gallery, and live Google Maps directions to the ceremony venue.'
    },
    tags: ['React', 'Framer Motion', 'Tailwind CSS', 'Firebase', 'EmailJS'],
    githubUrl: 'https://github.com/nehemieonun/wedding-invitation-app',
    demoUrl: 'https://wedding-luxury-demo.app',
    metrics: [
      { label: { fr: 'Invitations Envoyées', en: 'Invitations Sent' }, value: '850+' },
      { label: { fr: 'Taux de Confirmation', en: 'RSVP Response Rate' }, value: '98%' }
    ]
  },
  {
    id: 'mobile-gestion-app',
    title: 'Application Mobile de Gestion de Stock & Ventes',
    category: 'mobile',
    image: 'https://images.unsplash.com/photo-1556742049-0a67daf64f42?q=80&w=1200&auto=format&fit=crop',
    featured: false,
    description: {
      fr: 'Application mobile hors-ligne avec synchronisation cloud pour la gestion des stocks, des factures et du chiffre d\'affaires de PME.',
      en: 'Offline-first mobile management app with cloud sync for inventory tracking, invoicing, and sales analytics for SMEs.'
    },
    fullDescription: {
      fr: 'Conçue spécialement pour les commerçants et PME à Lubumbashi, cette application permet de gérer les entrées/sorties de stock, scanner les codes-barres par caméra, générer des reçus PDF et fonctionner de manière fluide même en l\'absence de connexion Internet grâce à SQLite et Firebase Offline Persistence.',
      en: 'Designed specifically for merchants and SMEs in Lubumbashi, this app manages inventory, scans barcodes via device camera, generates PDF receipts, and operates seamlessly offline with SQLite and Firebase background sync.'
    },
    tags: ['React Native', 'Expo', 'TypeScript', 'SQLite', 'Firebase', 'Tailwind'],
    githubUrl: 'https://github.com/nehemieonun/stock-manager-mobile',
    demoUrl: 'https://stock-manager-app.demo',
    metrics: [
      { label: { fr: 'Mode Hors-ligne', en: 'Offline First' }, value: '100%' },
      { label: { fr: 'Articles Gérés', en: 'Max Inventory' }, value: '10,000+' }
    ]
  },
  {
    id: 'dashboard-administratif',
    title: 'Dashboard Administratif Analytics & Security',
    category: 'db',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    featured: false,
    description: {
      fr: 'Tableau de bord administrateur moderne pour la supervision d\'infrastructures réseau, métriques serveurs et logs de cybersécurité.',
      en: 'Modern admin dashboard for network monitoring, server telemetry, and cybersecurity access logs auditing.'
    },
    fullDescription: {
      fr: 'Un tableau de bord complet avec visualisation graphique en temps réel (Recharts), monitoring des paquets TCP/IP, gestion des privilèges utilisateurs et alerte de tentative d\'intrusion réseau.',
      en: 'A comprehensive admin control panel featuring real-time Recharts visualizations, TCP/IP packet telemetry, role permission control, and network intrusion detection alerts.'
    },
    tags: ['React', 'TypeScript', 'Chart.js', 'Express', 'MySQL', 'Tailwind CSS'],
    githubUrl: 'https://github.com/nehemieonun/admin-security-dashboard',
    demoUrl: 'https://admin-dashboard-demo.app',
    metrics: [
      { label: { fr: 'Temps Réel WebSocket', en: 'Live Latency' }, value: '15ms' }
    ]
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend',
    title: { fr: 'Développement Frontend', en: 'Frontend Engineering' },
    icon: 'Layout',
    skills: [
      { name: 'HTML5 / CSS3', level: 95, isFavorite: true },
      { name: 'JavaScript (ES6+)', level: 92, isFavorite: true },
      { name: 'TypeScript', level: 90, isFavorite: true },
      { name: 'React.js / React 19', level: 92, isFavorite: true },
      { name: 'Next.js', level: 85, isFavorite: false },
      { name: 'Tailwind CSS', level: 95, isFavorite: true },
      { name: 'Framer Motion / Animations', level: 88, isFavorite: true }
    ]
  },
  {
    id: 'backend',
    title: { fr: 'Développement Backend', en: 'Backend & APIs' },
    icon: 'Server',
    skills: [
      { name: 'Node.js', level: 88, isFavorite: true },
      { name: 'Express.js', level: 90, isFavorite: true },
      { name: 'REST & GraphQL APIs', level: 88, isFavorite: true },
      { name: 'Firebase / Firestore / Auth', level: 90, isFavorite: true },
      { name: 'Prisma ORM', level: 82, isFavorite: false }
    ]
  },
  {
    id: 'database',
    title: { fr: 'Bases de Données', en: 'Databases & Storage' },
    icon: 'Database',
    skills: [
      { name: 'SQL', level: 88, isFavorite: true },
      { name: 'MySQL', level: 86, isFavorite: true },
      { name: 'SQLite', level: 85, isFavorite: false },
      { name: 'Firestore / NoSQL', level: 90, isFavorite: true }
    ]
  },
  {
    id: 'programming',
    title: { fr: 'Langages de Programmation', en: 'Programming Languages' },
    icon: 'Terminal',
    skills: [
      { name: 'Java (OOP, Data Structures)', level: 88, isFavorite: true },
      { name: 'Python (Scripting, AI)', level: 85, isFavorite: true },
      { name: 'C Language (Systems, Memory)', level: 80, isFavorite: false }
    ]
  },
  {
    id: 'networks',
    title: { fr: 'Réseaux & Cybersécurité', en: 'Networking & Security' },
    icon: 'ShieldCheck',
    skills: [
      { name: 'Cisco Networking Fundamentals', level: 85, isFavorite: true },
      { name: 'Protocole TCP/IP & Modèle OSI', level: 90, isFavorite: true },
      { name: 'VLANs, Routing & Switching', level: 84, isFavorite: false },
      { name: 'Cybersécurité & Audit d\'APIs', level: 82, isFavorite: true }
    ]
  },
  {
    id: 'devops',
    title: { fr: 'Cloud & DevOps', en: 'Cloud & DevOps Tools' },
    icon: 'Cloud',
    skills: [
      { name: 'Git & GitHub Workflow', level: 92, isFavorite: true },
      { name: 'Docker / Conteneurisation', level: 78, isFavorite: true },
      { name: 'Vercel / Cloud Run Deployment', level: 88, isFavorite: true }
    ]
  }
];

export const SERVICES: Service[] = [
  {
    id: 'web-dev',
    title: { fr: 'Développement Web Full Stack', en: 'Full Stack Web Development' },
    description: {
      fr: 'Création d\'applications web sur mesure, réactives, sécurisées et ultra-rapides basées sur React, TypeScript et Node.js.',
      en: 'Custom tailored, responsive, secure, and lightning-fast web applications built with React, TypeScript, and Node.js.'
    },
    icon: 'Code',
    features: {
      fr: ['Architecture modulaire & scalable', 'Design ultra moderne (Vercel/Apple style)', 'Intégration d\'APIs & Bases de données', 'SEO & Performances > 95%'],
      en: ['Modular & scalable architecture', 'Ultra modern design (Vercel/Apple style)', 'API & Database integrations', 'SEO & Performance > 95%']
    }
  },
  {
    id: 'mobile-dev',
    title: { fr: 'Développement Mobile', en: 'Mobile App Development' },
    description: {
      fr: 'Conception d\'applications mobiles hybrides performantes pour Android et iOS avec React Native / Expo.',
      en: 'Development of high-performance cross-platform mobile apps for Android and iOS using React Native / Expo.'
    },
    icon: 'Smartphone',
    features: {
      fr: ['Support Hors-ligne (Offline First)', 'Notifications Push', 'Interface utilisateur fluide', 'Publication APK/App Store'],
      en: ['Offline-first support', 'Push notifications', 'Smooth native UI/UX', 'APK & App Store deployment']
    }
  },
  {
    id: 'ui-ux',
    title: { fr: 'Conception UI/UX Premium', en: 'Premium UI/UX Design' },
    description: {
      fr: 'Maquettage et prototypage d\'interfaces élégantes avec Glassmorphism, animations fluides et micro-interactions.',
      en: 'Wireframing and prototyping elegant interfaces with glassmorphism, fluid animations, and interactive polish.'
    },
    icon: 'Palette',
    features: {
      fr: ['Prototypes interactifs', 'Design System sur mesure', 'Accessibilité WCAG', 'Mode Sombre & Clair'],
      en: ['Interactive prototypes', 'Tailored Design System', 'WCAG Accessibility', 'Dark & Light modes']
    }
  },
  {
    id: 'api-dev',
    title: { fr: 'Création & Audit d\'APIs', en: 'API Development & Audit' },
    description: {
      fr: 'Conception d\'APIs REST & GraphQL performantes, documentées et sécurisées contre les failles courantes (OWASP).',
      en: 'Designing high-performance, well-documented, and secure REST & GraphQL APIs protected against common vulnerabilities.'
    },
    icon: 'Cpu',
    features: {
      fr: ['Authentification JWT / OAuth2', 'Documentation Swagger / Postman', 'Chiffrement des données', 'Rate Limiting'],
      en: ['JWT / OAuth2 authentication', 'Swagger / Postman docs', 'Data encryption', 'Rate limiting']
    }
  },
  {
    id: 'db-admin',
    title: { fr: 'Administration Base de Données', en: 'Database Administration' },
    description: {
      fr: 'Modelisation relationnelle (MySQL/PostgreSQL) et NoSQL (Firestore/MongoDB), optimisation de requêtes et sauvegardes.',
      en: 'Relational (MySQL/PostgreSQL) and NoSQL (Firestore/MongoDB) schema design, query optimization, and backups.'
    },
    icon: 'Database',
    features: {
      fr: ['Schémas normalisés BCNF', 'Indexation & requêtes rapides', 'Procédures stockées', 'Stratégie de sauvegarde'],
      en: ['Normalized database schemas', 'Fast indexing & query tuning', 'Stored procedures', 'Backup strategies']
    }
  },
  {
    id: 'cybersecurity',
    title: { fr: 'Cybersécurité & Audit Réseau', en: 'Cybersecurity & Audit' },
    description: {
      fr: 'Analyse des vulnérabilités, sécurisation des réseaux d\'entreprise Cisco/TCP/IP et mise en conformité des systèmes.',
      en: 'Vulnerability assessment, Cisco/TCP/IP network hardening, and security compliance configuration.'
    },
    icon: 'Shield',
    features: {
      fr: ['Audit de sécurité des applications', 'Configuration Pare-feu & VLANs', 'Chiffrement SSL/TLS', 'Prévention des intrusions'],
      en: ['Application security audits', 'Firewall & VLAN setup', 'SSL/TLS encryption', 'Intrusion detection']
    }
  },
  {
    id: 'it-maintenance',
    title: { fr: 'Maintenance Informatique', en: 'IT Hardware & Systems Maintenance' },
    description: {
      fr: 'Diagnostic de pannes matérielles et logicielles, optimisation de performances et dépannage système.',
      en: 'Hardware and software diagnostic, system optimization, performance tuning, and troubleshooting.'
    },
    icon: 'Wrench',
    features: {
      fr: ['Diagnostic rapide', 'Réparation matérielle', 'Installation & Configuration OS', 'Nettoyage & Sécurisation'],
      en: ['Fast hardware diagnostic', 'Component repair', 'OS installation & config', 'Optimization & cleanup']
    }
  },
  {
    id: 'consulting',
    title: { fr: 'Consultance & Formation', en: 'IT Consulting & Training' },
    description: {
      fr: 'Accompagnement technique des étudiants, PME et startups dans le choix de leurs stacks logicielles et leur transformation digitale.',
      en: 'Technical advisory for students, SMEs, and startups in tech stack selection and digital transformation.'
    },
    icon: 'Compass',
    features: {
      fr: ['Choix d\'architecture Cloud', 'Accompagnement projet académique', 'Formation développeur', 'Revue de code'],
      en: ['Cloud architecture choice', 'Academic project guidance', 'Developer training', 'Code reviews']
    }
  }
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'hp-life',
    title: 'HP LIFE Certification - Technology & Business Strategy',
    issuer: 'HP Foundation',
    issueDate: '2025',
    credentialId: 'HP-LIFE-982341',
    category: 'tech',
    skills: ['Business Strategy', 'IT Innovation', 'Digital Marketing', 'Data Analysis'],
    description: {
      fr: 'Certification délivrée par HP Foundation validant la maitrise des outils technologiques appliqués à la stratégie d\'entreprise et à la gestion de projets informatiques.',
      en: 'Certification granted by HP Foundation validating expertise in applying technology to business strategy and IT project management.'
    }
  },
  {
    id: 'coursera-google',
    title: 'Coursera Professional Certification - IT & Software Engineering',
    issuer: 'Coursera / Google',
    issueDate: '2025',
    credentialId: 'COURSERA-CS-77218',
    category: 'tech',
    skills: ['Python', 'Linux System Admin', 'Git Version Control', 'Networking'],
    description: {
      fr: 'Certificat professionnel validant les compétences avancées en administration système Linux, automatisation Python et gestion de versions avec Git.',
      en: 'Professional certificate validating advanced skills in Linux administration, Python automation, and version control with Git.'
    }
  },
  {
    id: 'orange-digital-center',
    title: 'Orange Digital Center Certification - Full Stack Web & Mobile',
    issuer: 'Orange Digital Center RDC',
    issueDate: '2024',
    credentialId: 'ODC-RDC-2024-44',
    category: 'digital',
    skills: ['React', 'Node.js', 'Mobile Apps', 'Design Thinking'],
    description: {
      fr: 'Formation intensive et certification sur le développement d\'applications web et mobiles modernes, dispensée par le centre d\'excellence Orange Digital Center.',
      en: 'Intensive training and certification in modern web and mobile application development from Orange Digital Center excellence hub.'
    }
  },
  {
    id: 'pix',
    title: 'PIX - Certification des Compétences Numériques',
    issuer: 'Ministère de l\'Éducation & PIX',
    issueDate: '2024',
    credentialId: 'PIX-FR-392019',
    category: 'digital',
    skills: ['Cybersécurité', 'Data Protection', 'Programmation', 'Environnement Numérique'],
    description: {
      fr: 'Certification officielle mesurant et attestant la maîtrise des compétences numériques, de la sécurité informatique et du traitement des données.',
      en: 'Official certification testing and validating digital competencies, cybersecurity awareness, and data processing.'
    }
  },
  {
    id: 'undp',
    title: 'UNDP (PNUD) Certificate - Digital Innovation for Youth',
    issuer: 'PNUD / United Nations Development Programme',
    issueDate: '2024',
    credentialId: 'UNDP-YOUTH-DRC-109',
    category: 'international',
    skills: ['Innovation Sociale', 'Gestion de Projet', 'Technologies Émergentes'],
    description: {
      fr: 'Certificat de reconnaissance du PNUD pour l\'implication dans des projets d\'innovation technologique à fort impact social pour la jeunesse en RDC.',
      en: 'UNDP Certificate of Recognition for active involvement in tech innovation projects with high social impact for youth in DRC.'
    }
  },
  {
    id: 'unv',
    title: 'UNV (Volontaires des Nations Unies) - Tech & Community Engagement',
    issuer: 'United Nations Volunteers (UNV)',
    issueDate: '2024',
    credentialId: 'UNV-VOL-2024-88',
    category: 'international',
    skills: ['Engagement Communautaire', 'Digital Support', 'Mentorat Tech'],
    description: {
      fr: 'Engagement certifié auprès des Nations Unies pour la promotion de la culture numérique et l\'assistance technique aux initiatives locales.',
      en: 'Certified United Nations engagement promoting digital literacy and technical assistance to community-led initiatives.'
    }
  },
  {
    id: 'tosa-excel',
    title: 'TOSA Excel Advanced & Data Analysis',
    issuer: 'Isograd / TOSA',
    issueDate: '2023',
    credentialId: 'TOSA-EXCEL-880-ADV',
    category: 'tech',
    skills: ['Formules Avancées', 'Tableaux Croisés Dynamiques', 'VBA Macros', 'Data Viz'],
    description: {
      fr: 'Certification TOSA de niveau Avancé/Expert sur Microsoft Excel pour l\'analyse de données complexes, la création de tableaux de bord et l\'automatisation.',
      en: 'Advanced/Expert level TOSA Excel certification for complex data analysis, dashboard creation, and process automation.'
    }
  }
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 't-1',
    year: '2022',
    title: { fr: 'Découverte du Développement & Algorithmique', en: 'Discovery of Coding & Algorithms' },
    institution: { fr: 'Auto-apprentissage & Passion', en: 'Self-Learning & Passion' },
    description: {
      fr: 'Premiers pas passionnés avec HTML, CSS, JavaScript et les concepts de base des algorithmes et structures de données.',
      en: 'First passionate steps into HTML, CSS, JavaScript, core algorithmic concepts, and fundamental data structures.'
    },
    icon: 'Sparkles',
    category: 'education',
    skills: ['HTML5', 'CSS3', 'JavaScript']
  },
  {
    id: 't-2',
    year: '2023',
    title: { fr: 'Apprentissage Java, C & Architecture Réseau', en: 'Java, C Mastery & Network Architecture' },
    institution: { fr: 'Cursus Génie Informatique', en: 'Computer Engineering Program' },
    description: {
      fr: 'Programmation Orientée Objet avancée en Java, gestion de la mémoire en C, et maîtrise du modèle OSI et des protocoles Cisco TCP/IP.',
      en: 'Advanced Object-Oriented Programming in Java, manual memory management in C, OSI model and Cisco TCP/IP protocols.'
    },
    icon: 'Code',
    category: 'education',
    skills: ['Java', 'C', 'Networking', 'TCP/IP']
  },
  {
    id: 't-3',
    year: '2024',
    title: { fr: 'Développement Web Full Stack & Projets Réels', en: 'Full Stack Web Dev & Enterprise Projects' },
    institution: { fr: 'Lubumbashi, RDC', en: 'Lubumbashi, DRC' },
    description: {
      fr: 'Spécialisation dans l\'écosystème React, TypeScript, Node.js, Express, MySQL et Firebase. Conception du système UR-GEDT Portal.',
      en: 'Specialized in React ecosystem, TypeScript, Node.js, Express, MySQL, and Firebase. Built the UR-GEDT Portal System.'
    },
    icon: 'Laptop',
    category: 'experience',
    skills: ['React', 'TypeScript', 'Node.js', 'MySQL', 'Firebase']
  },
  {
    id: 't-4',
    year: '2024 - 2025',
    title: { fr: 'Certifications Internationales & Engagement ONU / PNUD', en: 'Global Certifications & UN/UNDP Engagements' },
    institution: { fr: 'HP LIFE, Orange Digital Center, PNUD, UNV, Coursera', en: 'HP LIFE, Orange Digital Center, UNDP, UNV, Coursera' },
    description: {
      fr: 'Obtention successive de 7 certifications majeures et participation active à des projets d\'innovation technologique et d\'impact numérique.',
      en: 'Earned 7 key international certifications and actively led digital innovation initiatives.'
    },
    icon: 'Award',
    category: 'achievement',
    skills: ['HP LIFE', ' Coursera', 'ODC', 'PIX', 'UNDP']
  },
  {
    id: 't-5',
    year: '2025 - 2026',
    title: { fr: 'Intégration de l\'IA (SmartFix AI) & Cloud Computing', en: 'AI Integration (SmartFix AI) & Cloud Engineering' },
    institution: { fr: 'Projets d\'Avenir', en: 'Future Innovations' },
    description: {
      fr: 'Développement de solutions combinant le modèle Gemini API avec React et architectures Cloud serveur pour répondre aux défis locaux.',
      en: 'Building solutions combining Gemini API models with React and server-side Cloud architectures to address regional challenges.'
    },
    icon: 'Brain',
    category: 'future',
    skills: ['Gemini AI', 'Cloud Architectures', 'Docker', 'Cybersécurité']
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'ia-dev-afrique',
    title: {
      fr: 'Comment l\'Intelligence Artificielle Révolutionne le Développement en Afrique',
      en: 'How Artificial Intelligence is Revolutionizing Software Development in Africa'
    },
    excerpt: {
      fr: 'Une analyse prospective de l\'impact des LLMs et des outils IA sur l\'écosystème tech congolais et africain.',
      en: 'A forward-looking analysis of LLMs and AI tools impact on the Congolese and broader African tech ecosystem.'
    },
    content: {
      fr: 'L\'Afrique connaît un boom technologique sans précédent. Avec l\'émergence des modèles de langage comme Gemini, les développeurs peuvent désormais accélérer la création de solutions locales pour la santé, l\'éducation et la finance inclusive. Dans cet article, nous explorons comment intégrer ces outils avec éco-conception et sobriété numérique.',
      en: 'Africa is witnessing an unprecedented technological surge. With the advent of large language models such as Gemini, engineers can accelerate the delivery of impactful local solutions across healthcare, education, and financial inclusion.'
    },
    date: '15 Fév 2026',
    readTime: '5 min',
    category: 'IA & Tech',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    tags: ['IA', 'Afrique', 'Gemini API', 'Innovation']
  },
  {
    id: 'securite-apis-rest',
    title: {
      fr: 'Guide Pratique: Sécuriser vos APIs REST contre le Top 10 OWASP',
      en: 'Practical Guide: Securing REST APIs Against the OWASP Top 10'
    },
    excerpt: {
      fr: 'Les règles d\'or pour chiffrer, authentifier et protéger vos services Express et Node.js en production.',
      en: 'Golden rules for encrypting, authenticating, and hardening Node.js/Express production endpoints.'
    },
    content: {
      fr: 'La sécurité des APIs ne doit jamais être une réflexion après coup. Cet article passe en revue la mise en place de JWT avec clés asymétriques, le rate-limiting, la sanitization des entrées contre les injections SQL et la configuration stricte de CORS.',
      en: 'API security should never be an afterthought. This article details JWT implementation with asymmetric keys, rate-limiting, input sanitization against SQL injections, and strict CORS configuration.'
    },
    date: '28 Jan 2026',
    readTime: '7 min',
    category: 'Cybersécurité',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800&auto=format&fit=crop',
    tags: ['Cybersécurité', 'Node.js', 'Express', 'JWT', 'OWASP']
  },
  {
    id: 'architectures-cloud-hybrides',
    title: {
      fr: 'Construire des Applications Résilientes avec Mode Hors-Ligne (Offline-First)',
      en: 'Building Resilient Offline-First Applications in Emerging Networks'
    },
    excerpt: {
      fr: 'Comment concevoir des applications qui continuent de fonctionner parfaitement malgré les coupures réseau.',
      en: 'Designing applications that operate seamlessly despite network instability and bandwidth constraints.'
    },
    content: {
      fr: 'En République Démocratique du Congo, la connectivité réseau peut être intermittente. L\'approche Offline-First utilisant SQLite, IndexedDB et la synchronisation Firebase en arrière-plan permet d\'offrir une expérience utilisateur irréprochable.',
      en: 'In regions with variable connectivity, an Offline-First architectural pattern using SQLite, IndexedDB, and background Firebase synchronization guarantees uninterrupted user experiences.'
    },
    date: '10 Déc 2025',
    readTime: '6 min',
    category: 'Architecture Web',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    tags: ['Offline First', 'React', 'Firebase', 'SQLite']
  }
];
