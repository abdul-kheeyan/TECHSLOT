import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ProjectImage from '../components/ProjectImage';
import CtaSection from '../sections/CtaSection';
import useProjects from '../hooks/useProjects';

export default function CaseStudiesPage() {
  const { projects, loading } = useProjects({ featured: true });

  return (
    <>
      <SEO
        title="Case Studies"
        description="Explore detailed Techslot case studies covering the problem, solution, engineering approach, and finished digital product."
        path="/case-studies"
      />

      <section className="section case-studies-intro" style={{ paddingTop: '3rem' }}>
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="section-kicker">Case studies / 01</span>
            <h1 className="section-title">How ideas become<br />working digital products.</h1>
            <p className="section-subtitle">
              A closer look at real project context, design decisions, technical execution, and the work behind each finished experience.
            </p>
          </motion.div>

          {loading ? (
            <div className="loading-container"><div className="spinner" /></div>
          ) : projects.length === 0 ? (
            <div className="empty-state"><p>No featured case studies are available yet.</p></div>
          ) : (
            <div className="case-study-list">
              {projects.map((project, index) => (
                <motion.article
                  className="case-study-feature"
                  key={project._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.18 }}
                  transition={{ duration: 0.55 }}
                >
                  <div className="case-study-meta">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span>{project.category}</span>
                  </div>

                  <Link to={`/projects/${project._id}`} className="case-study-image-link">
                    <ProjectImage project={project} className="case-study-image" />
                  </Link>

                  <div className="case-study-content">
                    <h2>{project.title}</h2>
                    <p>{project.shortDescription}</p>

                    <dl className="case-study-facts">
                      <div>
                        <dt>Scope</dt>
                        <dd>{project.category}</dd>
                      </div>
                      <div>
                        <dt>Technology</dt>
                        <dd>{project.technologies?.slice(0, 3).join(' / ')}</dd>
                      </div>
                    </dl>

                    <div className="case-study-actions">
                      <Link to={`/projects/${project._id}`} className="case-study-link">
                        View case study <ArrowRight size={16} />
                      </Link>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="case-study-live"
                        >
                          Visit product <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaSection />
    </>
  );
}
