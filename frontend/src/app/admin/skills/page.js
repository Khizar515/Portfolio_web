"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/api';

const PROFICIENCY_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];
const EMPTY = { Name: '', Category: '', Proficiency_Level: 'intermediate', Sort_Order: 0 };

export default function SkillsAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('All');
  const [selected, setSelected] = useState(new Set());

  const fetchData = async () => {
    try { const res = await api.get('/skills'); setItems(res.data); }
    catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const showMsg = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 3000); };
  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleEdit = (item) => {
    setForm({ ...item });
    setEditId(item.Skill_ID);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) { await api.put(`/skills/${editId}`, form); showMsg('Updated.'); }
      else { await api.post('/skills', form); showMsg('Created.'); }
      setForm(EMPTY); setEditId(null); setShowForm(false); fetchData();
    } catch (err) { showMsg(err.response?.data?.message || 'Error.', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return;
    try { await api.delete(`/skills/${id}`); fetchData(); showMsg('Deleted.'); }
    catch { showMsg('Error deleting.', 'error'); }
  };

  const handleBatchDelete = async () => {
    if (!confirm(`Delete ${selected.size} selected skills?`)) return;
    try {
      await Promise.all(Array.from(selected).map(id => api.delete(`/skills/${id}`)));
      setSelected(new Set());
      fetchData();
      showMsg('Selected skills deleted.');
    } catch { showMsg('Error deleting some skills.', 'error'); }
  };

  // Group by category
  const categories = ['All', ...Array.from(new Set(items.map(s => s.Category)))];
  const filtered = filterCat === 'All' ? items : items.filter(s => s.Category === filterCat);

  const ic = "w-full p-2.5 bg-[#132033] rounded border border-[#1d2b3d] text-on-surface text-sm focus:border-primary focus:outline-none";
  const lc = "block text-xs font-mono uppercase text-[#8a919b] mb-1";

  const profColor = { beginner: 'text-[#8a919b]', intermediate: 'text-on-surface-variant', advanced: 'text-primary', expert: 'text-[#9bcbff]' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Skills</h1>
        <div className="flex items-center gap-3">
          {selected.size > 0 && (
            <button onClick={handleBatchDelete} className="px-4 py-2 bg-[#93000a] text-[#ffdad6] rounded text-sm font-medium hover:bg-[#ba1a1a] transition-colors">
              Delete Selected ({selected.size})
            </button>
          )}
          <button onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(s => !s); }} className="px-4 py-2 bg-primary text-on-primary rounded text-sm font-medium hover:bg-[#4c95d8] transition-colors">
            {showForm ? 'Cancel' : '+ Add Skill'}
          </button>
        </div>
      </div>

      {msg.text && <div className={`p-3 rounded text-sm ${msg.type === 'error' ? 'bg-[#93000a] text-[#ffdad6]' : 'bg-[#004a79] text-[#d0e4ff]'}`}>{msg.text}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 p-5 bg-[#0e1c2e] border border-[#1d2b3d] rounded">
          <h2 className="text-lg font-medium">{editId ? 'Edit' : 'New'} Skill</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={lc}>Skill Name *</label><input name="Name" value={form.Name} onChange={handleChange} required className={ic} /></div>
            <div><label className={lc}>Category *</label><input name="Category" value={form.Category} onChange={handleChange} required className={ic} placeholder="Development, Cloud & DevOps..." /></div>
            <div>
              <label className={lc}>Proficiency Level</label>
              <select name="Proficiency_Level" value={form.Proficiency_Level} onChange={handleChange} className={ic}>
                {PROFICIENCY_LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
              </select>
            </div>
            <div><label className={lc}>Sort Order</label><input type="number" name="Sort_Order" value={form.Sort_Order} onChange={handleChange} className={ic} /></div>
          </div>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-primary text-on-primary rounded text-sm hover:bg-[#4c95d8] transition-colors disabled:opacity-60">
            {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      {/* Category filter tabs */}
      {!loading && items.length > 0 && (
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          {categories.map(c => (
            <button key={c} onClick={() => setFilterCat(c)} className={`px-3 py-1 rounded transition-colors ${filterCat === c ? 'bg-[#1d2b3d] text-primary' : 'text-[#8a919b] hover:text-on-surface'}`}>
              {c}
            </button>
          ))}
        </div>
      )}

      {loading ? <p className="text-[#8a919b]">Loading...</p> : items.length === 0 ? <p className="text-[#8a919b] text-sm">No skills yet.</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#1d2b3d] text-left">
                <th className="pb-3 w-8">
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={e => e.target.checked ? setSelected(new Set(filtered.map(s => s.Skill_ID))) : setSelected(new Set())} className="accent-primary" />
                </th>
                <th className="pb-3 font-mono text-xs uppercase text-[#8a919b]">Skill</th>
                <th className="pb-3 font-mono text-xs uppercase text-[#8a919b]">Category</th>
                <th className="pb-3 font-mono text-xs uppercase text-[#8a919b]">Level</th>
                <th className="pb-3 font-mono text-xs uppercase text-[#8a919b]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1d2b3d]">
              {filtered.map(item => (
                <tr key={item.Skill_ID} className="hover:bg-[#0e1c2e] transition-colors">
                  <td className="py-2.5 pr-4">
                    <input type="checkbox" checked={selected.has(item.Skill_ID)} onChange={e => { const newSet = new Set(selected); if (e.target.checked) newSet.add(item.Skill_ID); else newSet.delete(item.Skill_ID); setSelected(newSet); }} className="accent-primary" />
                  </td>
                  <td className="py-2.5 pr-4 font-medium text-on-surface">{item.Name}</td>
                  <td className="py-2.5 pr-4 text-on-surface-variant text-xs">{item.Category}</td>
                  <td className={`py-2.5 pr-4 font-mono text-xs capitalize ${profColor[item.Proficiency_Level] || ''}`}>{item.Proficiency_Level}</td>
                  <td className="py-2.5">
                    <div className="flex gap-3">
                      <button onClick={() => handleEdit(item)} className="text-primary hover:underline text-xs">Edit</button>
                      <button onClick={() => handleDelete(item.Skill_ID)} className="text-[#ffb4ab] hover:underline text-xs">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
