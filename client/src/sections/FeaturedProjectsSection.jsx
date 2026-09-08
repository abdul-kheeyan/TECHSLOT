import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import useProjects from '../hooks/useProjects';
import Badge from '../components/Badge';
import ProjectImage from '../components/ProjectImage';

export default function FeaturedProjectsSection() {
  const { projects, loading } = useProjects({ featured: true });

  return (
    <section className="section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-label">Portfolio</span>
          <h2 className="section-title">Featured <span className="text-gradient">Projects</span></h2>
          <p className="section-subtitle">
            A selection of recent work showcasing full-stack engineering, clean architecture, and polished user experiences.
          </p>
        </motion.div>

        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : (
          <div className="grid-3">
            {(projects.length ? projects : []).slice(0, 3).map((project, i) => (
              <motion.article
                key={project._id}
                className="project-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link to={`/projects/${project._id}`} style={{ overflow: 'hidden' }}>
                  <ProjectImage
                    project={project}
                    className="project-card-image"
                    loading="lazy"
                  />
                </Link>
                <div className="project-card-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Badge variant="blue">{project.category}</Badge>
                    {project.featured && <Badge variant="accent">Featured</Badge>}
                  </div>
                  <Link to={`/projects/${project._id}`}>
                    <h3 className="project-card-title">{project.title}</h3>
                  </Link>
                  <p className="project-card-desc">{project.shortDescription}</p>
                  <div className="project-card-tags">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <Link
                      to={`/projects/${project._id}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: 'var(--color-blue-accent)', fontWeight: 600 }}
                    >
                      View Details <ArrowRight size={14} />
                    </Link>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}
                      >
                        Live <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <motion.div
          style={{ textAlign: 'center', marginTop: '3rem' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            to="/projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '0.75rem 1.75rem',
              background: 'var(--gradient-primary)',
              color: '#fff',
              borderRadius: 9999,
              fontWeight: 600,
              fontSize: '0.9rem',
              boxShadow: '0 4px 20px rgba(37,99,235,0.35)',
            }}
          >
            View All Projects <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
