import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import Badge from '../components/Badge';
import { getProjects } from '../services/api';
import { PROJECT_CATEGORIES } from '../utils/helpers';
import ProjectImage from '../components/ProjectImage';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = {};
        if (category !== 'All') params.category = category;
        if (search.trim()) params.search = search.trim();
        const { data } = await getProjects(params);
        setProjects(data.data || []);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [category, search]);

  return (
    <>
      <SEO
        title="Projects"
        description="Explore the techslot.dev portfolio — full-stack web applications, SaaS platforms, e-commerce, and business websites."
        path="/projects"
      />

      <section className="section" style={{ paddingTop: '3rem' }}>
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="section-label">Portfolio</span>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Project <span className="text-gradient">Gallery</span>
            </h1>
            <p className="section-subtitle">
              Filter by category or search by technology to explore past work across industries and stack types.
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 360 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="search"
                className="form-control"
                placeholder="Search projects or technologies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 40 }}
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {PROJECT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`admin-filter-btn ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-container"><div className="spinner" /></div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <p>No projects found matching your filters.</p>
            </div>
          ) : (
            <div className="grid-3">
              {projects.map((project, i) => (
                <motion.article
                  key={project._id}
                  className="project-card"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/projects/${project._id}`} style={{ overflow: 'hidden' }}>
                    <ProjectImage project={project} className="project-card-image" />
                  </Link>
                  <div className="project-card-body">
                    <Badge variant="blue">{project.category}</Badge>
                    <Link to={`/projects/${project._id}`}>
                      <h3 className="project-card-title">{project.title}</h3>
                    </Link>
                    <p className="project-card-desc">{project.shortDescription}</p>
                    <div className="project-card-tags">
                      {project.technologies.slice(0, 5).map((tech) => (
                        <span key={tech} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                    <Link
                      to={`/projects/${project._id}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: 'var(--color-blue-accent)', fontWeight: 600, marginTop: 8 }}
                    >
                      View Case Study <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
