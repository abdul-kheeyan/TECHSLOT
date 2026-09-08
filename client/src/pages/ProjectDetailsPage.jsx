import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, GitBranch, CheckCircle, AlertTriangle } from 'lucide-react';
import SEO from '../components/SEO';
import Badge from '../components/Badge';
import { getProjectById } from '../services/api';
import ProjectImage from '../components/ProjectImage';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getProjectById(id)
      .then(({ data }) => setProject(data.data))
      .catch((err) => setError(err.response?.data?.message || 'Project not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '60vh' }}>
        <div className="spinner" />
        <p>Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="empty-state" style={{ minHeight: '60vh' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Project Not Found</h2>
        <p>{error}</p>
        <Link to="/projects" style={{ color: 'var(--color-blue-accent)', marginTop: '1rem' }}>
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO title={project.title} description={project.shortDescription} path={`/projects/${id}`} />

      <article>
        <section style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
          <div className="container">
            <Link
              to="/projects"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}
            >
              <ArrowLeft size={16} /> Back to Projects
            </Link>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', flexWrap: 'wrap' }}>
                <Badge variant="blue">{project.category}</Badge>
                {project.featured && <Badge variant="accent">Featured</Badge>}
              </div>
              <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem' }}>
                {project.title}
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, maxWidth: 720, marginBottom: '1.5rem' }}>
                {project.shortDescription}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1.5rem' }}>
                {project.technologies.map((tech) => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.6rem 1.25rem', background: 'var(--gradient-primary)', color: '#fff', borderRadius: 9999, fontWeight: 600, fontSize: '0.875rem' }}
                  >
                    Live Demo <ExternalLink size={14} />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.6rem 1.25rem', border: '1px solid rgba(56,189,248,0.3)', color: 'var(--color-text-primary)', borderRadius: 9999, fontWeight: 600, fontSize: '0.875rem' }}
                  >
                    View Code <GitBranch size={14} />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <div className="container">
            <ProjectImage
              project={project}
              style={{ width: '100%', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(56,189,248,0.15)', maxHeight: 480, objectFit: 'cover' }}
            />
          </div>
        </section>

        <section className="section-sm">
          <div className="container">
            <div className="project-details-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Overview</h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: '2.5rem' }}>{project.description}</p>

                {project.challenges?.length > 0 && (
                  <>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Challenges</h2>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '2.5rem' }}>
                      {project.challenges.map((c) => (
                        <li key={c} style={{ display: 'flex', gap: 10, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                          <AlertTriangle size={16} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: 2 }} /> {c}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {project.solutions?.length > 0 && (
                  <>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Solutions</h2>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {project.solutions.map((s) => (
                        <li key={s} style={{ display: 'flex', gap: 10, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                          <CheckCircle size={16} color="var(--color-success)" style={{ flexShrink: 0, marginTop: 2 }} /> {s}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div>
                <div className="card" style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 1rem)' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Key Features</h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(project.features || []).map((f) => (
                      <li key={f} style={{ display: 'flex', gap: 8, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        <CheckCircle size={14} color="var(--color-blue-accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {project.screenshots?.length > 0 && (
          <section className="section-sm" style={{ background: 'var(--color-bg-secondary)' }}>
            <div className="container">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Screenshots</h2>
              <div className="grid-2">
                {project.screenshots.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${project.title} screenshot ${i + 1}`}
                    style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(56,189,248,0.12)' }}
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
}
