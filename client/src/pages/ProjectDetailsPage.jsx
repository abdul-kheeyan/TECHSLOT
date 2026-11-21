import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, GitBranch, CheckCircle, AlertTriangle } from 'lucide-react';
import SEO from '../components/SEO';
import { getProjectById } from '../services/api';
import ProjectImage from '../components/ProjectImage';
import CtaSection from '../sections/CtaSection';

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

      <article className="project-case-study">
        <section className="project-case-hero">
          <div className="container">
            <Link
              to="/projects"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}
            >
              <ArrowLeft size={16} /> Back to Projects
            </Link>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <span className="section-kicker">Case study / {project.category}</span>
              <h1>{project.title}</h1>
              <p className="project-case-summary">{project.shortDescription}</p>
              <div className="project-case-actions">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    Live Demo <ExternalLink size={14} />
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    View Code <GitBranch size={14} />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="project-case-cover">
          <div className="container">
            <ProjectImage project={project} className="project-case-cover-image" />
          </div>
        </section>

        <section className="project-case-body section">
          <div className="container">
            <dl className="project-case-facts">
              <div><dt>Project type</dt><dd>{project.category}</dd></div>
              <div><dt>Build</dt><dd>{project.technologies?.slice(0, 4).join(', ')}</dd></div>
              <div><dt>Status</dt><dd>{project.featured ? 'Featured work' : 'Completed project'}</dd></div>
            </dl>

            <div className="project-case-story">
              <div className="project-case-story-heading">
                <span className="section-kicker">01 / Context</span>
                <h2>Overview</h2>
              </div>
              <p>{project.description}</p>
            </div>

            {project.challenges?.length > 0 && (
              <div className="project-case-story project-case-story-challenge">
                <div className="project-case-story-heading">
                  <span className="section-kicker">02 / Constraints</span>
                  <h2>Challenge</h2>
                </div>
                    <ul>
                      {project.challenges.map((c) => (
                        <li key={c}>
                          <AlertTriangle size={16} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: 2 }} /> {c}
                        </li>
                      ))}
                    </ul>
              </div>
            )}

            {project.solutions?.length > 0 && (
              <div className="project-case-story">
                <div className="project-case-story-heading">
                  <span className="section-kicker">03 / Execution</span>
                  <h2>Solution</h2>
                </div>
                    <ul>
                      {project.solutions.map((s) => (
                        <li key={s}>
                          <CheckCircle size={16} color="var(--color-success)" style={{ flexShrink: 0, marginTop: 2 }} /> {s}
                        </li>
                      ))}
                    </ul>
              </div>
            )}

            {project.features?.length > 0 && (
              <div className="project-case-features">
                <span className="section-kicker">04 / Delivered</span>
                <h2>Core features</h2>
                <div>
                  {project.features.map((feature) => (
                    <span key={feature}><CheckCircle size={15} /> {feature}</span>
                  ))}
                </div>
              </div>
            )}
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
        <CtaSection />
      </article>
    </>
  );
}
