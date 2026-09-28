"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

function isVideo(path) {
  if (!path) return false;
  return /\.(mp4|webm|ogg|mov)$/i.test(path);
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.get(`/projects/${slug}`)
      .then(res => setProject(res.data))
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-outline">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-widest">Loading</span>
        </div>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-6">
        <p className="font-mono text-[#8a919b] text-sm">Project not found.</p>
        <Link href="/#projects" className="text-primary text-sm hover:underline">← Back to Portfolio</Link>
      </div>
    );
  }

  const tags = Array.isArray(project.Tech_Tags)
    ? project.Tech_Tags
    : (typeof project.Tech_Tags === 'string' ? JSON.parse(project.Tech_Tags || '[]') : []);

  const mediaPath = project.Image_Path;
  const mediaSrc = mediaPath ? `${API_BASE}/uploads/${mediaPath}` : null;

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#061426]/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link href="/" className="font-sans text-[14px] text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
            <span className="font-mono">←</span> Portfolio
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#8a919b]">Project</span>
        </div>
      </header>

      <main className="w-full pt-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24 space-y-12">

          {/* Hero */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              {tags.map((t, i) => (
                <span key={i} className="font-mono text-[11px] text-primary bg-[#0e1c2e] border border-[#1d2b3d] px-2.5 py-1 rounded">
                  {t}
                </span>
              ))}
              {project.Status === 'draft' && (
                <span className="font-mono text-[11px] text-[#8a919b] bg-[#1d2b3d] px-2.5 py-1 rounded">Draft</span>
              )}
            </div>

            <h1 className="font-sans text-[42px] leading-[50px] tracking-[-0.025em] font-[600] text-on-surface">
              {project.Title}
            </h1>

            {project.Summary && (
              <p className="font-sans text-[20px] leading-[30px] text-on-surface-variant">
                {project.Summary}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-5">
              {project.Repo_URL && (
                <a
                  href={project.Repo_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#006daa] hover:bg-[#4c95d8] text-on-surface rounded font-sans text-[13px] transition-colors"
                >
                  GitHub ↗
                </a>
              )}
              {project.Live_URL && (
                <a
                  href={project.Live_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-[#414750] hover:border-primary text-on-surface-variant hover:text-on-surface rounded font-sans text-[13px] transition-colors"
                >
                  Live Demo ↗
                </a>
              )}
            </div>
          </div>

          {/* Media */}
          {mediaSrc && (
            <div className="rounded-lg overflow-hidden border border-[#1d2b3d] bg-[#0e1c2e]">
              {isVideo(mediaPath) ? (
                <video
                  src={mediaSrc}
                  controls
                  className="w-full max-h-[600px] object-contain"
                />
              ) : (
                <img
                  src={mediaSrc}
                  alt={project.Title}
                  className="w-full object-cover max-h-[600px]"
                />
              )}
            </div>
          )}

          {/* Description */}
          {project.Description_HTML && (
            <div className="space-y-4">
              <div className="w-10 h-0.5 bg-[#414750]" />
              <div
                className="font-sans text-[16px] leading-[28px] text-on-surface-variant prose-custom space-y-4"
                dangerouslySetInnerHTML={{ __html: project.Description_HTML }}
              />
            </div>
          )}

          {/* Meta footer */}
          <div className="pt-8 border-t border-[#414750]/30 flex flex-wrap items-center justify-between gap-4 text-[#8a919b] font-mono text-[11px]">
            <span>
              Created {project.Created_At ? new Date(project.Created_At).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
            </span>
            <Link href="/#projects" className="text-primary hover:underline">
              ← All Projects
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
