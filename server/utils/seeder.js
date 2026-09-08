import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Service from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';

const projects = [
  {
    title: 'ShopSphere - E-Commerce Platform',
    slug: 'shopsphere-ecommerce-platform',
    description: 'ShopSphere is a full-featured e-commerce platform built with the MERN stack. It supports multi-vendor operations, real-time inventory management, Stripe payment integration, and a comprehensive admin dashboard. The platform was designed for a retail startup scaling from 0 to 10,000+ products with performance as a core requirement.',
    shortDescription: 'Full-stack MERN e-commerce platform with multi-vendor support, real-time inventory, Stripe payments and admin dashboard.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1523289333742-be1143f6b766?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80',
    ],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'JWT', 'Redux', 'Cloudinary'],
    category: 'Full Stack',
    features: [
      'Multi-vendor marketplace with individual storefronts',
      'Real-time inventory tracking and stock alerts',
      'Stripe payment gateway with webhook handling',
      'Product search with Elasticsearch integration',
      'Role-based admin dashboard with analytics',
      'Mobile-responsive design across all devices',
      'Order tracking and notification system',
      'Review and rating system with moderation',
    ],
    challenges: [
      'Handling concurrent inventory updates without race conditions',
      'Building a real-time order tracking system at scale',
      'Optimizing product search for 10,000+ SKUs',
    ],
    solutions: [
      'Implemented MongoDB transactions and optimistic locking for inventory management',
      'Used WebSocket connections via Socket.io for live order status updates',
      'Integrated Elasticsearch with custom analyzers for sub-100ms product search',
    ],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    featured: true,
  },
  {
    title: 'TaskFlow - Project Management SaaS',
    slug: 'taskflow-project-management-saas',
    description: 'TaskFlow is a real-time collaborative project management application built for remote engineering teams. It features Kanban boards, Gantt chart visualization, time tracking, team collaboration tools, and deep integration with GitHub and Slack. Built with performance and UX at its core.',
    shortDescription: 'Real-time collaborative project management SaaS with Kanban, Gantt charts, time tracking and GitHub integration.',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=900&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
    ],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT', 'Framer Motion'],
    category: 'SaaS',
    features: [
      'Real-time collaborative Kanban board with drag and drop',
      'Gantt chart for project timeline visualization',
      'Built-in time tracking with reporting',
      'Team member invitation and permission system',
      'GitHub PR and issue linking',
      'Slack notification integration',
      'Custom workflow automation rules',
    ],
    challenges: [
      'Synchronizing board state across multiple simultaneous users',
      'Designing a flexible data model to support diverse workflow types',
    ],
    solutions: [
      'Implemented CRDTs (Conflict-free Replicated Data Types) for offline-first collaboration',
      'Built a polymorphic task schema with configurable field templates',
    ],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    featured: true,
  },
  {
    title: 'MediBook - Healthcare Booking System',
    slug: 'medibook-healthcare-booking',
    description: 'MediBook is a comprehensive healthcare appointment and telemedicine platform connecting patients with doctors. Features include smart availability scheduling, video consultation via WebRTC, prescription management, and insurance claim processing. Built with HIPAA compliance guidelines in mind.',
    shortDescription: 'Healthcare appointment and telemedicine platform with video consultations, scheduling and prescription management.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=900&q=80',
    screenshots: [],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'WebRTC', 'Twilio', 'JWT'],
    category: 'Full Stack',
    features: [
      'Smart appointment scheduling with availability engine',
      'Video consultation via WebRTC with recording',
      'Digital prescription generation and PDF export',
      'Patient health records and medical history',
      'SMS/Email appointment reminders via Twilio',
      'Insurance plan integration and claim submission',
    ],
    challenges: [
      'HIPAA-compliant data storage and transmission',
      'Building a reliable WebRTC video layer across network conditions',
    ],
    solutions: [
      'End-to-end encryption for all medical data, at rest and in transit',
      'TURN server failover with adaptive bitrate video quality',
    ],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    featured: true,
  },
  {
    title: 'BrandKit Studio - Brand Identity Tool',
    slug: 'brandkit-studio',
    description: 'BrandKit Studio is an online brand identity creation tool for small businesses and startups. It allows users to generate logos, define color palettes, select typography pairings, and export brand guidelines as professional PDF documents.',
    shortDescription: 'Online brand identity creation tool with logo generation, color palette builder and brand guideline PDF export.',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=80',
    screenshots: [],
    technologies: ['React', 'Node.js', 'Canvas API', 'Fabric.js', 'Express', 'MongoDB'],
    category: 'Frontend',
    features: [
      'Interactive logo builder with 500+ icon library',
      'AI-assisted color palette generator',
      'Typography pairing recommendations',
      'Brand guideline PDF export',
      'Team collaboration and brand asset sharing',
    ],
    challenges: ['Building a real-time canvas editor that performs at 60fps on mobile browsers'],
    solutions: ['Used OffscreenCanvas with Web Workers for non-blocking rendering operations'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    featured: false,
  },
  {
    title: 'PropSearch - Real Estate Platform',
    slug: 'propsearch-real-estate',
    description: 'PropSearch is a property listing and discovery platform for the Indian real estate market. Features interactive map-based search, virtual property tours, AI-powered price estimation, and a lead management system for real estate agents.',
    shortDescription: 'Real estate listing and discovery platform with map search, virtual tours and AI price estimation.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80',
    screenshots: [],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Mapbox', 'Cloudinary', 'JWT'],
    category: 'Business',
    features: [
      'Map-based property search with polygon drawing',
      'Virtual 360-degree property tour',
      'AI-based property price estimation',
      'Agent CRM and lead pipeline management',
      'EMI and loan eligibility calculator',
      'Neighborhood insights (schools, hospitals, transport)',
    ],
    challenges: ['Handling geospatial queries efficiently at scale'],
    solutions: ['MongoDB 2dsphere indexes with optimized bounding box queries'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    featured: false,
  },
  {
    title: 'DevPortal - Developer API Gateway',
    slug: 'devportal-api-gateway',
    description: 'DevPortal is a developer-focused API gateway and documentation platform. It allows companies to publish, manage, and monetize their APIs with interactive documentation, API key management, rate limiting dashboards, and usage analytics.',
    shortDescription: 'API gateway and developer portal with interactive docs, key management, rate limiting and usage analytics.',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=900&q=80',
    screenshots: [],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redis', 'Swagger', 'JWT'],
    category: 'Backend',
    features: [
      'Auto-generated interactive API documentation from OpenAPI spec',
      'API key issuance and lifecycle management',
      'Real-time rate limiting with Redis',
      'Usage analytics and billing dashboards',
      'Webhook management and testing console',
      'SDKs auto-generated in 5 languages',
    ],
    challenges: ['Sub-millisecond rate limiting at 100k+ requests/second'],
    solutions: ['Redis sliding window rate limiter with Lua scripting for atomic operations'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    featured: false,
  },
  {
    title: 'Fashion Xchange',
    slug: 'fashion-xchange',
    description: 'Fashion Xchange is a modern fashion discovery experience designed to present apparel in a clean, engaging, mobile-friendly interface. The project focuses on making browsing effortless while maintaining a polished visual identity for the brand.',
    shortDescription: 'Modern fashion discovery website with a responsive, brand-first shopping experience.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80',
    screenshots: [],
    technologies: ['React', 'JavaScript', 'CSS3', 'Vercel'],
    category: 'Frontend',
    features: [
      'Responsive fashion catalogue experience',
      'Clean, modern visual design',
      'Mobile-first layouts for product discovery',
      'Fast Vercel deployment',
    ],
    challenges: ['Creating a visually rich experience that remains simple and fast across screen sizes'],
    solutions: ['Built responsive components and optimized the interface for clear browsing on desktop and mobile'],
    githubUrl: '',
    liveUrl: 'https://fashionxchange.vercel.app/',
    featured: true,
  },
  {
    title: 'Grievance Management System',
    slug: 'grievance-management-system',
    description: 'A full-stack grievance management system that gives users a structured way to submit, track and manage grievances. It includes an authenticated workflow for keeping issues organized and visible through resolution.',
    shortDescription: 'Full-stack grievance tracking system with authentication and an organized issue-management workflow.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80',
    screenshots: [],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Render'],
    category: 'Full Stack',
    features: [
      'Secure user login workflow',
      'Structured grievance submission',
      'Clear status tracking and management',
      'Responsive dashboard experience',
    ],
    challenges: ['Designing an understandable workflow for users and administrators to manage submitted grievances'],
    solutions: ['Created an authenticated system with clear status-based organization for each grievance'],
    githubUrl: '',
    liveUrl: 'https://grievance-management-system-1-d7kk.onrender.com/login',
    featured: true,
  },
];

const services = [
  {
    title: 'Website Development',
    description: 'Modern, fast, and responsive websites built to convert visitors into customers. Every website I build is crafted with performance, SEO, and user experience as core priorities.',
    icon: 'Globe',
    features: ['Fully responsive across all devices', 'SEO-optimized HTML structure', 'Performance score 90+ on Lighthouse', 'Contact forms and lead capture', 'CMS integration (if required)', 'Custom domain and hosting setup'],
    technologies: ['React', 'HTML5', 'CSS3', 'JavaScript', 'Node.js', 'MongoDB'],
  },
  {
    title: 'Full Stack Development',
    description: 'End-to-end web application development covering frontend UI, backend APIs, database architecture, and cloud deployment. I own the full product lifecycle.',
    icon: 'Layers',
    features: ['Frontend with React', 'REST or GraphQL API backend', 'Database design and optimization', 'User authentication and security', 'Admin dashboard', 'Cloud deployment (Vercel, Railway, AWS)'],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'AWS'],
  },
  {
    title: 'React Development',
    description: 'High-performance React applications with clean component architecture, state management, and smooth animations. Built for scale and long-term maintainability.',
    icon: 'Code2',
    features: ['React 18+ with modern hooks', 'React Router v6 for navigation', 'Context API or Redux state management', 'Framer Motion animations', 'Component library setup', 'Unit and integration testing'],
    technologies: ['React', 'JavaScript', 'TypeScript', 'Redux', 'Framer Motion', 'Vite'],
  },
  {
    title: 'MERN Stack Applications',
    description: 'Scalable full-stack applications using the MongoDB, Express, React, Node.js stack. Perfect for SaaS products, marketplaces, dashboards, and complex business applications.',
    icon: 'Database',
    features: ['MongoDB with Mongoose schemas', 'Express REST API with MVC architecture', 'React frontend with modular components', 'Node.js backend with proper error handling', 'JWT authentication and role-based access', 'Production-ready deployment setup'],
    technologies: ['MongoDB', 'Express', 'React', 'Node.js', 'JWT', 'Mongoose'],
  },
  {
    title: 'Backend & API Development',
    description: 'Robust backend systems and RESTful or GraphQL APIs built with Node.js. I design scalable, secure, and well-documented APIs that power your web and mobile applications.',
    icon: 'Server',
    features: ['RESTful API design following best practices', 'Input validation and sanitization', 'Rate limiting and DDoS protection', 'JWT / OAuth authentication', 'API documentation with Swagger', 'Database query optimization'],
    technologies: ['Node.js', 'Express', 'MongoDB', 'Redis', 'JWT', 'Swagger'],
  },
  {
    title: 'UI Implementation',
    description: 'Pixel-perfect conversion of Figma or design files into clean, responsive, and interactive frontend code. I bridge the gap between design and working product.',
    icon: 'Palette',
    features: ['Pixel-perfect Figma to code conversion', 'CSS custom properties design system', 'Responsive grid and flexbox layouts', 'Micro-interactions and hover effects', 'Cross-browser compatibility testing', 'Accessibility (WCAG 2.1 AA compliance)'],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Framer Motion', 'GSAP'],
  },
  {
    title: 'Business Websites',
    description: 'Professional business websites that establish credibility, generate leads, and grow your brand online. From landing pages to multi-page corporate sites.',
    icon: 'Briefcase',
    features: ['Professional homepage and multi-page layout', 'Service/product showcase sections', 'Lead capture and contact forms', 'Google Maps and location integration', 'Blog or news section (optional)', 'Google Analytics integration'],
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'HTML5', 'CSS3'],
  },
  {
    title: 'Custom Web Applications',
    description: 'Bespoke web applications tailored to your unique business processes and requirements. From internal tools and dashboards to customer-facing SaaS platforms.',
    icon: 'AppWindow',
    features: ['Custom business logic implementation', 'Role-based user management', 'Interactive dashboards and data visualization', 'Third-party API and service integration', 'File upload and cloud storage', 'Real-time features with WebSockets'],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Chart.js'],
  },
];

const testimonials = [
  {
    clientName: 'Arjun Mehta',
    clientRole: 'CEO, NexaRetail',
    clientImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    review: 'The ShopSphere platform exceeded every expectation. The code quality is exceptional — clean, documented, and built to scale. We went from concept to launch in 8 weeks, and the e-commerce system has been handling thousands of orders without a single issue. Highly professional.',
  },
  {
    clientName: 'Priya Sharma',
    clientRole: 'Founder, Luminary Studios',
    clientImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    review: 'I needed a complete brand identity website and portfolio platform built fast. The final product looks better than anything I could have imagined. The animations are smooth, the mobile experience is perfect, and the admin dashboard makes managing content so easy. A true partner.',
  },
  {
    clientName: 'Rahul Verma',
    clientRole: 'CTO, SkyTrack Logistics',
    clientImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    review: 'We hired techslot.dev to rebuild our internal operations dashboard. The MERN application delivered was robust, fast, and the backend architecture is genuinely impressive. Queries that took seconds now run in milliseconds. The communication throughout was clear and proactive.',
  },
  {
    clientName: 'Sneha Patel',
    clientRole: 'Director, EduPath Learning',
    clientImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    review: 'Our e-learning platform required complex user management, course content delivery, and payment processing — all delivered flawlessly. The codebase is extremely clean and our in-house team had no trouble extending it. Would work with techslot.dev again without hesitation.',
  },
  {
    clientName: 'Vikram Nair',
    clientRole: 'Product Manager, HealthBridge',
    clientImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    review: "The healthcare booking system was delivered on time and within budget. The video consultation feature works flawlessly across devices, and the scheduling engine handles complex availability rules perfectly. Professional, technically excellent, and genuinely cares about the product's success.",
  },
];

const adminUser = {
  name: 'Admin',
  email: 'admin@techslot.dev',
  password: 'Admin@TechSlot2025!',
  role: 'admin',
};

const seedDB = async () => {
  try {
    await connectDB();

    console.log('\n[Seeder] Starting database seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      Service.deleteMany({}),
      Testimonial.deleteMany({}),
    ]);
    console.log('[Seeder] Cleared existing data.');

    // Create Admin User
    const createdAdmin = await User.create(adminUser);
    console.log(`[Seeder] Admin user created: ${createdAdmin.email}`);

    // Seed Projects
    await Project.insertMany(projects);
    console.log(`[Seeder] Inserted ${projects.length} projects.`);

    // Seed Services
    await Service.insertMany(services);
    console.log(`[Seeder] Inserted ${services.length} services.`);

    // Seed Testimonials
    await Testimonial.insertMany(testimonials);
    console.log(`[Seeder] Inserted ${testimonials.length} testimonials.`);

    console.log('\n[Seeder] Database seeding complete!');
    console.log('--------------------------------------');
    console.log('Admin Login Credentials:');
    console.log('  Email:    admin@techslot.dev');
    console.log('  Password: Admin@TechSlot2025!');
    console.log('--------------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error(`[Seeder] Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
