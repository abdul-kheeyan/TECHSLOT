import 'dotenv/config';
import connectDB from '../config/db.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

const projects = [
  {
    title: 'Fashion Xchange',
    slug: 'fashion-xchange',
    description: 'Fashion Xchange is a modern fashion discovery experience designed to present apparel in a clean, engaging, mobile-friendly interface. The project focuses on making browsing effortless while maintaining a polished visual identity for the brand.',
    shortDescription: 'Modern fashion discovery website with a responsive, brand-first shopping experience.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80',
    screenshots: [],
    technologies: ['MongoDB', 'Express', 'React', 'Node.js', 'JavaScript'],
    category: 'Full Stack',
    features: ['Direct money-free clothing exchange workflow', 'Secure authentication for user accounts', 'Responsive marketplace experience', 'Sustainable fashion use case'],
    challenges: ['Creating a simple exchange flow that keeps item discovery and user interactions clear'],
    solutions: ['Built a responsive MERN application with clear item discovery and account-based exchange workflows'],
    githubUrl: 'https://github.com/abdul-kheeyan/FASTIONxCHANGE',
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
    features: ['Secure user login workflow', 'Structured grievance submission', 'Clear status tracking and management', 'Responsive dashboard experience'],
    challenges: ['Designing an understandable workflow for users and administrators to manage submitted grievances'],
    solutions: ['Created an authenticated system with clear status-based organization for each grievance'],
    githubUrl: '',
    liveUrl: 'https://grievance-management-system-1-d7kk.onrender.com/login',
    featured: true,
  },
  {
    title: 'MediAI Pro',
    slug: 'mediai-pro',
    description: 'MediAI Pro is an AI-powered healthcare platform that brings together patient-doctor video consultations, a digital Health Vault for medical records, symptom triage, and medical report analysis. It is designed to make healthcare interactions and personal health information easier to manage in one place.',
    shortDescription: 'AI-powered healthcare platform with video consultations, a Health Vault, symptom triage and report analysis.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
    screenshots: [],
    technologies: ['MongoDB', 'Express', 'React', 'Node.js', 'AI'],
    category: 'Full Stack',
    features: ['Patient-doctor video consultations', 'Digital Health Vault for medical records', 'AI symptom triage', 'Medical report analysis'],
    challenges: ['Combining multiple healthcare workflows in one understandable patient experience'],
    solutions: ['Organized consultations, records and AI-assisted tools into a unified full-stack platform'],
    githubUrl: 'https://github.com/abdul-kheeyan/MediAI-Pro',
    liveUrl: '',
    featured: true,
  },
  {
    title: 'EchoWave',
    slug: 'echowave',
    description: 'EchoWave is a real-time communication platform built with the MERN stack, WebRTC and Socket.io. It enables peer-to-peer audio and video communication with a focus on low latency and a smooth user experience.',
    shortDescription: 'Real-time MERN communication platform with WebRTC and Socket.io audio/video calling.',
    image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=900&q=80',
    screenshots: [],
    technologies: ['MongoDB', 'Express', 'React', 'Node.js', 'WebRTC', 'Socket.io'],
    category: 'Full Stack',
    features: ['Peer-to-peer audio and video calls', 'Real-time communication with Socket.io', 'Low-latency WebRTC connections', 'MERN application architecture'],
    challenges: ['Delivering a responsive real-time calling experience across changing network conditions'],
    solutions: ['Used WebRTC for peer connections and Socket.io for real-time signalling and application events'],
    githubUrl: 'https://github.com/abdul-kheeyan/EchoWave',
    liveUrl: '',
    featured: true,
  },
  {
    title: 'Veltrix',
    slug: 'veltrix',
    description: 'Veltrix is a scalable full-stack e-commerce platform built with the MERN stack. It includes secure authentication, dynamic product management, a shopping cart and an administrative dashboard for managing the store experience.',
    shortDescription: 'Scalable MERN e-commerce platform with authentication, product management, cart and admin dashboard.',
    image: '/veltrix-cover.svg',
    screenshots: [],
    technologies: ['MongoDB', 'Express', 'React', 'Node.js', 'JWT'],
    category: 'Full Stack',
    features: ['Secure user authentication', 'Dynamic product management', 'Shopping cart workflow', 'Admin dashboard'],
    challenges: ['Keeping customer shopping flows and product administration clear within one application'],
    solutions: ['Created a role-aware MERN application separating customer and admin workflows'],
    githubUrl: 'https://github.com/abdul-kheeyan/Veltrix',
    liveUrl: '',
    featured: true,
  },
  {
    title: 'Local Medicine Finder',
    slug: 'local-medicine-finder',
    description: 'Local Medicine Finder is a Node.js web application that helps people find nearby medical shops with medicine availability. It uses Express, MongoDB and EJS to provide a practical, location-focused healthcare utility.',
    shortDescription: 'Find nearby medical shops and available medicines with an Express, MongoDB and EJS web app.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80',
    screenshots: [],
    technologies: ['Node.js', 'Express', 'MongoDB', 'EJS', 'JavaScript'],
    category: 'Full Stack',
    features: ['Nearby medical shop discovery', 'Medicine availability lookup', 'Server-rendered EJS interface', 'MongoDB-backed application data'],
    challenges: ['Presenting local medicine availability through a simple and accessible user flow'],
    solutions: ['Built a focused Express and MongoDB application with clear search and shop-discovery views'],
    githubUrl: 'https://github.com/abdul-kheeyan/Local-Medicine-Finder',
    liveUrl: '',
    featured: true,
  },
];

const syncPortfolioProjects = async () => {
  try {
    await connectDB();

    if (await User.countDocuments() === 0) {
      await User.create({
        name: 'Admin',
        email: 'admin@techslot.dev',
        password: 'Admin@TechSlot2025!',
        role: 'admin',
      });
      console.log('[Portfolio sync] Default admin created.');
    }

    for (const project of projects) {
      await Project.findOneAndUpdate(
        { slug: project.slug },
        { $set: project },
        { upsert: true, new: true, runValidators: true },
      );
    }

    console.log(`[Portfolio sync] Added or updated ${projects.length} portfolio projects.`);
    process.exit(0);
  } catch (error) {
    console.error(`[Portfolio sync] Error: ${error.message}`);
    process.exit(1);
  }
};

syncPortfolioProjects();
