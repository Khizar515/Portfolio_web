"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/api';

const EMPTY = { Job_Title: '', Company: '', Location: '', Employment_Type: '', Start_Date: '', End_Date: '', Is_Current: false, Overview_HTML: '', Achievements_HTML: '', Tech_Tags: '', Attachment_Path: '', Sort_Order: 0 };

export default function ExperienceAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetch = async () => {
    try { const res = await api.get('/experience'); setItems(res.data); }
    catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const showMsg = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 3000); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
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
      setForm(p => ({ ...p, Attachment_Path: res.data.filepath }));
      showMsg('File uploaded successfully.');
    } catch {
      showMsg('Failed to upload file.', 'error');
    } finally { setUploading(false); }
  };

  const handleEdit = (item) => {
    const tags = Array.isArray(item.Tech_Tags) ? item.Tech_Tags : (typeof item.Tech_Tags === 'string' ? JSON.parse(item.Tech_Tags || '[]') : []);
    setForm({
      ...item,
      Tech_Tags: tags.join(', '),
      Start_Date: item.Start_Date ? item.Start_Date.split('T')[0] : '',
      End_Date: item.End_Date ? item.End_Date.split('T')[0] : '',
      Is_Current: !!item.Is_Current
    });
    setEditId(item.Exp_ID);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      Tech_Tags: form.Tech_Tags.split(',').map(t => t.trim()).filter(Boolean),
      Is_Current: form.Is_Current ? 1 : 0,
      End_Date: form.Is_Current ? null : form.End_Date || null
    };
    try {
      if (editId) { await api.put(`/experience/${editId}`, payload); showMsg('Updated.'); }
      else { await api.post('/experience', payload); showMsg('Created.'); }
      setForm(EMPTY); setEditId(null); setShowForm(false); fetch();
    } catch (err) { showMsg(err.response?.data?.message || 'Error.', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience entry?')) return;
    try { await api.delete(`/experience/${id}`); fetch(); showMsg('Deleted.'); }
    catch { showMsg('Error deleting.', 'error'); }
  };

  const ic = "w-full p-2.5 bg-[#132033] rounded border border-[#1d2b3d] text-on-surface text-sm focus:border-primary focus:outline-none";
  const lc = "block text-xs font-mono uppercase text-[#8a919b] mb-1";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Experience</h1>
        <button onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(s => !s); }} className="px-4 py-2 bg-primary text-on-primary rounded text-sm font-medium hover:bg-[#4c95d8] transition-colors">
          {showForm ? 'Cancel' : '+ Add Experience'}
        </button>
      </div>

      {msg.text && <div className={`p-3 rounded text-sm ${msg.type === 'error' ? 'bg-[#93000a] text-[#ffdad6]' : 'bg-[#004a79] text-[#d0e4ff]'}`}>{msg.text}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 p-5 bg-[#0e1c2e] border border-[#1d2b3d] rounded">
          <h2 className="text-lg font-medium">{editId ? 'Edit' : 'New'} Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={lc}>Job Title *</label><input name="Job_Title" value={form.Job_Title} onChange={handleChange} required className={ic} /></div>
            <div><label className={lc}>Company *</label><input name="Company" value={form.Company} onChange={handleChange} required className={ic} /></div>
            <div><label className={lc}>Location</label><input name="Location" value={form.Location || ''} onChange={handleChange} className={ic} placeholder="e.g. Remote, New York" /></div>
            <div>
              <label className={lc}>Employment Type</label>
              <select name="Employment_Type" value={form.Employment_Type || ''} onChange={handleChange} className={ic}>
                 <option value="">Select...</option>
                 <option value="Full-time">Full-time</option>
                 <option value="Part-time">Part-time</option>
                 <option value="Contract">Contract</option>
                 <option value="Freelance">Freelance</option>
                 <option value="Internship">Internship</option>
              </select>
            </div>
            <div><label className={lc}>Start Date *</label><input type="date" name="Start_Date" value={form.Start_Date} onChange={handleChange} required className={ic} /></div>
            <div>
              <label className={lc}>End Date</label>
              <input type="date" name="End_Date" value={form.End_Date} onChange={handleChange} disabled={form.Is_Current} className={`${ic} disabled:opacity-40`} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="Is_Current" name="Is_Current" checked={!!form.Is_Current} onChange={handleChange} className="w-4 h-4 accent-primary" />
            <label htmlFor="Is_Current" className="text-sm text-on-surface-variant cursor-pointer">Currently working here</label>
          </div>
          <div>
            <label className={lc}>Overview & Mandate (HTML allowed)</label>
            <textarea name="Overview_HTML" value={form.Overview_HTML || ''} onChange={handleChange} rows={3} className={ic} />
          </div>
          <div>
            <label className={lc}>Key Achievements (HTML allowed)</label>
            <textarea name="Achievements_HTML" value={form.Achievements_HTML} onChange={handleChange} rows={4} className={ic} />
          </div>
          <div>
            <label className={lc}>Tech Tags (comma-separated)</label>
            <input name="Tech_Tags" value={form.Tech_Tags} onChange={handleChange} placeholder="Docker, Linux, AWS" className={ic} />
          </div>
          <div>
            <label className={lc}>Attachment (Optional)</label>
            <div className="flex items-center gap-4">
              {form.Attachment_Path && <span className="text-sm text-primary">Uploaded</span>}
              <input type="file" onChange={handleUpload} disabled={uploading} className="text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#1d2b3d] file:text-primary hover:file:bg-[#2a3c53] cursor-pointer" />
              {uploading && <span className="text-xs text-[#8a919b]">Uploading...</span>}
            </div>
          </div>
          <div><label className={lc}>Sort Order</label><input type="number" name="Sort_Order" value={form.Sort_Order} onChange={handleChange} className={`${ic} w-24`} /></div>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-primary text-on-primary rounded text-sm hover:bg-[#4c95d8] transition-colors disabled:opacity-60">
            {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      {loading ? <p className="text-[#8a919b]">Loading...</p> : items.length === 0 ? <p className="text-[#8a919b] text-sm">No experience entries yet.</p> : (
        <div className="space-y-4">
          {items.map(item => {
            const tags = Array.isArray(item.Tech_Tags) ? item.Tech_Tags : (typeof item.Tech_Tags === 'string' ? JSON.parse(item.Tech_Tags || '[]') : []);
            const start = item.Start_Date ? new Date(item.Start_Date).getFullYear() : '';
            const end = item.Is_Current ? 'Present' : (item.End_Date ? new Date(item.End_Date).getFullYear() : '');
            return (
              <div key={item.Exp_ID} className="p-4 bg-[#0e1c2e] border border-[#1d2b3d] rounded flex justify-between items-start gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="font-medium text-on-surface">{item.Job_Title} <span className="text-primary">·</span> <span className="text-on-surface-variant">{item.Company}</span></p>
                  <p className="font-mono text-xs text-[#8a919b]">{start} — {end}</p>
                  {tags.length > 0 && <p className="font-mono text-xs text-[#8a919b]">{tags.join(' · ')}</p>}
                </div>
                <div className="flex gap-3 shrink-0">
                  <button onClick={() => handleEdit(item)} className="text-primary hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(item.Exp_ID)} className="text-[#ffb4ab] hover:underline text-xs">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
