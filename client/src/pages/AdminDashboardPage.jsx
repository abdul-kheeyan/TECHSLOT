import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, Camera } from 'lucide-react';
import SEO from '../components/SEO';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Notification from '../components/Notification';
import {
  getProjects, createProject, updateProject, deleteProject,
  getServices, createService, updateService, deleteService,
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  getPortfolioSettings, updateInstagramReels,
  getContacts, updateContactStatus, deleteContact,
} from '../services/api';
import { formatDate, CONTACT_STATUS } from '../utils/helpers';

const emptyProject = {
  title: '', description: '', shortDescription: '', image: '',
  technologies: '', category: 'Full Stack', features: '', challenges: '',
  solutions: '', githubUrl: '', liveUrl: '', featured: false,
};

const emptyService = {
  title: '', description: '', icon: 'Code2', features: '', technologies: '',
};

const emptyTestimonial = {
  clientName: '', clientRole: '', clientImage: '', rating: 5, review: '',
};

export default function AdminDashboardPage() {
  const reelsLoaded = useRef(false);
  const [metrics, setMetrics] = useState({ projects: 0, services: 0, testimonials: 0, inquiries: 0 });
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [instagramReels, setInstagramReels] = useState([]);
  const [savedInstagramReels, setSavedInstagramReels] = useState([]);
  const [newInstagramReelUrl, setNewInstagramReelUrl] = useState('');
  const [savingInstagramReel, setSavingInstagramReel] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactFilter, setContactFilter] = useState('all');
  const [contactPage, setContactPage] = useState(1);
  const [contactPagination, setContactPagination] = useState({ page: 1, pages: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ type: null, item: null });
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'info', visible: false });

  const notify = (message, type = 'success') => setNotification({ message, type, visible: true });

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [p, s, t, settings, c, allContacts] = await Promise.all([
        getProjects({ limit: 100 }), getServices(), getTestimonials(),
        getPortfolioSettings(),
        getContacts({
          page: contactPage,
          limit: 20,
          ...(contactFilter !== 'all' ? { status: contactFilter } : {}),
        }),
        getContacts({ page: 1, limit: 1 }),
      ]);
      const proj = p.data.data || [];
      const serv = s.data.data || [];
      const test = t.data.data || [];
      const cont = c.data.data || [];
      setProjects(proj);
      setServices(serv);
      setTestimonials(test);
      if (!reelsLoaded.current) {
        const reels = settings.data.data.instagramReels
          || (settings.data.data.instagramReelUrl ? [settings.data.data.instagramReelUrl] : []);
        setInstagramReels(reels);
        setSavedInstagramReels(reels);
        reelsLoaded.current = true;
      }
      setContacts(cont);
      setContactPagination(c.data.pagination || { page: contactPage, pages: 0, total: cont.length });
      setMetrics({
        projects: p.data.pagination?.total ?? proj.length,
        services: serv.length,
        testimonials: test.length,
        inquiries: allContacts.data.pagination?.total ?? cont.length,
      });
    } catch {
      notify('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, [contactFilter, contactPage]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const openModal = (type, item = null) => {
    const defaults = { project: emptyProject, service: emptyService, testimonial: emptyTestimonial };
    setForm(item ? { ...item } : { ...defaults[type] });
    setModal({ type, item });
  };

  const closeModal = () => { setModal({ type: null, item: null }); setForm({}); };

  const parseList = (val) => (
    typeof val === 'string'
      ? val.split(',').map((s) => s.trim()).filter(Boolean)
      : Array.isArray(val) ? val : []
  );

  const handleSave = async () => {
    if (
      modal.type === 'project'
      && (!form.title?.trim()
        || !form.shortDescription?.trim()
        || !form.image?.trim()
        || !form.description?.trim()
        || parseList(form.technologies).length === 0)
    ) {
      notify('Add the title, summary, cover image, description, and at least one technology.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (modal.type === 'project') {
        const payload = {
          ...form,
          technologies: parseList(form.technologies),
          features: parseList(form.features),
          challenges: parseList(form.challenges),
          solutions: parseList(form.solutions),
        };
        if (modal.item?._id) await updateProject(modal.item._id, payload);
        else await createProject(payload);
      } else if (modal.type === 'service') {
        const payload = { ...form, features: parseList(form.features), technologies: parseList(form.technologies) };
        if (modal.item?._id) await updateService(modal.item._id, payload);
        else await createService(payload);
      } else if (modal.type === 'testimonial') {
        if (modal.item?._id) await updateTestimonial(modal.item._id, form);
        else await createTestimonial(form);
      }
      notify(`${modal.type} saved successfully`);
      closeModal();
      loadAll();
    } catch (err) {
      notify(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddInstagramReel = () => {
    const input = newInstagramReelUrl.trim();
    if (!input) return;

    try {
      const url = new URL(input);
      const match = url.pathname.match(/^\/reel\/([A-Za-z0-9_-]+)\/?$/);
      if (
        url.protocol !== 'https:' ||
        !['instagram.com', 'www.instagram.com'].includes(url.hostname.toLowerCase()) ||
        !match
      ) {
        notify('Paste a valid Instagram Reel link.', 'error');
        return;
      }

      const normalizedUrl = `https://www.instagram.com/reel/${match[1]}/`;
      if (instagramReels.includes(normalizedUrl)) {
        notify('This Reel is already in your list.', 'error');
        return;
      }

      setInstagramReels((reels) => [...reels, normalizedUrl]);
      setNewInstagramReelUrl('');
    } catch {
      notify('Paste a valid Instagram Reel link.', 'error');
    }
  };

  const handleSaveInstagramReels = async () => {
    setSavingInstagramReel(true);
    try {
      const { data } = await updateInstagramReels(instagramReels);
      const savedReels = data.data.instagramReels;
      setInstagramReels(savedReels);
      setSavedInstagramReels(savedReels);
      notify('Instagram Reels saved successfully');
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to save Instagram Reels', 'error');
    } finally {
      setSavingInstagramReel(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      if (type === 'project') await deleteProject(id);
      else if (type === 'service') await deleteService(id);
      else if (type === 'testimonial') await deleteTestimonial(id);
      else if (type === 'contact') await deleteContact(id);
      notify('Deleted successfully');
      if (type === 'contact' && contacts.length === 1 && contactPage > 1) {
        setContactPage((page) => page - 1);
      } else {
        loadAll();
      }
    } catch {
      notify('Delete failed', 'error');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateContactStatus(id, status);
      notify('Status updated');
      loadAll();
    } catch {
      notify('Status update failed', 'error');
    }
  };

  const filteredContacts = contacts;

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '60vh' }}>
        <div className="spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <SEO title="Admin Dashboard" />

      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">TECHSLOT / CONTENT STUDIO</span>
          <h1>Portfolio Dashboard</h1>
          <p>Organize your projects, Instagram Reels, and client inquiries.</p>
        </div>
        <Button size="sm" icon={<Plus size={14} />} onClick={() => openModal('project')}>New Project</Button>
      </div>

      {notification.visible && (
        <div style={{ marginBottom: '1.5rem' }}>
          <Notification {...notification} onClose={() => setNotification((n) => ({ ...n, visible: false }))} />
        </div>
      )}

      <section id="admin-overview" className="admin-metrics">
        {[
          { label: 'Projects', value: metrics.projects },
          { label: 'Instagram Reels', value: instagramReels.length },
          { label: 'Services', value: metrics.services },
          { label: 'Testimonials', value: metrics.testimonials },
          { label: 'Inquiries', value: metrics.inquiries },
        ].map((m) => (
          <div key={m.label} className="admin-metric-card">
            <div className="admin-metric-value">{m.value}</div>
            <div className="admin-metric-label">{m.label}</div>
          </div>
        ))}
      </section>

      {/* Projects */}
      <section id="admin-projects" className="admin-content-section">
        <div className="admin-header">
          <div>
            <span className="admin-section-kicker">PORTFOLIO</span>
            <h2 className="admin-section-title">Projects <span>{projects.length}</span></h2>
          </div>
          <Button size="sm" icon={<Plus size={14} />} onClick={() => openModal('project')}>Add Project</Button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Project</th><th>Category</th><th>Visibility</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="admin-project-name">{p.title}</div>
                    <div className="admin-project-summary">{p.shortDescription}</div>
                  </td>
                  <td><Badge variant="blue">{p.category}</Badge></td>
                  <td>{p.featured ? <Badge variant="success">Featured</Badge> : <span className="admin-muted">Standard</span>}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-btn-icon" onClick={() => openModal('project', { ...p, technologies: p.technologies.join(', '), features: p.features.join(', '), challenges: (p.challenges || []).join(', '), solutions: (p.solutions || []).join(', ') })} aria-label="Edit"><Pencil size={14} /></button>
                      <button className="admin-btn-icon danger" onClick={() => handleDelete('project', p._id)} aria-label="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="admin-reels" className="admin-content-section">
        <div className="admin-header">
          <div>
            <span className="admin-section-kicker">SOCIAL CONTENT</span>
            <h2 className="admin-section-title">Instagram Reels <span>{instagramReels.length}</span></h2>
          </div>
        </div>
        <div className="instagram-reel-settings">
          <div className="instagram-reel-entry">
            <div className="form-group">
              <label className="form-label" htmlFor="admin-instagram-reel-url">Add a Reel link</label>
              <input
                id="admin-instagram-reel-url"
                className="form-control"
                type="url"
                placeholder="https://www.instagram.com/reel/..."
                value={newInstagramReelUrl}
                onChange={(event) => setNewInstagramReelUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleAddInstagramReel();
                  }
                }}
              />
              <small>Add each public Reel, then save your changes. Removing every link hides the section on the homepage.</small>
            </div>
            <Button size="sm" variant="outline" icon={<Plus size={14} />} onClick={handleAddInstagramReel}>
              Add Reel
            </Button>
          </div>

          {instagramReels.length ? (
            <div className="admin-reel-list">
              {instagramReels.map((url, index) => (
                <article className="admin-reel-row" key={url}>
                  <span className="admin-reel-icon"><Camera size={18} /></span>
                  <div className="admin-reel-info">
                    <strong>Instagram Reel {String(index + 1).padStart(2, '0')}</strong>
                    <span>{url}</span>
                  </div>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="admin-btn-icon" aria-label={`Open Reel ${index + 1}`}>
                    <ExternalLink size={14} />
                  </a>
                  <button
                    type="button"
                    className="admin-btn-icon danger"
                    onClick={() => setInstagramReels((reels) => reels.filter((reel) => reel !== url))}
                    aria-label={`Remove Reel ${index + 1}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="admin-empty-state">
              <Camera size={22} />
              <strong>No Reels added yet</strong>
              <span>Add Reel links above to show them on your homepage.</span>
            </div>
          )}
          <div className="instagram-reel-save">
            {JSON.stringify(instagramReels) !== JSON.stringify(savedInstagramReels) && (
              <span className="admin-unsaved-note">You have unsaved Reel changes.</span>
            )}
            <Button
              onClick={handleSaveInstagramReels}
              loading={savingInstagramReel}
              disabled={JSON.stringify(instagramReels) === JSON.stringify(savedInstagramReels)}
            >
              Save Reel Changes
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="admin-services" className="admin-content-section">
        <div className="admin-header">
          <div>
            <span className="admin-section-kicker">OFFERINGS</span>
            <h2 className="admin-section-title">Services <span>{services.length}</span></h2>
          </div>
          <Button size="sm" icon={<Plus size={14} />} onClick={() => openModal('service')}>Add Service</Button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Title</th><th>Icon</th><th>Technologies</th><th>Actions</th></tr></thead>
            <tbody>
              {services.map((s) => (
                <tr key={s._id}>
                  <td style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{s.title}</td>
                  <td>{s.icon}</td>
                  <td>{s.technologies.slice(0, 3).join(', ')}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-btn-icon" onClick={() => openModal('service', { ...s, features: s.features.join(', '), technologies: s.technologies.join(', ') })} aria-label="Edit"><Pencil size={14} /></button>
                      <button className="admin-btn-icon danger" onClick={() => handleDelete('service', s._id)} aria-label="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Testimonials */}
      <section id="admin-testimonials" className="admin-content-section">
        <div className="admin-header">
          <div>
            <span className="admin-section-kicker">CLIENT FEEDBACK</span>
            <h2 className="admin-section-title">Testimonials <span>{testimonials.length}</span></h2>
          </div>
          <Button size="sm" icon={<Plus size={14} />} onClick={() => openModal('testimonial')}>Add Testimonial</Button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Client</th><th>Role</th><th>Rating</th><th>Actions</th></tr></thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t._id}>
                  <td style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{t.clientName}</td>
                  <td>{t.clientRole}</td>
                  <td>{'★'.repeat(t.rating)}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-btn-icon" onClick={() => openModal('testimonial', t)} aria-label="Edit"><Pencil size={14} /></button>
                      <button className="admin-btn-icon danger" onClick={() => handleDelete('testimonial', t._id)} aria-label="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Inquiries */}
      <section id="admin-inquiries" className="admin-content-section">
        <div className="admin-header">
          <div>
            <span className="admin-section-kicker">LEADS</span>
            <h2 className="admin-section-title">Inquiries <span>{contactPagination.total}</span></h2>
          </div>
        </div>
        <div className="admin-filters">
          {['all', 'new', 'contacted', 'completed'].map((f) => (
            <button
              key={f}
              className={`admin-filter-btn ${contactFilter === f ? 'active' : ''}`}
              onClick={() => {
                setContactFilter(f);
                setContactPage(1);
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Project</th><th>Budget</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredContacts.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{c.name}</div>
                    <div style={{ fontSize: '0.75rem' }}>{c.email}</div>
                  </td>
                  <td>{c.projectType}</td>
                  <td>{c.budget}</td>
                  <td>
                    <select
                      className="form-control"
                      style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }}
                      value={c.status}
                      onChange={(e) => handleStatusUpdate(c._id, e.target.value)}
                    >
                      {Object.keys(CONTACT_STATUS).map((s) => (
                        <option key={s} value={s}>{CONTACT_STATUS[s].label}</option>
                      ))}
                    </select>
                  </td>
                  <td>{formatDate(c.createdAt)}</td>
                  <td>
                    <button className="admin-btn-icon danger" onClick={() => handleDelete('contact', c._id)} aria-label="Delete"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-pagination" aria-label="Inquiry pages">
          <button
            className="admin-filter-btn"
            type="button"
            disabled={contactPage <= 1 || loading}
            onClick={() => setContactPage((page) => page - 1)}
          >
            Previous
          </button>
          <span>Page {contactPage} of {Math.max(contactPagination.pages, 1)} ({contactPagination.total} inquiries)</span>
          <button
            className="admin-filter-btn"
            type="button"
            disabled={contactPage >= contactPagination.pages || loading}
            onClick={() => setContactPage((page) => page + 1)}
          >
            Next
          </button>
        </div>
      </section>

      {/* Modals */}
      <Modal
        isOpen={modal.type === 'project'}
        onClose={closeModal}
        title={modal.item ? 'Edit Project' : 'Add Project'}
        size="lg"
      >
        <div className="admin-project-form">
          <div className="admin-form-section">
            <div>
              <h3>Project overview</h3>
              <p>Set the title, summary, and image shown in your portfolio.</p>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="project-title">Project title</label>
              <input id="project-title" className="form-control" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="project-summary">Short summary</label>
              <input id="project-summary" className="form-control" maxLength={220} value={form.shortDescription || ''} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="project-image">Cover image URL</label>
              <input id="project-image" className="form-control" type="url" value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
            </div>
          </div>

          <div className="admin-form-section">
            <div>
              <h3>Project details</h3>
              <p>Describe the work and organize it for visitors.</p>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="project-description">Full description</label>
              <textarea id="project-description" className="form-control" rows={4} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="project-category">Category</label>
                <select id="project-category" className="form-control" value={form.category || 'Full Stack'} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {['Web Development', 'Full Stack', 'Frontend', 'Backend', 'Business', 'SaaS'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="project-featured">Homepage feature</label>
                <select id="project-featured" className="form-control" value={form.featured ? 'true' : 'false'} onChange={(e) => setForm({ ...form, featured: e.target.value === 'true' })}>
                  <option value="false">Standard project</option>
                  <option value="true">Show in Featured Projects</option>
                </select>
              </div>
            </div>
          </div>

          <div className="admin-form-section">
            <div>
              <h3>Links & technologies</h3>
              <p>Optional links and comma-separated project details.</p>
            </div>
            <div className="form-grid-2">
              {[
                { field: 'liveUrl', label: 'Live project URL' },
                { field: 'githubUrl', label: 'GitHub repository URL' },
                { field: 'technologies', label: 'Technologies' },
                { field: 'features', label: 'Features' },
                { field: 'challenges', label: 'Challenges' },
                { field: 'solutions', label: 'Solutions' },
              ].map(({ field, label }) => (
                <div key={field} className="form-group">
                  <label className="form-label" htmlFor={`project-${field}`}>{label}</label>
                  <input
                    id={`project-${field}`}
                    className="form-control"
                    type={field.endsWith('Url') ? 'url' : 'text'}
                    placeholder={['technologies', 'features', 'challenges', 'solutions'].includes(field) ? 'Separate items with commas' : ''}
                    value={form[field] || ''}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>
          <Button onClick={handleSave} loading={saving}>Save Project</Button>
        </div>
      </Modal>

      <Modal isOpen={modal.type === 'service'} onClose={closeModal} title={modal.item ? 'Edit Service' : 'Add Service'} size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {['title', 'icon'].map((field) => (
            <div key={field} className="form-group">
              <label className="form-label">{field}</label>
              <input className="form-control" value={form[field] || ''} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={3} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          {['features', 'technologies'].map((field) => (
            <div key={field} className="form-group">
              <label className="form-label">{field} (comma-separated)</label>
              <input className="form-control" value={form[field] || ''} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
            </div>
          ))}
          <Button onClick={handleSave} loading={saving}>Save Service</Button>
        </div>
      </Modal>

      <Modal isOpen={modal.type === 'testimonial'} onClose={closeModal} title={modal.item ? 'Edit Testimonial' : 'Add Testimonial'} size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {['clientName', 'clientRole', 'clientImage'].map((field) => (
            <div key={field} className="form-group">
              <label className="form-label">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input className="form-control" value={form[field] || ''} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Rating</label>
            <select className="form-control" value={form.rating || 5} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
              {[1, 2, 3, 4, 5].map((r) => <option key={r} value={r}>{r} stars</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Review</label>
            <textarea className="form-control" rows={4} value={form.review || ''} onChange={(e) => setForm({ ...form, review: e.target.value })} />
          </div>
          <Button onClick={handleSave} loading={saving}>Save Testimonial</Button>
        </div>
      </Modal>
    </>
  );
}
