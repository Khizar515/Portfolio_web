"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  if (!mounted) return null;

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: 'dashboard' },
    { label: 'Profile', path: '/admin/profile', icon: 'person' },
    { label: 'Experience', path: '/admin/experience', icon: 'work' },
    { label: 'Projects', path: '/admin/projects', icon: 'code_blocks' },
    { label: 'Education', path: '/admin/education', icon: 'school' },
    { label: 'Certifications', path: '/admin/certifications', icon: 'verified' },
    { label: 'Skills', path: '/admin/skills', icon: 'terminal' },
    { label: 'Messages', path: '/admin/messages', icon: 'chat_bubble' },
    { label: 'Media', path: '/admin/media', icon: 'perm_media' },
  ];

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      {/* Sidebar */}
      <aside className="w-60 bg-surface-container-lowest border-r border-surface-container-high flex flex-col justify-between hidden md:flex">
        <div>
          <div className="h-14 px-6 flex items-center gap-2 border-b border-surface-container-high">
            <span className="font-semibold tracking-wide text-primary">Portfolio CMS</span>
          </div>
          <nav className="p-4 flex flex-col gap-1">
            <div className="text-xs font-mono uppercase text-outline mb-2 px-2">Modules</div>
            {navItems.map(item => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${pathname === item.path ? 'bg-surface-container-high text-primary font-medium' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-surface-container-high">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded text-sm w-full text-error hover:bg-surface-container transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-surface/90 border-b border-surface-container-high flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="text-sm font-mono text-outline">Root / Admin</div>
          <Link href="/" target="_blank" className="text-sm text-primary hover:underline">View Live Site ↗</Link>
        </header>
        <main className="p-6 md:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
