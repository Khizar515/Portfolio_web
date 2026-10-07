"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/api';

const EMPTY_FORM = {
  Title: '', Slug: '', Summary: '', Description_HTML: '', Repo_URL: '', Live_URL: '', Image_Path: '', Video_URL: '', Role: '', Tech_Tags: '', Is_Featured: false, Status: 'published'
};

function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [galleryUploading, setGalleryUploading] = useState(false);

  const API_BASE = '';

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects?admin=true');
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const showMsg = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'Title' && !editId) updated.Slug = toSlug(value);
      return updated;
    });
  };

  const handleEdit = async (p) => {
    const tags = Array.isArray(p.Tech_Tags) ? p.Tech_Tags : (typeof p.Tech_Tags === 'string' ? JSON.parse(p.Tech_Tags || '[]') : []);
    setForm({ ...p, Tech_Tags: tags.join(', '), Is_Featured: !!p.Is_Featured });
    setEditId(p.Project_ID);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const res = await api.get(`/projects/${p.Slug}/gallery`);
      setGallery(res.data || []);
    } catch { setGallery([]); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      Tech_Tags: form.Tech_Tags.split(',').map(t => t.trim()).filter(Boolean),
      Is_Featured: form.Is_Featured ? 1 : 0
    };
    try {
      if (editId) {
        await api.put(`/projects/${editId}`, payload);
        showMsg('Project updated.');
      } else {
        await api.post('/projects', payload);
        showMsg('Project created.');
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Error saving project.');
    } finally { setSaving(false); }
  };

  const handleToggleFeatured = async (p) => {
    try {
      const tags = Array.isArray(p.Tech_Tags) ? p.Tech_Tags : (typeof p.Tech_Tags === 'string' ? JSON.parse(p.Tech_Tags || '[]') : []);
      await api.put(`/projects/${p.Project_ID}`, { ...p, Tech_Tags: tags, Is_Featured: p.Is_Featured ? 0 : 1 });
      fetchProjects();
    } catch { showMsg('Error toggling featured.'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
      showMsg('Project deleted.');
    } catch { showMsg('Error deleting project.'); }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // If it's a video file, save to Video_URL, else Image_Path
      if (file.type.startsWith('video/')) {
        setForm(p => ({ ...p, Video_URL: res.data.filepath }));
      } else {
        setForm(p => ({ ...p, Image_Path: res.data.filepath }));
      }
      showMsg('Media uploaded.');
    } catch {
      showMsg('Upload failed.');
    } finally { setUploading(false); }
  };

  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !editId) return;
    setGalleryUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await api.post(`/projects/${editId}/gallery`, {
        Image_Path: res.data.filepath,
        Sort_Order: gallery.length
      });
      const gRes = await api.get(`/projects/${form.Slug}/gallery`);
      setGallery(gRes.data || []);
      showMsg('Gallery image added.');
    } catch {
      showMsg('Gallery upload failed.');
    } finally { setGalleryUploading(false); }
  };

  const handleDeleteGallery = async (galleryId) => {
    try {
      await api.delete(`/projects/gallery/${galleryId}`);
      setGallery(gallery.filter(g => g.Gallery_ID !== galleryId));
    } catch { showMsg('Failed to delete gallery image.'); }
  };

  const inputClass = "w-full p-2.5 bg-[#132033] rounded border border-[#1d2b3d] text-on-surface text-sm focus:border-primary focus:outline-none";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Projects Manager</h1>
        <button
          onClick={() => { setForm(EMPTY_FORM); setEditId(null); setShowForm(s => !s); }}
          className="px-4 py-2 bg-primary text-on-primary rounded text-sm font-medium hover:bg-[#4c95d8] transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {message && <div className="p-3 bg-[#004a79] text-[#d0e4ff] rounded text-sm">{message}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 p-5 bg-[#0e1c2e] border border-[#1d2b3d] rounded">
          <h2 className="text-lg font-medium">{editId ? 'Edit Project' : 'New Project'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#8a919b] mb-1">Title *</label>
              <input name="Title" value={form.Title} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[#8a919b] mb-1">Slug *</label>
              <input name="Slug" value={form.Slug} onChange={handleChange} required className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-[#8a919b] mb-1">Summary *</label>
            <input name="Summary" value={form.Summary} onChange={handleChange} required className={inputClass} maxLength={255} />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-[#8a919b] mb-1">Role (e.g. Lead Architect)</label>
            <input name="Role" value={form.Role || ''} onChange={handleChange} className={inputClass} maxLength={100} />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-[#8a919b] mb-1">Description (HTML)</label>
            <textarea name="Description_HTML" value={form.Description_HTML} onChange={handleChange} rows={4} className={inputClass} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#8a919b] mb-1">Repo URL</label>
              <input name="Repo_URL" value={form.Repo_URL} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[#8a919b] mb-1">Live URL</label>
              <input name="Live_URL" value={form.Live_URL} onChange={handleChange} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#8a919b] mb-1">Cover Media (Image or Video)</label>
              <div className="flex flex-col gap-2">
                {form.Image_Path && !form.Video_URL && (
                  <img src={`${API_BASE}/uploads/${form.Image_Path}`} alt="Preview" className="w-24 h-16 object-cover rounded border border-[#1d2b3d]" />
                )}
                {form.Video_URL && (
                  <video src={`${API_BASE}/uploads/${form.Video_URL}`} className="w-24 h-16 object-cover rounded border border-[#1d2b3d]" muted />
                )}
                <input type="file" accept="image/*,video/*" onChange={handleUpload} disabled={uploading} className="text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#1d2b3d] file:text-primary hover:file:bg-[#2a3c53] cursor-pointer" />
                {uploading && <span className="text-xs text-[#8a919b]">Uploading...</span>}
              </div>
            </div>
            <div>
               <label className="block text-xs font-mono uppercase text-[#8a919b] mb-1">Video URL (Upload above to set)</label>
               <input value={form.Video_URL || 'No video'} disabled className={`${inputClass} opacity-50`} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-[#8a919b] mb-1">Tech Tags (comma-separated)</label>
            <input name="Tech_Tags" value={form.Tech_Tags} onChange={handleChange} placeholder="React, Node.js, Docker" className={inputClass} />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <label className="block text-xs font-mono uppercase text-[#8a919b] mb-1">Status</label>
              <select name="Status" value={form.Status} onChange={handleChange} className={`${inputClass} w-auto`}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="Is_Featured"
                name="Is_Featured"
                checked={!!form.Is_Featured}
                onChange={handleChange}
                className="w-4 h-4 accent-primary"
              />
              <label htmlFor="Is_Featured" className="text-sm text-on-surface-variant cursor-pointer">
                Show on Public Portfolio (Featured)
              </label>
            </div>
          </div>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-primary text-on-primary rounded text-sm hover:bg-[#4c95d8] transition-colors disabled:opacity-60">
            {saving ? 'Saving...' : editId ? 'Update Project' : 'Create Project'}
          </button>
        </form>
      )}

      {showForm && editId && (
        <div className="p-5 bg-[#0e1c2e] border border-[#1d2b3d] rounded mt-6">
          <h2 className="text-lg font-medium mb-4">Project Gallery</h2>
          <div className="flex gap-4 items-center mb-4">
             <input type="file" accept="image/*" onChange={handleGalleryUpload} disabled={galleryUploading} className="text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#1d2b3d] file:text-primary hover:file:bg-[#2a3c53] cursor-pointer" />
             {galleryUploading && <span className="text-xs text-[#8a919b]">Uploading to gallery...</span>}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {gallery.map(g => (
                <div key={g.Gallery_ID} className="relative group">
                  <img src={`${API_BASE}/uploads/${g.Image_Path}`} alt="Gallery item" className="w-full h-24 object-cover rounded border border-[#1d2b3d]" />
                  <button onClick={() => handleDeleteGallery(g.Gallery_ID)} className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">&times;</button>
                </div>
             ))}
             {gallery.length === 0 && <p className="text-sm text-outline">No images in gallery.</p>}
          </div>
        </div>
      )}

      {/* Projects Table */}
      {loading ? (
        <p className="text-outline">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-outline text-sm">No projects yet. Add one above.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#1d2b3d] text-left">
                <th className="pb-3 font-mono text-xs uppercase tracking-wider text-[#8a919b]">Title</th>
                <th className="pb-3 font-mono text-xs uppercase tracking-wider text-[#8a919b] hidden md:table-cell">Tags</th>
                <th className="pb-3 font-mono text-xs uppercase tracking-wider text-[#8a919b]">Status</th>
                <th className="pb-3 font-mono text-xs uppercase tracking-wider text-[#8a919b]">Featured</th>
                <th className="pb-3 font-mono text-xs uppercase tracking-wider text-[#8a919b]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1d2b3d]">
              {projects.map(p => {
                const tags = Array.isArray(p.Tech_Tags) ? p.Tech_Tags : (typeof p.Tech_Tags === 'string' ? JSON.parse(p.Tech_Tags || '[]') : []);
                return (
                  <tr key={p.Project_ID} className="hover:bg-[#0e1c2e] transition-colors">
                    <td className="py-3 pr-4 text-on-surface font-medium">{p.Title}</td>
                    <td className="py-3 pr-4 text-[#8a919b] hidden md:table-cell text-xs">{tags.slice(0, 3).join(', ')}{tags.length > 3 ? '...' : ''}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-mono ${p.Status === 'published' ? 'bg-[#004a79] text-[#9bcbff]' : 'bg-[#283549] text-[#8a919b]'}`}>
                        {p.Status}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        title={p.Is_Featured ? 'Remove from portfolio' : 'Show on portfolio'}
                        className={`w-10 h-5 rounded-full transition-colors ${p.Is_Featured ? 'bg-primary' : 'bg-[#283549]'}`}
                      >
                        <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5 ${p.Is_Featured ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleEdit(p)} className="text-primary hover:underline text-xs">Edit</button>
                        <button onClick={() => handleDelete(p.Project_ID)} className="text-[#ffb4ab] hover:underline text-xs">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
