"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/api';

const EMPTY = { Degree: '', Institution: '', Start_Year: '', End_Year: '', CGPA: '', Description: '', Sort_Order: 0 };

export default function EducationAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try { const res = await api.get('/education'); setItems(res.data); }
    catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const showMsg = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 3000); };

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleEdit = (item) => {
    setForm({ ...item, CGPA: item.CGPA || '' });
    setEditId(item.Edu_ID);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, CGPA: form.CGPA || null, Sort_Order: parseInt(form.Sort_Order) || 0 };
    try {
      if (editId) { await api.put(`/education/${editId}`, payload); showMsg('Updated.'); }
      else { await api.post('/education', payload); showMsg('Created.'); }
      setForm(EMPTY); setEditId(null); setShowForm(false); fetchData();
    } catch (err) { showMsg(err.response?.data?.message || 'Error.', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this education entry?')) return;
    try { await api.delete(`/education/${id}`); fetchData(); showMsg('Deleted.'); }
    catch { showMsg('Error deleting.', 'error'); }
  };

  const ic = "w-full p-2.5 bg-[#132033] rounded border border-[#1d2b3d] text-on-surface text-sm focus:border-primary focus:outline-none";
  const lc = "block text-xs font-mono uppercase text-[#8a919b] mb-1";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Education</h1>
        <button onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(s => !s); }} className="px-4 py-2 bg-primary text-on-primary rounded text-sm font-medium hover:bg-[#4c95d8] transition-colors">
          {showForm ? 'Cancel' : '+ Add Education'}
        </button>
      </div>

      {msg.text && <div className={`p-3 rounded text-sm ${msg.type === 'error' ? 'bg-[#93000a] text-[#ffdad6]' : 'bg-[#004a79] text-[#d0e4ff]'}`}>{msg.text}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 p-5 bg-[#0e1c2e] border border-[#1d2b3d] rounded">
          <h2 className="text-lg font-medium">{editId ? 'Edit' : 'New'} Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={lc}>Degree *</label><input name="Degree" value={form.Degree} onChange={handleChange} required className={ic} placeholder="BS Computer Science" /></div>
            <div><label className={lc}>Institution *</label><input name="Institution" value={form.Institution} onChange={handleChange} required className={ic} /></div>
            <div><label className={lc}>Start Year</label><input type="number" name="Start_Year" value={form.Start_Year} onChange={handleChange} placeholder="2021" className={ic} /></div>
            <div><label className={lc}>End Year</label><input type="number" name="End_Year" value={form.End_Year} onChange={handleChange} placeholder="2025" className={ic} /></div>
            <div><label className={lc}>CGPA</label><input type="number" step="0.01" name="CGPA" value={form.CGPA} onChange={handleChange} placeholder="3.60" className={ic} /></div>
            <div><label className={lc}>Sort Order</label><input type="number" name="Sort_Order" value={form.Sort_Order} onChange={handleChange} className={ic} /></div>
          </div>
          <div><label className={lc}>Description</label><textarea name="Description" value={form.Description} onChange={handleChange} rows={3} className={ic} /></div>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-primary text-on-primary rounded text-sm hover:bg-[#4c95d8] transition-colors disabled:opacity-60">
            {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      {loading ? <p className="text-[#8a919b]">Loading...</p> : items.length === 0 ? <p className="text-[#8a919b] text-sm">No education entries yet.</p> : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.Edu_ID} className="p-4 bg-[#0e1c2e] border border-[#1d2b3d] rounded flex justify-between items-start gap-4">
              <div className="space-y-0.5 flex-1">
                <p className="font-medium text-on-surface">{item.Degree}</p>
                <p className="text-sm text-primary">{item.Institution} {item.CGPA && <span className="text-on-surface-variant">· CGPA: {item.CGPA}</span>}</p>
                <p className="font-mono text-xs text-[#8a919b]">{item.Start_Year} — {item.End_Year}</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button onClick={() => handleEdit(item)} className="text-primary hover:underline text-xs">Edit</button>
                <button onClick={() => handleDelete(item.Edu_ID)} className="text-[#ffb4ab] hover:underline text-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
