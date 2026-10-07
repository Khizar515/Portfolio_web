"use client";
import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';

const API_BASE = '';

// Helper: download a file using axios (so JWT header is included)
// Returns null on success, or an error message string on failure
async function downloadWithAuth(endpoint, filename) {
  const api = (await import('@/lib/api')).default;
  const res = await api.get(endpoint, { responseType: 'blob' });

  // Check if the response is actually a JSON error (e.g. 404 with {message:"..."})
  const contentType = res.headers['content-type'] || '';
  if (contentType.includes('application/json')) {
    // Parse the blob as text to extract the error message
    const text = await res.data.text();
    try {
      const json = JSON.parse(text);
      throw new Error(json.message || 'Download failed');
    } catch {
      throw new Error(text || 'Download failed');
    }
  }

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

// Styled file upload button
function FileUploadField({ label, accept, onChange, currentFilename, currentPreview }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono uppercase tracking-wider text-[#8a919b]">{label}</label>
      {currentPreview && (
        <img src={currentPreview} alt="Current" className="w-16 h-16 rounded-full object-cover ring-1 ring-[#414750]" />
      )}
      {currentFilename && !currentPreview && (
        <p className="text-xs text-[#8a919b] font-mono">Current: {currentFilename}</p>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-4 py-2 text-sm bg-[#132033] border border-[#414750] hover:border-primary rounded transition-colors text-on-surface-variant hover:text-on-surface"
        >
          Choose {accept === '.pdf' ? 'PDF' : 'Image'} ↑
        </button>
        {fileName && <span className="text-xs text-primary font-mono truncate max-w-[180px]">{fileName}</span>}
        {!fileName && <span className="text-xs text-[#8a919b]">No file selected</span>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

export default function ProfileManagement() {
  const [profile, setProfile] = useState({
    Full_Name: '', Tagline: '', Headline: '', Bio_HTML: '', GitHub_URL: '', LinkedIn_URL: '', Email: '', Avatar_Path: '', Resume_Path: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwMessage, setPwMessage] = useState({ text: '', type: '' });
  const [changingPw, setChangingPw] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [unForm, setUnForm] = useState({ currentPassword: '', newUsername: '' });
  const [unMessage, setUnMessage] = useState({ text: '', type: '' });
  const [changingUn, setChangingUn] = useState(false);

  useEffect(() => {
    api.get('/profile').then(res => setProfile(res.data)).catch(console.error);
  }, []);

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      // Append all text fields
      ['Full_Name', 'Tagline', 'Headline', 'Bio_HTML', 'GitHub_URL', 'LinkedIn_URL', 'Email', 'Avatar_Path', 'Resume_Path'].forEach(k => {
        if (profile[k] != null) formData.append(k, profile[k]);
      });
      if (avatarFile) formData.append('avatar', avatarFile);
      if (resumeFile) formData.append('resume', resumeFile);

      await api.put('/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      // Re-fetch to get new paths
      const updated = await api.get('/profile');
      setProfile(updated.data);
      showMsg('Profile updated successfully.', 'success');
    } catch (err) {
      showMsg('Error updating profile: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleExportDB = async () => {
    setExporting(true);
    try {
      const res = await api.post('/admin/db/export');
      showMsg(`✓ Database exported: ${res.data.file}`, 'success');
    } catch (err) {
      showMsg('Error exporting: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadLastExport = async () => {
    try {
      await downloadWithAuth('/admin/db/last-export', 'portfolio_backup_latest.sql');
    } catch (err) {
      // axios wraps non-2xx responses — also handle blob-parsed errors from downloadWithAuth
      let msg = err.message || 'Download failed.';
      // If axios itself received a non-2xx and it's a blob, try to parse it
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          msg = json.message || msg;
        } catch { /* use original msg */ }
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      }
      if (msg === 'No backup found') msg = 'No backup found. Click "Export to .sql" first, then download.';
      showMsg(msg, 'error');
    }
  };

  const handleDownloadResume = async () => {
    if (!profile.Resume_Path) return showMsg('No resume uploaded yet.', 'error');
    // Uploaded resume is static — no auth needed
    const a = document.createElement('a');
    a.href = `${API_BASE}/uploads/${profile.Resume_Path}`;
    a.download = profile.Resume_Path;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleGenerateResume = async () => {
    try {
      await downloadWithAuth('/admin/resume/generate', 'Khizar_Nadeem_Resume.pdf');
    } catch (err) {
      showMsg('Error generating resume: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handlePwChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }
    setChangingPw(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      });
      setPwMessage({ text: '✓ Password changed successfully.', type: 'success' });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPwMessage({ text: '', type: '' }), 5000);
    } catch (err) {
      setPwMessage({ text: err.response?.data?.message || 'Error changing password.', type: 'error' });
    } finally {
      setChangingPw(false);
    }
  };

  const inputClass = "w-full p-2.5 bg-[#132033] rounded border border-[#1d2b3d] text-on-surface text-sm focus:border-primary focus:outline-none transition-colors";
  const labelClass = "block text-xs font-mono uppercase tracking-wider text-[#8a919b] mb-1";

  return (
    <div className="space-y-10 max-w-3xl">
      <h1 className="text-3xl font-semibold">Profile Management</h1>

      {message.text && (
        <div className={`p-3 rounded text-sm ${message.type === 'error' ? 'bg-[#93000a] text-[#ffdad6]' : 'bg-[#004a79] text-[#d0e4ff]'}`}>
          {message.text}
        </div>
      )}

      {/* ── PROFILE FORM ── */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input name="Full_Name" value={profile.Full_Name || ''} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input name="Email" type="email" value={profile.Email || ''} onChange={handleChange} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Headline</label>
            <input name="Headline" value={profile.Headline || ''} onChange={handleChange} className={inputClass} placeholder="Short hero headline..." />
          </div>
          <div>
            <label className={labelClass}>Tagline</label>
            <input name="Tagline" value={profile.Tagline || ''} onChange={handleChange} className={inputClass} placeholder="Full-Stack Developer | ..." />
          </div>
        </div>
        <div>
          <label className={labelClass}>Bio (HTML allowed)</label>
          <textarea name="Bio_HTML" value={profile.Bio_HTML || ''} onChange={handleChange} rows={5} className={inputClass} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>GitHub URL</label>
            <input name="GitHub_URL" value={profile.GitHub_URL || ''} onChange={handleChange} className={inputClass} placeholder="https://github.com/..." />
          </div>
          <div>
            <label className={labelClass}>LinkedIn URL</label>
            <input name="LinkedIn_URL" value={profile.LinkedIn_URL || ''} onChange={handleChange} className={inputClass} placeholder="https://linkedin.com/in/..." />
          </div>
        </div>

        {/* File Uploads — styled buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[#0e1c2e] border border-[#1d2b3d] rounded">
          <FileUploadField
            label="Avatar Image"
            accept="image/*"
            onChange={setAvatarFile}
            currentPreview={profile.Avatar_Path ? `${API_BASE}/uploads/${profile.Avatar_Path}` : null}
          />
          <FileUploadField
            label="Resume PDF"
            accept=".pdf"
            onChange={setResumeFile}
            currentFilename={profile.Resume_Path || null}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-primary text-on-primary rounded font-medium hover:bg-[#4c95d8] transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>

      <hr className="border-[#1d2b3d]" />

      {/* ── SYSTEM ACTIONS ── */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">System Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DB Management */}
          <div className="p-5 border border-[#1d2b3d] rounded bg-[#0e1c2e] space-y-4">
            <div>
              <h3 className="font-medium text-lg">Database Management</h3>
              <p className="text-sm text-on-surface-variant mt-1">
                Export current DB to <code className="text-primary">.sql</code>. The snapshot can serve as your next seed. Download last export anytime.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportDB}
                disabled={exporting}
                className="px-3 py-1.5 text-sm bg-[#132033] border border-[#414750] hover:border-primary rounded transition-colors disabled:opacity-60"
              >
                {exporting ? 'Exporting...' : 'Export to .sql'}
              </button>
              <button
                onClick={handleDownloadLastExport}
                className="px-3 py-1.5 text-sm bg-[#132033] border border-[#414750] hover:border-primary rounded transition-colors"
              >
                Download Last Export ↓
              </button>
            </div>
          </div>

          {/* Resume */}
          <div className="p-5 border border-[#1d2b3d] rounded bg-[#0e1c2e] space-y-4">
            <div>
              <h3 className="font-medium text-lg">Resume</h3>
              <p className="text-sm text-on-surface-variant mt-1">
                Download the uploaded resume PDF, or generate a fresh PDF from current DB content (experience, education, skills).
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleDownloadResume}
                className="px-3 py-1.5 text-sm bg-[#132033] border border-[#414750] hover:border-primary rounded transition-colors"
              >
                Download Uploaded Resume ↓
              </button>
              <button
                onClick={handleGenerateResume}
                className="px-3 py-1.5 text-sm bg-primary text-on-primary rounded hover:bg-[#4c95d8] transition-colors"
              >
                Generate from DB ↓
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-[#1d2b3d]" />

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Change Password</h2>
        {pwMessage.text && (
          <div className={`p-3 rounded text-sm ${pwMessage.type === 'error' ? 'bg-[#93000a] text-[#ffdad6]' : 'bg-[#004a79] text-[#d0e4ff]'}`}>
            {pwMessage.text}
          </div>
        )}
        <form onSubmit={handlePwChange} className="space-y-4 max-w-sm">
          <div>
            <label className={labelClass}>Current Password</label>
            <input type="password" required value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>New Password (min 6 chars)</label>
            <input type="password" required minLength={6} value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Confirm New Password</label>
            <input type="password" required value={pwForm.confirmPassword} onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))} className={inputClass} />
          </div>
          <button
            type="submit"
            disabled={changingPw}
            className="px-6 py-2.5 bg-[#93000a] text-[#ffdad6] rounded font-medium hover:bg-[#690005] transition-colors disabled:opacity-60"
          >
            {changingPw ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      <hr className="border-[#1d2b3d]" />

      {/* ── CHANGE USERNAME ── */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Change Username</h2>
        <p className="text-sm text-on-surface-variant">Update the admin login username. You must confirm your current password.</p>
        {unMessage.text && (
          <div className={`p-3 rounded text-sm ${unMessage.type === 'error' ? 'bg-[#93000a] text-[#ffdad6]' : 'bg-[#004a79] text-[#d0e4ff]'}`}>
            {unMessage.text}
          </div>
        )}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setChangingUn(true);
            try {
              const res = await api.put('/auth/change-username', unForm);
              setUnMessage({ text: `✓ ${res.data.message}. New username: ${res.data.username}`, type: 'success' });
              setUnForm({ currentPassword: '', newUsername: '' });
              setTimeout(() => setUnMessage({ text: '', type: '' }), 6000);
            } catch (err) {
              setUnMessage({ text: err.response?.data?.message || 'Error changing username.', type: 'error' });
            } finally {
              setChangingUn(false);
            }
          }}
          className="space-y-4 max-w-sm"
        >
          <div>
            <label className={labelClass}>Current Password</label>
            <input type="password" required value={unForm.currentPassword} onChange={e => setUnForm(p => ({ ...p, currentPassword: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>New Username (min 3 chars)</label>
            <input type="text" required minLength={3} value={unForm.newUsername} onChange={e => setUnForm(p => ({ ...p, newUsername: e.target.value }))} className={inputClass} placeholder="new_username" />
          </div>
          <button
            type="submit"
            disabled={changingUn}
            className="px-6 py-2.5 bg-[#1d2b3d] border border-[#414750] hover:border-primary text-on-surface rounded font-medium transition-colors disabled:opacity-60"
          >
            {changingUn ? 'Updating...' : 'Change Username'}
          </button>
        </form>
      </div>
    </div>
  );
}
