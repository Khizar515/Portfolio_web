"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function MessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read'

  const fetchData = async () => {
    try { const res = await api.get('/messages'); setMessages(res.data); }
    catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const showMsg = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 3000); };

  const handleToggleRead = async (m) => {
    try {
      await api.put(`/messages/${m.Message_ID}`, { Is_Read: m.Is_Read ? 0 : 1 });
      fetchData();
    } catch { showMsg('Error updating status.', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    try { await api.delete(`/messages/${id}`); fetchData(); showMsg('Deleted.'); }
    catch { showMsg('Error deleting.', 'error'); }
  };

  const filtered = messages.filter(m => {
    if (filter === 'unread') return !m.Is_Read;
    if (filter === 'read') return m.Is_Read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.Is_Read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold">Messages</h1>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-primary text-on-primary rounded-full font-mono text-xs">{unreadCount} unread</span>
          )}
        </div>
        {/* Filter tabs */}
        <div className="flex gap-2 font-mono text-xs">
          {['all', 'unread', 'read'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded capitalize transition-colors ${filter === f ? 'bg-[#1d2b3d] text-primary' : 'text-[#8a919b] hover:text-on-surface'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {msg.text && <div className={`p-3 rounded text-sm ${msg.type === 'error' ? 'bg-[#93000a] text-[#ffdad6]' : 'bg-[#004a79] text-[#d0e4ff]'}`}>{msg.text}</div>}

      {loading ? <p className="text-[#8a919b]">Loading...</p> : filtered.length === 0 ? (
        <p className="text-[#8a919b] text-sm">{filter === 'all' ? 'No messages yet.' : `No ${filter} messages.`}</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(m => (
            <div key={m.Message_ID} className={`border rounded transition-colors ${m.Is_Read ? 'border-[#1d2b3d] bg-[#061426]' : 'border-[#4c95d8]/40 bg-[#0e1c2e]'}`}>
              {/* Header row */}
              <div
                className="flex items-start justify-between gap-4 p-4 cursor-pointer"
                onClick={() => setExpanded(expanded === m.Message_ID ? null : m.Message_ID)}
              >
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {!m.Is_Read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                    <p className={`font-medium truncate ${m.Is_Read ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                      {m.Sender_Name}
                    </p>
                    <span className="text-[#8a919b] font-mono text-xs flex-shrink-0">&lt;{m.Sender_Email}&gt;</span>
                  </div>
                  <p className="text-sm text-on-surface-variant truncate">{m.Subject || '(no subject)'}</p>
                  <p className="font-mono text-xs text-[#8a919b]">{new Date(m.Created_At).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleRead(m); }}
                    className={`text-xs font-mono px-2 py-1 rounded transition-colors ${m.Is_Read ? 'text-[#8a919b] hover:text-primary' : 'text-primary hover:text-[#8a919b]'}`}
                  >
                    {m.Is_Read ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(m.Message_ID); }}
                    className="text-[#ffb4ab] hover:underline text-xs"
                  >
                    Delete
                  </button>
                  <span className={`font-mono text-xs text-[#8a919b] transition-transform ${expanded === m.Message_ID ? 'rotate-180' : ''}`}>▾</span>
                </div>
              </div>
              {/* Expanded body */}
              {expanded === m.Message_ID && (
                <div className="px-4 pb-4 border-t border-[#1d2b3d] pt-3">
                  <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">{m.Message_Body}</p>
                  <a href={`mailto:${m.Sender_Email}?subject=Re: ${encodeURIComponent(m.Subject || '')}`} className="inline-block mt-3 text-xs text-primary hover:underline font-mono">
                    Reply via Email →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
