const chatbotFaq = [
  {
    answer: 'TechSlot lists website development, full-stack development, React development, MERN applications, backend and API development, UI implementation, business websites, and custom web applications.',
    phrases: ['what services do you offer', 'what services', 'what do you offer', 'your services', 'website development', 'web development', 'e commerce', 'ecommerce', 'mern application', 'custom web application'],
    keywords: ['service', 'services', 'website', 'websites', 'development', 'react', 'mern', 'backend', 'api', 'frontend', 'application', 'applications', 'ecommerce', 'shop', 'seo'],
  },
  {
    answer: 'The website describes a six-step process: discovery, planning, development, testing, deployment, and post-launch support.',
    phrases: ['project process', 'how does the process work', 'how do projects work', 'project steps', 'how do you work'],
    keywords: ['process', 'steps', 'workflow', 'discovery', 'planning', 'testing', 'deployment'],
  },
  {
    answer: 'Technologies named on the website include React, Node.js, Express, MongoDB, JavaScript, TypeScript, JWT, REST APIs, Vite, Mongoose, Redis, AWS, Docker, Socket.io, and GraphQL. The stack depends on the service and project requirements.',
    phrases: ['what technologies do you use', 'which technologies', 'your tech stack', 'technology stack', 'what tech do you use'],
    keywords: ['technology', 'technologies', 'tech', 'stack', 'react', 'node', 'nodejs', 'express', 'mongo', 'mongodb', 'javascript', 'typescript', 'jwt', 'api', 'vite', 'mongoose', 'redis', 'aws', 'docker', 'socket', 'socketio', 'graphql'],
  },
  {
    answer: 'The site does not publish fixed prices. The contact form collects a budget range so TechSlot can review your project and provide a tailored plan and quote.',
    phrases: ['how much does it cost', 'how much for a website', 'what does a website cost', 'cost of a website', 'price for a website', 'website development quote', 'quote for a website', 'price for website development', 'what are your prices', 'how much do you charge', 'project pricing', 'service pricing', 'do you have a price list'],
    keywords: ['price', 'prices', 'pricing', 'cost', 'charge', 'charges', 'quote', 'budget', 'expensive'],
  },
  {
    answer: 'The contact form offers timeline preferences of 1–2 weeks, 2–4 weeks, 1–2 months, or flexible. These are form choices, not delivery guarantees; the project timeline needs to be discussed for your scope.',
    phrases: ['how long does a project take', 'project delivery time', 'delivery timeline', 'how long for delivery', 'what is the timeline'],
    keywords: ['timeline', 'duration', 'delivery', 'deadline', 'weeks', 'months', 'long', 'take'],
  },
  {
    answer: 'The website describes post-launch maintenance, updates, and ongoing technical support. It does not publish specific maintenance plans or rates.',
    phrases: ['do you offer maintenance', 'post launch support', 'ongoing support', 'maintenance plans', 'website maintenance'],
    keywords: ['maintenance', 'support', 'updates', 'after', 'launch'],
  },
  {
    answer: 'To discuss a project, submit the existing contact form. It asks for your name, email, optional phone, project type, budget range, timeline, and a project overview. The site says it aims to respond within 24 hours.',
    phrases: ['how can i start a project', 'how do i get started', 'contact techslot', 'how do i contact you', 'start a project', 'get in touch'],
    keywords: ['contact', 'start', 'started', 'inquiry', 'enquiry', 'form', 'email'],
  },
];

const ignoredWords = new Set([
  'a', 'about', 'an', 'and', 'are', 'can', 'do', 'does', 'for', 'how', 'i',
  'in', 'is', 'it', 'me', 'of', 'on', 'the', 'to', 'use', 'what', 'which',
  'you', 'your',
]);

const normalize = (value) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const findFaq = (message) => {
  const query = normalize(message);
  const queryWords = new Set(
    query.split(/\s+/).filter((word) => word.length > 2 && !ignoredWords.has(word))
  );
  let bestMatch;
  let bestScore = 0;

  for (const faq of chatbotFaq) {
    const phrases = faq.phrases.map(normalize);
    const phraseScore = phrases.reduce(
      (score, phrase) => query.includes(phrase) ? Math.max(score, 10 + phrase.length) : score,
      0
    );
    const keywordScore = faq.keywords.reduce(
      (score, keyword) => queryWords.has(normalize(keyword)) ? score + 1 : score,
      0
    );
    const score = phraseScore || keywordScore;
    if (score > bestScore) {
      bestMatch = faq;
      bestScore = score;
    }
  }

  return bestScore > 0 ? bestMatch : null;
};

export const answerChatbotQuestion = (message) => {
  const match = findFaq(message);
  if (match) {
    return { answer: match.answer, contactCta: false };
  }

  return {
    answer: 'I don’t have confirmed information about that on the website. For a specific question or project requirements, please use the existing contact form.',
    contactCta: true,
  };
};
