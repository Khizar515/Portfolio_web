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

export default function CertificationDetail() {
  const { id } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/certifications/${id}`)
      .then(res => setCert(res.data))
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

  if (notFound || !cert) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-6">
        <p className="font-mono text-[#8a919b] text-sm">Certification not found.</p>
        <Link href="/#certifications" className="text-primary text-sm hover:underline">← Back to Portfolio</Link>
      </div>
    );
  }

  const mediaPath = cert.Attachment_Path;
  const mediaSrc = mediaPath ? `${API_BASE}/uploads/${mediaPath}` : null;
  const issuedYear = cert.Date_Issued ? new Date(cert.Date_Issued).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : null;

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#061426]/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link href="/" className="font-sans text-[14px] text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
            <span className="font-mono">←</span> Portfolio
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#8a919b]">Certification</span>
        </div>
      </header>

      <main className="w-full pt-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24 space-y-12">

          {/* Hero */}
          <div className="space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-widest text-primary">Certification</span>
            <h1 className="font-sans text-[42px] leading-[50px] tracking-[-0.025em] font-[600] text-on-surface">
              {cert.Name}
            </h1>
            <p className="font-sans text-[22px] text-on-surface-variant">{cert.Issuer}</p>
            {issuedYear && (
              <p className="font-mono text-[13px] text-[#8a919b]">Issued: {issuedYear}</p>
            )}
          </div>

          {/* View Credential */}
          {cert.Credential_URL && (
            <a
              href={cert.Credential_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#006daa] hover:bg-[#4c95d8] text-on-surface rounded font-sans text-[14px] transition-colors"
            >
              View Credential ↗
            </a>
          )}

          {/* Media (certificate image/video) */}
          {mediaSrc && (
            <div className="rounded-lg overflow-hidden border border-[#1d2b3d] bg-[#0e1c2e]">
              {isVideo(mediaPath) ? (
                <video src={mediaSrc} controls className="w-full max-h-[600px] object-contain" />
              ) : (
                <img
                  src={mediaSrc}
                  alt={cert.Name}
                  className="w-full object-contain max-h-[700px]"
                />
              )}
            </div>
          )}

          {/* If no media and credential URL, show a decorative card */}
          {!mediaSrc && (
            <div className="p-8 bg-[#0e1c2e] border border-[#1d2b3d] rounded-lg flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#132033] border border-primary/30 flex items-center justify-center">
                <span className="font-mono text-primary text-2xl">✓</span>
              </div>
              <div>
                <p className="font-sans text-[18px] text-on-surface font-[500]">{cert.Name}</p>
                <p className="font-mono text-[12px] text-[#8a919b] mt-1">{cert.Issuer} {issuedYear ? `· ${issuedYear}` : ''}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-8 border-t border-[#414750]/30 flex flex-wrap items-center justify-between gap-4 text-[#8a919b] font-mono text-[11px]">
            <span>{cert.Issuer}</span>
            <Link href="/#certifications" className="text-primary hover:underline">
              ← All Certifications
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
