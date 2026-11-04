import type { Post, SiteContent } from './types.js';

/**
 * Contenu initial du site. Il est utilisé tant que rien n'a été enregistré depuis le
 * tableau de bord (/admin). Ensuite, c'est le contenu de la base de données qui compte.
 */
export const DEFAULT_SITE: SiteContent = {
  profile: {
    name: 'Néhémie Onun',
    shortName: 'Néhémie Onun',
    initials: 'NO',
    photo: '', // à ajouter depuis /admin → Profil et liens
    title: {
      fr: 'Développeur Full Stack, étudiant en Génie Informatique',
      en: 'Full Stack Developer, Computer Engineering student'
    },
    headline: {
      fr: 'Je conçois des applications web fiables, utiles et sécurisées.',
      en: 'I build reliable, useful and secure web applications.'
    },
    slogan: {
      fr: 'Transformer les idées en solutions numériques.',
      en: 'Turning ideas into digital solutions.'
    },
    bio: {
      fr: "Étudiant en Génie Informatique à l'Université de Lubumbashi (RDC) et développeur Full Stack. Je travaille principalement avec React, TypeScript et Node.js, et je m'intéresse aux réseaux, à la cybersécurité et à l'intégration de l'intelligence artificielle dans des outils adaptés aux réalités locales.",
      en: 'Computer Engineering student at the University of Lubumbashi (DRC) and Full Stack developer. I mainly work with React, TypeScript and Node.js, and I am interested in networking, cybersecurity and integrating artificial intelligence into tools adapted to local realities.'
    },
    vision: {
      fr: 'Contribuer au développement numérique africain avec des logiciels robustes, adaptés aux besoins locaux et conformes aux standards internationaux.',
      en: 'Contribute to African digital development with robust software adapted to local needs and aligned with international standards.'
    },
    goals: {
      fr: [
        'Concevoir des applications fiables pour les organisations et PME africaines.',
        "Intégrer l'IA pour résoudre des problèmes concrets (santé, gestion, éducation).",
        'Promouvoir les bonnes pratiques de cybersécurité.'
      ],
      en: [
        'Build reliable applications for African organisations and SMEs.',
        'Integrate AI to solve concrete problems (health, management, education).',
        'Promote cybersecurity best practices.'
      ]
    },
    location: { fr: 'Lubumbashi, RD Congo', en: 'Lubumbashi, DR Congo' },
    studyLevel: { fr: 'Bac 3 en Génie Informatique', en: '3rd year of Computer Engineering' },
    availability: {
      fr: 'Disponible pour stages, projets et freelance',
      en: 'Available for internships, projects and freelance'
    },
    spokenLanguages: ['Français', 'English'],
    email: 'nehemieonun182@gmail.com',
    phone: '',
    whatsapp: '',
    cvUrl: ''
  },

  socials: [{ id: 'github', label: 'GitHub', url: 'https://github.com/NehemieOnun', icon: 'github' }],

  stats: [
    { id: 'projects', value: '5+', label: { fr: 'Projets réalisés', en: 'Projects built' } },
    { id: 'certs', value: '7', label: { fr: 'Certifications', en: 'Certifications' } },
    { id: 'year', value: 'Bac 3', label: { fr: 'Génie Informatique', en: 'Computer Engineering' } },
    { id: 'tech', value: '15+', label: { fr: 'Technologies utilisées', en: 'Technologies used' } }
  ],

  projects: [
    {
      id: 'ur-gedt-portal',
      title: 'UR-GEDT Portal',
      category: 'web',
      image: '/images/project-ur-gedt.webp',
      featured: true,
      description: {
        fr: "Plateforme de gestion d'une unité de recherche universitaire : contenus publics, personnel, finances et budget.",
        en: 'Management platform for a university research unit: public content, staff, finances and budget.'
      },
      fullDescription: {
        fr: "Application web complète pour l'unité de recherche UR-GEDT : site public, tableau de bord d'administration, authentification JWT avec rôles et permissions, gestion du personnel, suivi des recettes et dépenses, et analyse de reçus assistée par IA. Backend Express en architecture MVC avec PostgreSQL (Neon) et Prisma, déployé sur Vercel.",
        en: 'Full web application for the UR-GEDT research unit: public website, admin dashboard, JWT authentication with roles and permissions, staff management, income and expense tracking, and AI-assisted receipt analysis. MVC Express backend with PostgreSQL (Neon) and Prisma, deployed on Vercel.'
      },
      tags: ['React', 'TypeScript', 'Express', 'PostgreSQL', 'Prisma', 'JWT / RBAC', 'Vercel'],
      githubUrl: 'https://github.com/NehemieOnun/ur-gedt-portal',
      demoUrl: 'https://ur-gedt-portal.vercel.app'
    },
    {
      id: 'smartfix-ai-rdc',
      title: 'SmartFix AI RDC',
      category: 'ai',
      image: '/images/project-smartfix.webp',
      featured: true,
      description: {
        fr: 'Assistant de diagnostic de pannes matérielles et logicielles pour smartphones et ordinateurs, propulsé par Gemini.',
        en: 'Hardware and software troubleshooting assistant for smartphones and computers, powered by Gemini.'
      },
      fullDescription: {
        fr: "SmartFix AI RDC aide les techniciens et les utilisateurs à diagnostiquer leurs équipements : analyse d'images de composants, identification des pannes probables et guide de réparation étape par étape.",
        en: 'SmartFix AI RDC helps technicians and users diagnose their devices: component image analysis, likely fault identification and a step-by-step repair guide.'
      },
      tags: ['React', 'Gemini API', 'TypeScript', 'Python', 'Tailwind CSS', 'Firebase'],
      githubUrl: '',
      demoUrl: ''
    },
    {
      id: 'mariage-invitation-site',
      title: "Site d'invitation de mariage",
      category: 'web',
      image: '/images/project-wedding.webp',
      featured: true,
      description: {
        fr: 'Invitation de mariage interactive avec confirmation de présence (RSVP), compte à rebours et plan d’accès.',
        en: 'Interactive wedding invitation with RSVP, countdown and venue map.'
      },
      fullDescription: {
        fr: 'Site élégant et animé pour un mariage : confirmation de présence des invités, compte à rebours, galerie photo et itinéraire vers le lieu de réception.',
        en: 'Elegant animated wedding website: guest RSVP, countdown, photo gallery and directions to the venue.'
      },
      tags: ['React', 'Framer Motion', 'Tailwind CSS', 'Firebase', 'EmailJS'],
      githubUrl: '',
      demoUrl: ''
    },
    {
      id: 'mobile-gestion-app',
      title: 'Application mobile de gestion de stock',
      category: 'mobile',
      image: '',
      featured: false,
      description: {
        fr: 'Application mobile hors-ligne avec synchronisation pour la gestion des stocks, des factures et des ventes de PME.',
        en: 'Offline-first mobile app with sync for SME inventory, invoicing and sales.'
      },
      fullDescription: {
        fr: "Conçue pour les commerçants et PME de Lubumbashi : entrées/sorties de stock, scan de codes-barres, reçus PDF et fonctionnement hors connexion grâce à SQLite et à la synchronisation Firebase.",
        en: 'Designed for merchants and SMEs in Lubumbashi: stock in/out, barcode scanning, PDF receipts and offline operation with SQLite and Firebase sync.'
      },
      tags: ['React Native', 'Expo', 'TypeScript', 'SQLite', 'Firebase'],
      githubUrl: '',
      demoUrl: ''
    },
    {
      id: 'dashboard-administratif',
      title: 'Tableau de bord de supervision & sécurité',
      category: 'db',
      image: '',
      featured: false,
      description: {
        fr: "Tableau de bord d'administration pour la supervision réseau, les métriques serveurs et les journaux de sécurité.",
        en: 'Admin dashboard for network monitoring, server metrics and security logs.'
      },
      fullDescription: {
        fr: 'Visualisations en temps réel, gestion des privilèges utilisateurs et alertes de tentatives d’intrusion.',
        en: 'Real-time charts, user privilege management and intrusion attempt alerts.'
      },
      tags: ['React', 'TypeScript', 'Chart.js', 'Express', 'MySQL'],
      githubUrl: '',
      demoUrl: ''
    }
  ],

  skillCategories: [
    {
      id: 'frontend',
      title: { fr: 'Frontend', en: 'Frontend' },
      icon: 'layout',
      skills: ['HTML5 / CSS3', 'JavaScript (ES6+)', 'TypeScript', 'React', 'Tailwind CSS', 'Next.js']
    },
    {
      id: 'backend',
      title: { fr: 'Backend & API', en: 'Backend & APIs' },
      icon: 'server',
      skills: ['Node.js', 'Express', 'API REST', 'Prisma ORM', 'Firebase', 'JWT / RBAC']
    },
    {
      id: 'database',
      title: { fr: 'Bases de données', en: 'Databases' },
      icon: 'database',
      skills: ['SQL', 'PostgreSQL', 'MySQL', 'SQLite', 'Firestore']
    },
    {
      id: 'programming',
      title: { fr: 'Langages', en: 'Languages' },
      icon: 'terminal',
      skills: ['Java', 'Python', 'C']
    },
    {
      id: 'networks',
      title: { fr: 'Réseaux & sécurité', en: 'Networking & security' },
      icon: 'shield',
      skills: ['Cisco Networking', 'TCP/IP & modèle OSI', 'VLAN, routage & commutation', 'Sécurité des API']
    },
    {
      id: 'devops',
      title: { fr: 'Outils & déploiement', en: 'Tools & deployment' },
      icon: 'cloud',
      skills: ['Git & GitHub', 'Vercel', 'Docker (bases)', 'Gemini API']
    }
  ],

  services: [
    {
      id: 'web-dev',
      icon: 'code',
      title: { fr: 'Développement web', en: 'Web development' },
      description: {
        fr: 'Applications web sur mesure, rapides et sécurisées avec React, TypeScript et Node.js.',
        en: 'Custom, fast and secure web applications with React, TypeScript and Node.js.'
      },
      features: {
        fr: ['Sites vitrines et portfolios', "Tableaux de bord d'administration", 'API et bases de données'],
        en: ['Showcase sites and portfolios', 'Admin dashboards', 'APIs and databases']
      }
    },
    {
      id: 'api-db',
      icon: 'database',
      title: { fr: 'API & bases de données', en: 'APIs & databases' },
      description: {
        fr: "Conception d'API REST documentées et de schémas de données propres et performants.",
        en: 'Design of documented REST APIs and clean, efficient data models.'
      },
      features: {
        fr: ['Authentification et rôles', 'Modélisation SQL', 'Migration de données'],
        en: ['Authentication and roles', 'SQL data modelling', 'Data migration']
      }
    },
    {
      id: 'network-security',
      icon: 'shield',
      title: { fr: 'Réseaux & sécurité', en: 'Networking & security' },
      description: {
        fr: 'Configuration de réseaux locaux et revue de sécurité des applications web.',
        en: 'Local network setup and security review of web applications.'
      },
      features: {
        fr: ['VLAN et routage', 'Revue de sécurité', 'Bonnes pratiques'],
        en: ['VLANs and routing', 'Security review', 'Best practices']
      }
    },
    {
      id: 'it-support',
      icon: 'wrench',
      title: { fr: 'Maintenance informatique', en: 'IT maintenance' },
      description: {
        fr: 'Diagnostic de pannes, installation et optimisation de systèmes.',
        en: 'Troubleshooting, system installation and optimisation.'
      },
      features: {
        fr: ['Diagnostic matériel et logiciel', 'Installation de systèmes', 'Optimisation'],
        en: ['Hardware and software diagnosis', 'System installation', 'Optimisation']
      }
    }
  ],

  certifications: [
    {
      id: 'hp-life',
      title: 'HP LIFE — Technology & Business',
      issuer: 'HP Foundation',
      issueDate: '2025',
      credentialId: '',
      credentialUrl: '',
      skills: ['Stratégie', 'Innovation', 'Analyse de données'],
      description: {
        fr: "Formation HP LIFE sur l'usage des technologies dans la stratégie d'entreprise.",
        en: 'HP LIFE training on using technology in business strategy.'
      }
    },
    {
      id: 'coursera-google',
      title: 'Coursera — IT & Software',
      issuer: 'Coursera / Google',
      issueDate: '2025',
      credentialId: '',
      credentialUrl: '',
      skills: ['Python', 'Linux', 'Git', 'Réseaux'],
      description: {
        fr: 'Certificat en administration Linux, automatisation Python et gestion de versions avec Git.',
        en: 'Certificate in Linux administration, Python automation and version control with Git.'
      }
    },
    {
      id: 'orange-digital-center',
      title: 'Orange Digital Center — Développement web & mobile',
      issuer: 'Orange Digital Center RDC',
      issueDate: '2024',
      credentialId: '',
      credentialUrl: '',
      skills: ['React', 'Node.js', 'Mobile', 'Design Thinking'],
      description: {
        fr: "Formation au développement d'applications web et mobiles modernes.",
        en: 'Training in modern web and mobile application development.'
      }
    },
    {
      id: 'pix',
      title: 'PIX — Compétences numériques',
      issuer: 'PIX',
      issueDate: '2024',
      credentialId: '',
      credentialUrl: '',
      skills: ['Sécurité', 'Données', 'Programmation'],
      description: {
        fr: 'Certification des compétences numériques, de la sécurité et du traitement des données.',
        en: 'Certification of digital skills, security and data processing.'
      }
    },
    {
      id: 'undp',
      title: 'PNUD — Innovation numérique pour la jeunesse',
      issuer: 'PNUD / UNDP',
      issueDate: '2024',
      credentialId: '',
      credentialUrl: '',
      skills: ['Innovation sociale', 'Gestion de projet'],
      description: {
        fr: "Participation à des projets d'innovation technologique à impact social pour la jeunesse en RDC.",
        en: 'Participation in social-impact tech innovation projects for youth in the DRC.'
      }
    },
    {
      id: 'unv',
      title: 'Volontaire en ligne des Nations Unies (UNV)',
      issuer: 'United Nations Volunteers',
      issueDate: '2024',
      credentialId: '',
      credentialUrl: '',
      skills: ['Engagement communautaire', 'Support numérique'],
      description: {
        fr: "Volontariat en ligne auprès des Nations Unies : appui numérique à des initiatives locales.",
        en: 'Online volunteering with the United Nations: digital support for local initiatives.'
      }
    },
    {
      id: 'tosa-excel',
      title: 'TOSA Excel',
      issuer: 'Isograd / TOSA',
      issueDate: '2023',
      credentialId: '',
      credentialUrl: '',
      skills: ['Formules', 'Tableaux croisés dynamiques', 'Visualisation'],
      description: {
        fr: "Certification TOSA sur Microsoft Excel pour l'analyse de données.",
        en: 'TOSA certification on Microsoft Excel for data analysis.'
      }
    }
  ],

  timeline: [
    {
      id: 't-1',
      year: '2022',
      category: 'education',
      title: { fr: 'Premiers pas en programmation', en: 'First steps in programming' },
      institution: { fr: 'Autodidacte', en: 'Self-taught' },
      description: {
        fr: 'Découverte de HTML, CSS, JavaScript et des bases de l’algorithmique.',
        en: 'Discovering HTML, CSS, JavaScript and algorithm basics.'
      },
      skills: ['HTML', 'CSS', 'JavaScript']
    },
    {
      id: 't-2',
      year: '2023',
      category: 'education',
      title: { fr: 'Génie Informatique', en: 'Computer Engineering' },
      institution: { fr: 'Université de Lubumbashi', en: 'University of Lubumbashi' },
      description: {
        fr: 'Programmation orientée objet en Java, langage C, modèle OSI et réseaux Cisco.',
        en: 'Object-oriented programming in Java, C language, OSI model and Cisco networking.'
      },
      skills: ['Java', 'C', 'Réseaux']
    },
    {
      id: 't-3',
      year: '2024',
      category: 'experience',
      title: { fr: 'Développement Full Stack', en: 'Full Stack development' },
      institution: { fr: 'Projets personnels et académiques', en: 'Personal and academic projects' },
      description: {
        fr: 'Spécialisation React, TypeScript et Node.js ; début du projet UR-GEDT Portal.',
        en: 'Specialising in React, TypeScript and Node.js; start of the UR-GEDT Portal project.'
      },
      skills: ['React', 'TypeScript', 'Node.js']
    },
    {
      id: 't-4',
      year: '2024 – 2025',
      category: 'volunteering',
      title: { fr: 'Certifications & volontariat ONU', en: 'Certifications & UN volunteering' },
      institution: { fr: 'HP LIFE, Orange Digital Center, PNUD, UNV', en: 'HP LIFE, Orange Digital Center, UNDP, UNV' },
      description: {
        fr: 'Certifications en numérique et volontariat en ligne auprès des Nations Unies.',
        en: 'Digital certifications and online volunteering with the United Nations.'
      },
      skills: ['ODC', 'PNUD', 'UNV']
    },
    {
      id: 't-5',
      year: '2025 – 2026',
      category: 'experience',
      title: { fr: 'UR-GEDT en production & IA', en: 'UR-GEDT in production & AI' },
      institution: { fr: 'Vercel, Neon et Gemini', en: 'Vercel, Neon and Gemini' },
      description: {
        fr: "Migration vers PostgreSQL, sécurisation (JWT, rôles) et mise en production ; intégration de l'API Gemini.",
        en: 'Migration to PostgreSQL, security hardening (JWT, roles) and production deployment; Gemini API integration.'
      },
      skills: ['PostgreSQL', 'Prisma', 'Vercel', 'Gemini']
    }
  ],

  settings: {
    sections: {
      about: true,
      skills: true,
      services: true,
      projects: true,
      timeline: true,
      certifications: true,
      stats: true,
      blog: true,
      news: true,
      events: true,
      gallery: true,
      documents: true,
      contact: true
    },
    defaultTheme: 'light',
    defaultLanguage: 'fr',
    availableForWork: true,
    chatEnabled: true,
    contactFormEnabled: true,
    analyticsEnabled: true,
    maintenanceMode: false,
    maintenanceMessage: {
      fr: 'Le site est en cours de mise à jour. Revenez très bientôt !',
      en: 'The site is being updated. Please come back soon!'
    },
    showLoginInMenu: true,
    seoTitle: 'Néhémie Onun — Développeur Full Stack',
    seoDescription:
      "Portfolio de Néhémie Onun, étudiant en Génie Informatique à l'Université de Lubumbashi et développeur Full Stack."
  }
};

const now = '2026-10-13T00:00:00.000Z';

/** Articles de départ, en brouillon (non publiés) : à compléter et publier depuis /admin. */
const seed = (
  id: string,
  slug: string,
  title: Post['title'],
  excerpt: Post['excerpt'],
  content: Post['content'],
  category: string,
  tags: string[]
): Post => ({
  id,
  slug,
  kind: 'article',
  title,
  excerpt,
  content,
  image: '',
  category,
  tags,
  published: false,
  publishedAt: null,
  createdAt: now,
  updatedAt: now
});

export const DEFAULT_POSTS: Post[] = [
  seed(
    'seed-ia-afrique',
    'ia-developpement-afrique',
    {
      fr: "Comment l'intelligence artificielle transforme le développement en Afrique",
      en: 'How artificial intelligence is transforming software development in Africa'
    },
    {
      fr: "L'impact des modèles de langage et des outils IA sur l'écosystème tech congolais et africain.",
      en: 'The impact of language models and AI tools on the Congolese and African tech ecosystem.'
    },
    {
      fr: "L'Afrique connaît un essor technologique sans précédent. Avec des modèles de langage comme Gemini, les développeurs peuvent accélérer la création de solutions locales pour la santé, l'éducation et la finance inclusive.\n\n*Brouillon à compléter.*",
      en: 'Africa is experiencing an unprecedented tech boom. With language models such as Gemini, developers can speed up local solutions for health, education and inclusive finance.\n\n*Draft to be completed.*'
    },
    'IA & Tech',
    ['IA', 'Afrique', 'Gemini']
  ),
  seed(
    'seed-securite-api',
    'securiser-api-rest-owasp',
    { fr: 'Sécuriser ses API REST contre le Top 10 OWASP', en: 'Securing REST APIs against the OWASP Top 10' },
    {
      fr: 'Les règles essentielles pour authentifier, valider et protéger des services Express et Node.js en production.',
      en: 'Essential rules to authenticate, validate and protect Express and Node.js services in production.'
    },
    {
      fr: "La sécurité d'une API ne doit jamais venir après coup.\n\n- JWT et gestion des rôles\n- Limitation du nombre de requêtes\n- Validation des entrées contre les injections SQL\n- Configuration stricte de CORS\n\n*Brouillon à compléter.*",
      en: 'API security should never be an afterthought.\n\n- JWT and role management\n- Rate limiting\n- Input validation against SQL injection\n- Strict CORS configuration\n\n*Draft to be completed.*'
    },
    'Cybersécurité',
    ['Cybersécurité', 'Node.js', 'Express', 'OWASP']
  ),
  seed(
    'seed-offline-first',
    'applications-offline-first',
    {
      fr: 'Construire des applications qui fonctionnent hors connexion',
      en: 'Building applications that work offline'
    },
    {
      fr: 'Concevoir des applications qui continuent de fonctionner malgré les coupures réseau.',
      en: 'Designing applications that keep working despite network outages.'
    },
    {
      fr: "En RDC, la connexion Internet peut être intermittente. L'approche « offline-first » (SQLite, IndexedDB, synchronisation en arrière-plan) permet d'offrir une expérience fiable.\n\n*Brouillon à compléter.*",
      en: 'In the DRC, internet access can be intermittent. The offline-first approach (SQLite, IndexedDB, background sync) delivers a reliable experience.\n\n*Draft to be completed.*'
    },
    'Architecture web',
    ['Offline First', 'React', 'SQLite']
  )
];
