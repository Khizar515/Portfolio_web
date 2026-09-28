"use client";
import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function MediaAdmin() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [copiedFile, setCopiedFile] = useState(null);
  const inputRef = useRef(null);

  const fetchData = async () => {
    try { const res = await api.get('/admin/media'); setFiles(res.data); }
    catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const showMsg = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text: '', type: '' }), 3000); };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post('/admin/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      showMsg(`✓ Uploaded: ${file.name}`, 'success');
      fetchData();
    } catch (err) {
      showMsg('Upload failed: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDelete = async (filename) => {
    if (!confirm(`Delete "${filename}"?`)) return;
    try { await api.delete(`/admin/media/${filename}`); fetchData(); showMsg('Deleted.'); }
    catch { showMsg('Error deleting.', 'error'); }
  };

  const handleCopyUrl = (filename) => {
    const url = `${API_BASE}/uploads/${filename}`;
    navigator.clipboard.writeText(url);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const isImage = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return IMAGE_EXTS.includes(ext);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-semibold">Media Assets</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-primary text-on-primary rounded text-sm font-medium hover:bg-[#4c95d8] transition-colors disabled:opacity-60"
          >
            {uploading ? 'Uploading...' : '↑ Upload File'}
          </button>
          <input ref={inputRef} type="file" accept="image/*,.pdf" onChange={handleUpload} className="hidden" />
        </div>
      </div>

      {msg.text && <div className={`p-3 rounded text-sm ${msg.type === 'error' ? 'bg-[#93000a] text-[#ffdad6]' : 'bg-[#004a79] text-[#d0e4ff]'}`}>{msg.text}</div>}

      <p className="text-xs text-[#8a919b] font-mono">{files.length} file{files.length !== 1 ? 's' : ''} — Accepts: images (jpg, png, webp) and PDFs. Max 10MB.</p>

      {loading ? <p className="text-[#8a919b]">Loading...</p> : files.length === 0 ? (
        <div className="border-2 border-dashed border-[#1d2b3d] rounded-lg p-12 text-center">
          <p className="text-[#8a919b] text-sm">No files uploaded yet.</p>
          <button onClick={() => inputRef.current?.click()} className="mt-3 text-primary text-sm hover:underline">Upload your first file →</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {files.map(file => (
            <div key={file.filename} className="group relative bg-[#0e1c2e] border border-[#1d2b3d] rounded overflow-hidden hover:border-[#414750] transition-colors">
              {/* Thumbnail or PDF icon */}
              <div className="aspect-square flex items-center justify-center bg-[#061426] relative overflow-hidden">
                {isImage(file.filename) ? (
                  <img
                    src={`${API_BASE}${file.url}`}
                    alt={file.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-[#8a919b]">
                    <span className="text-3xl">📄</span>
                    <span className="font-mono text-xs uppercase">.pdf</span>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#061426]/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  <button
                    onClick={() => handleCopyUrl(file.filename)}
                    className="w-full text-center text-xs py-1 rounded bg-[#1d2b3d] text-primary hover:bg-[#283549] transition-colors"
                  >
                    {copiedFile === file.filename ? '✓ Copied!' : 'Copy URL'}
                  </button>
                  <a
                    href={`${API_BASE}${file.url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-center text-xs py-1 rounded bg-[#1d2b3d] text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    Open ↗
                  </a>
                  <button
                    onClick={() => handleDelete(file.filename)}
                    className="w-full text-center text-xs py-1 rounded bg-[#93000a]/80 text-[#ffdad6] hover:bg-[#93000a] transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {/* Filename + size */}
              <div className="p-2 space-y-0.5">
                <p className="font-mono text-xs text-on-surface-variant truncate" title={file.filename}>{file.filename}</p>
                <p className="font-mono text-xs text-[#8a919b]">{formatBytes(file.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
