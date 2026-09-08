import {
  Globe, Layers, Code2, Database, Server, Palette, Briefcase, AppWindow,
} from 'lucide-react';

const ICON_MAP = {
  Globe, Layers, Code2, Database, Server, Palette, Briefcase, AppWindow,
};

export const getServiceIcon = (iconName, size = 24) => {
  const Icon = ICON_MAP[iconName] || Code2;
  return <Icon size={size} />;
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export const truncate = (text, max = 120) =>
  text?.length > max ? `${text.slice(0, max).trim()}…` : text;

export const getInitials = (name) =>
  name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

export const CONTACT_STATUS = {
  new: { label: 'New', className: 'badge-accent' },
  contacted: { label: 'Contacted', className: 'badge-warning' },
  completed: { label: 'Completed', className: 'badge-success' },
};

export const PROJECT_CATEGORIES = [
  'All',
  'Web Development',
  'Full Stack',
  'Frontend',
  'Backend',
  'Business',
  'SaaS',
];

export const BUDGET_OPTIONS = [
  'Under ₹10,000',
  '₹10,000 - ₹25,000',
  '₹25,000 - ₹50,000',
  '₹50,000+',
  'Custom',
];

export const TIMELINE_OPTIONS = ['1-2 Weeks', '2-4 Weeks', '1-2 Months', 'Flexible'];

export const PROJECT_TYPE_OPTIONS = [
  'Website',
  'Web Application',
  'MERN Application',
  'Frontend',
  'Backend/API',
  'Other',
];
