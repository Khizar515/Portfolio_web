"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

const API_BASE = '';

function isVideo(path) {
  if (!path) return false;
  return /\.(mp4|webm|ogg|mov)$/i.test(path);
}

export default function ExperienceDetail() {
  const { id } = useParams();
  const [exp, setExp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/experience/${id}`)
      .then(res => setExp(res.data))
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

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

  if (notFound || !exp) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-6">
        <p className="font-mono text-[#8a919b] text-sm">Experience not found.</p>
        <Link href="/#experience" className="text-primary text-sm hover:underline">← Back to Portfolio</Link>
      </div>
    );
  }

  const tags = Array.isArray(exp.Tech_Tags)
    ? exp.Tech_Tags
    : (typeof exp.Tech_Tags === 'string' ? JSON.parse(exp.Tech_Tags || '[]') : []);

  const mediaPath = exp.Attachment_Path;
  const mediaSrc = mediaPath ? `${API_BASE}/uploads/${mediaPath}` : null;

  const startLabel = exp.Start_Date ? new Date(exp.Start_Date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '';
  const endLabel = exp.Is_Current
    ? 'Present'
    : (exp.End_Date ? new Date(exp.End_Date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '');

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#061426]/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link href="/" className="font-sans text-[14px] text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
            <span className="font-mono">←</span> Portfolio
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#8a919b]">Experience</span>
        </div>
      </header>

      <main className="w-full pt-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24 space-y-12">

          {/* Hero */}
          <div className="space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-widest text-primary">Work Experience</span>
            <h1 className="font-sans text-[42px] leading-[50px] tracking-[-0.025em] font-[600] text-on-surface">
              {exp.Job_Title}
            </h1>
            <p className="font-sans text-[22px] text-on-surface-variant">
              {exp.Company}
            </p>
            <p className="font-mono text-[13px] text-[#8a919b]">
              {startLabel} — {endLabel}
              {exp.Is_Current && <span className="ml-3 text-primary font-mono text-[11px] bg-[#0e1c2e] border border-primary/40 px-2 py-0.5 rounded">Current Role</span>}
            </p>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((t, i) => (
                <span key={i} className="font-mono text-[11px] text-primary bg-[#0e1c2e] border border-[#1d2b3d] px-2.5 py-1 rounded">
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Media */}
          {mediaSrc && (
            <div className="rounded-lg overflow-hidden border border-[#1d2b3d] bg-[#0e1c2e]">
              {isVideo(mediaPath) ? (
                <video src={mediaSrc} controls className="w-full max-h-[600px] object-contain" />
              ) : (
                <img src={mediaSrc} alt={`${exp.Job_Title} at ${exp.Company}`} className="w-full object-cover max-h-[600px]" />
              )}
            </div>
          )}

          {/* Achievements */}
          {exp.Achievements_HTML && (
            <div className="space-y-4">
              <div className="w-10 h-0.5 bg-[#414750]" />
              <div
                className="font-sans text-[16px] leading-[28px] text-on-surface-variant space-y-4"
                dangerouslySetInnerHTML={{ __html: exp.Achievements_HTML }}
              />
            </div>
          )}

          {/* Footer */}
          <div className="pt-8 border-t border-[#414750]/30 flex flex-wrap items-center justify-between gap-4 text-[#8a919b] font-mono text-[11px]">
            <span>{exp.Company}</span>
            <Link href="/#experience" className="text-primary hover:underline">
              ← All Experience
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
