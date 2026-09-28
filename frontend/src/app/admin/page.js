"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

function StatCard({ label, value, sub, href, accent }) {
  const card = (
    <div className={`p-5 rounded border transition-colors ${accent ? 'border-primary/40 bg-[#0e1c2e]' : 'border-[#1d2b3d] bg-[#0e1c2e] hover:border-[#414750]'}`}>
      <div className="font-mono text-xs uppercase tracking-wider text-[#8a919b] mb-2">{label}</div>
      <div className={`text-3xl font-semibold ${accent ? 'text-primary' : 'text-on-surface'}`}>{value ?? '—'}</div>
      {sub && <div className="text-xs text-[#8a919b] mt-1 font-mono">{sub}</div>}
    </div>
  );
  return href ? <Link href={href}>{card}</Link> : card;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, projRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/projects?admin=true').catch(() => ({ data: [] }))
        ]);
        setStats(statsRes.data);
        setRecentProjects(Array.isArray(projRes.data) ? projRes.data.slice(0, 5) : []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="text-[#8a919b] text-sm">Loading stats...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Projects"
          value={stats?.projects}
          sub={`${stats?.projectsPublished ?? 0} published · ${stats?.projectsFeatured ?? 0} featured`}
          href="/admin/projects"
        />
        <StatCard label="Experience" value={stats?.experience} sub="Roles" href="/admin/experience" />
        <StatCard label="Education" value={stats?.education} sub="Degrees / Programs" href="/admin/education" />
        <StatCard label="Skills" value={stats?.skills} href="/admin/skills" />
        <StatCard
          label="Inquiries"
          value={stats?.inquiries}
          sub={`${stats?.unreadInquiries ?? 0} unread`}
          href="/admin/messages"
          accent={stats?.unreadInquiries > 0}
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Recent Projects</h2>
            <Link href="/admin/projects" className="text-xs text-primary hover:underline font-mono">View all →</Link>
          </div>
          {recentProjects.length === 0 ? (
            <p className="text-sm text-[#8a919b]">No projects yet.</p>
          ) : (
            <div className="space-y-2">
              {recentProjects.map(p => (
                <div key={p.Project_ID} className="flex items-center justify-between p-3 bg-[#0e1c2e] border border-[#1d2b3d] rounded">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{p.Title}</p>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs ${p.Status === 'published' ? 'text-primary' : 'text-[#8a919b]'}`}>{p.Status}</span>
                      {p.Is_Featured ? <span className="font-mono text-xs text-[#9bcbff]">· featured</span> : null}
                    </div>
                  </div>
                  <Link href="/admin/projects" className="text-xs text-primary hover:underline ml-3 shrink-0">Edit</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Add Project', href: '/admin/projects' },
              { label: 'Add Experience', href: '/admin/experience' },
              { label: 'Add Skill', href: '/admin/skills' },
              { label: 'View Messages', href: '/admin/messages', badge: stats?.unreadInquiries },
              { label: 'Upload Media', href: '/admin/media' },
              { label: 'Edit Profile', href: '/admin/profile' },
            ].map(({ label, href, badge }) => (
              <Link
                key={href}
                href={href}
                className="relative p-3 bg-[#0e1c2e] border border-[#1d2b3d] rounded text-sm text-on-surface-variant hover:text-on-surface hover:border-[#414750] transition-colors"
              >
                {label}
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-on-primary font-mono text-xs flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Site status */}
      <div className="p-4 border border-[#1d2b3d] rounded bg-[#0e1c2e] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-on-surface-variant">All services running</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#8a919b]">
          <Link href="/" target="_blank" className="text-primary hover:underline">View Public Site ↗</Link>
        </div>
      </div>
    </div>
  );
}
