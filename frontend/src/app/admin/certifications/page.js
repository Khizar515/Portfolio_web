"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/api';

const EMPTY_FORM = { Name: '', Issuer: '', Date_Issued: '', Credential_URL: '', Attachment_Path: '', Sort_Order: 0 };

export default function CertificationsAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    try { const res = await api.get('/certifications'); setItems(res.data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);
  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

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
      showMsg('Failed to upload file.');
    } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await api.put(`/certifications/${editId}`, form); showMsg('Updated.'); }
      else { await api.post('/certifications', form); showMsg('Created.'); }
      setForm(EMPTY_FORM); setEditId(null); setShowForm(false); fetchData();
    } catch { showMsg('Error saving.'); }
  };

  const handleEdit = (item) => {
    setForm({ ...item, Date_Issued: item.Date_Issued ? item.Date_Issued.split('T')[0] : '' });
    setEditId(item.Cert_ID); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this certification?')) return;
    try { await api.delete(`/certifications/${id}`); fetchData(); showMsg('Deleted.'); }
    catch { showMsg('Error deleting.'); }
  };

  const inputClass = "w-full p-2.5 bg-[#132033] rounded border border-[#1d2b3d] text-on-surface text-sm focus:border-primary focus:outline-none";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Certifications</h1>
        <button onClick={() => { setForm(EMPTY_FORM); setEditId(null); setShowForm(s => !s); }} className="px-4 py-2 bg-primary text-on-primary rounded text-sm font-medium hover:bg-[#4c95d8] transition-colors">
          {showForm ? 'Cancel' : '+ New Certification'}
        </button>
      </div>

      {msg && <div className="p-3 bg-[#004a79] text-[#d0e4ff] rounded text-sm">{msg}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 p-5 bg-[#0e1c2e] border border-[#1d2b3d] rounded">
          <h2 className="text-lg font-medium">{editId ? 'Edit' : 'New'} Certification</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-xs font-mono uppercase text-[#8a919b] mb-1">Name *</label><input name="Name" value={form.Name} onChange={handleChange} required className={inputClass} /></div>
            <div><label className="block text-xs font-mono uppercase text-[#8a919b] mb-1">Issuer *</label><input name="Issuer" value={form.Issuer} onChange={handleChange} required className={inputClass} /></div>
            <div><label className="block text-xs font-mono uppercase text-[#8a919b] mb-1">Date Issued</label><input type="date" name="Date_Issued" value={form.Date_Issued} onChange={handleChange} className={inputClass} /></div>
            <div><label className="block text-xs font-mono uppercase text-[#8a919b] mb-1">Credential URL</label><input name="Credential_URL" value={form.Credential_URL} onChange={handleChange} className={inputClass} /></div>
            <div><label className="block text-xs font-mono uppercase text-[#8a919b] mb-1">Sort Order</label><input type="number" name="Sort_Order" value={form.Sort_Order} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-[#8a919b] mb-1">Attachment (Optional)</label>
            <div className="flex items-center gap-4">
              {form.Attachment_Path && <span className="text-sm text-primary">Uploaded</span>}
              <input type="file" onChange={handleUpload} disabled={uploading} className="text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#1d2b3d] file:text-primary hover:file:bg-[#2a3c53] cursor-pointer" />
              {uploading && <span className="text-xs text-[#8a919b]">Uploading...</span>}
            </div>
          </div>
          <button type="submit" className="px-6 py-2 bg-primary text-on-primary rounded text-sm">{editId ? 'Update' : 'Create'}</button>
        </form>
      )}

      {loading ? <p className="text-outline">Loading...</p> : items.length === 0 ? <p className="text-outline text-sm">No certifications yet.</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="border-b border-[#1d2b3d] text-left">
              <th className="pb-3 font-mono text-xs uppercase text-[#8a919b]">Name</th>
              <th className="pb-3 font-mono text-xs uppercase text-[#8a919b]">Issuer</th>
              <th className="pb-3 font-mono text-xs uppercase text-[#8a919b]">Year</th>
              <th className="pb-3 font-mono text-xs uppercase text-[#8a919b]">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-[#1d2b3d]">
              {items.map(item => (
                <tr key={item.Cert_ID} className="hover:bg-[#0e1c2e] transition-colors">
                  <td className="py-3 pr-4 text-on-surface font-medium">{item.Name}</td>
                  <td className="py-3 pr-4 text-on-surface-variant">{item.Issuer}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-[#8a919b]">{item.Date_Issued ? new Date(item.Date_Issued).getFullYear() : '—'}</td>
                  <td className="py-3"><div className="flex gap-3"><button onClick={() => handleEdit(item)} className="text-primary hover:underline text-xs">Edit</button><button onClick={() => handleDelete(item.Cert_ID)} className="text-[#ffb4ab] hover:underline text-xs">Delete</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
