"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      router.push('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-surface-container p-8 rounded-lg shadow-sm w-full max-w-sm border border-outline-variant">
        <h1 className="text-2xl font-semibold mb-6 text-on-surface">Admin CMS</h1>
        {error && <div className="bg-error-container text-on-error-container p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-outline mb-1">Username</label>
            <input 
              type="text" 
              className="w-full h-10 px-3 rounded bg-surface-container-low text-on-surface border border-outline-variant focus:border-primary focus:outline-none transition-colors"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-outline mb-1">Password</label>
            <input 
              type="password" 
              className="w-full h-10 px-3 rounded bg-surface-container-low text-on-surface border border-outline-variant focus:border-primary focus:outline-none transition-colors"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full h-10 mt-2 rounded bg-primary text-on-primary font-medium hover:bg-primary-fixed transition-colors">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
