import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import SEO from '../components/SEO';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Notification from '../components/Notification';
import {
  getProjects, createProject, updateProject, deleteProject,
  getServices, createService, updateService, deleteService,
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
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
  const [metrics, setMetrics] = useState({ projects: 0, services: 0, testimonials: 0, inquiries: 0 });
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [contactFilter, setContactFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ type: null, item: null });
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'info', visible: false });

  const notify = (message, type = 'success') => setNotification({ message, type, visible: true });

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [p, s, t, c] = await Promise.all([
        getProjects(), getServices(), getTestimonials(), getContacts(),
      ]);
      const proj = p.data.data || [];
      const serv = s.data.data || [];
      const test = t.data.data || [];
      const cont = c.data.data || [];
      setProjects(proj);
      setServices(serv);
      setTestimonials(test);
      setContacts(cont);
      setMetrics({ projects: proj.length, services: serv.length, testimonials: test.length, inquiries: cont.length });
    } catch {
      notify('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const openModal = (type, item = null) => {
    const defaults = { project: emptyProject, service: emptyService, testimonial: emptyTestimonial };
    setForm(item ? { ...item } : { ...defaults[type] });
    setModal({ type, item });
  };

  const closeModal = () => { setModal({ type: null, item: null }); setForm({}); };

  const parseList = (val) => (typeof val === 'string' ? val.split(',').map((s) => s.trim()).filter(Boolean) : val);

  const handleSave = async () => {
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

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      if (type === 'project') await deleteProject(id);
      else if (type === 'service') await deleteService(id);
      else if (type === 'testimonial') await deleteTestimonial(id);
      else if (type === 'contact') await deleteContact(id);
      notify('Deleted successfully');
      loadAll();
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

  const filteredContacts = contactFilter === 'all'
    ? contacts
    : contacts.filter((c) => c.status === contactFilter);

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

      <div className="admin-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Dashboard</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Manage your portfolio content and inquiries</p>
        </div>
      </div>

      {notification.visible && (
        <div style={{ marginBottom: '1.5rem' }}>
          <Notification {...notification} onClose={() => setNotification((n) => ({ ...n, visible: false }))} />
        </div>
      )}

      <section id="admin-overview" className="admin-metrics">
        {[
          { label: 'Projects', value: metrics.projects },
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
      <section id="admin-projects" style={{ marginBottom: '3rem' }}>
        <div className="admin-header">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Projects</h2>
          <Button size="sm" icon={<Plus size={14} />} onClick={() => openModal('project')}>Add Project</Button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Category</th><th>Featured</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id}>
                  <td style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{p.title}</td>
                  <td><Badge variant="blue">{p.category}</Badge></td>
                  <td>{p.featured ? <Badge variant="success">Yes</Badge> : '—'}</td>
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

      {/* Services */}
      <section id="admin-services" style={{ marginBottom: '3rem' }}>
        <div className="admin-header">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Services</h2>
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
      <section id="admin-testimonials" style={{ marginBottom: '3rem' }}>
        <div className="admin-header">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Testimonials</h2>
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
      <section id="admin-inquiries">
        <div className="admin-header">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Inquiries</h2>
        </div>
        <div className="admin-filters">
          {['all', 'new', 'contacted', 'completed'].map((f) => (
            <button key={f} className={`admin-filter-btn ${contactFilter === f ? 'active' : ''}`} onClick={() => setContactFilter(f)}>
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
      </section>

      {/* Modals */}
      <Modal
        isOpen={modal.type === 'project'}
        onClose={closeModal}
        title={modal.item ? 'Edit Project' : 'Add Project'}
        size="lg"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {['title', 'shortDescription', 'image', 'githubUrl', 'liveUrl'].map((field) => (
            <div key={field} className="form-group">
              <label className="form-label">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input className="form-control" value={form[field] || ''} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={3} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-control" value={form.category || 'Full Stack'} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {['Web Development', 'Full Stack', 'Frontend', 'Backend', 'Business', 'SaaS'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Featured</label>
              <select className="form-control" value={form.featured ? 'true' : 'false'} onChange={(e) => setForm({ ...form, featured: e.target.value === 'true' })}>
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>
          {['technologies', 'features', 'challenges', 'solutions'].map((field) => (
            <div key={field} className="form-group">
              <label className="form-label">{field} (comma-separated)</label>
              <input className="form-control" value={form[field] || ''} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
            </div>
          ))}
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
