"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'About', id: 'about' },
  { label: 'Experience', id: 'experience' },
  { label: 'Projects', id: 'projects' },
  { label: 'Education', id: 'education' },
  { label: 'Certifications', id: 'certifications' },
  { label: 'Skills', id: 'skills' },
  { label: 'Contact', id: 'contact' },
];

const API_BASE = '';

function SectionTitle({ children }) {
  return (
    <h2 className="font-sans text-[36px] leading-[44px] tracking-[-0.02em] font-[500] text-on-surface">{children}</h2>
  );
}

/** Returns a human-readable duration string between two dates */
function getDuration(startRaw, endRaw, isCurrent) {
  if (!startRaw) return '';
  const start = new Date(startRaw);
  const end = isCurrent ? new Date() : (endRaw ? new Date(endRaw) : null);
  if (!end || isNaN(start) || isNaN(end)) return '';
  const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
  if (totalDays < 1) return '';
  if (totalDays < 30) return `${totalDays}d`;
  const totalMonths = Math.round(totalDays / 30.44);
  if (totalMonths < 12) return `${totalMonths} mo`;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return months > 0 ? `${years} yr ${months} mo` : `${years} yr`;
}

/** Formats a date value to "Month YYYY" */
function fmtMonthYear(dateRaw) {
  if (!dateRaw) return '';
  const d = new Date(dateRaw);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

export default function Home() {
  const [profile, setProfile] = useState({});
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('about');
  const [activeFilter, setActiveFilter] = useState('all');
  const [formState, setFormState] = useState({ Sender_Name: '', Sender_Email: '', Subject: '', Message_Body: '' });
  const [formStatus, setFormStatus] = useState(null); // 'success' | 'error' | null

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profRes, projRes, expRes, eduRes, certRes, skillRes] = await Promise.all([
          api.get('/profile').catch(() => ({ data: {} })),
          api.get('/projects').catch(() => ({ data: [] })),
          api.get('/experience').catch(() => ({ data: [] })),
          api.get('/education').catch(() => ({ data: [] })),
          api.get('/certifications').catch(() => ({ data: [] })),
          api.get('/skills').catch(() => ({ data: [] })),
        ]);
        setProfile(profRes.data);
        setProjects(Array.isArray(projRes.data) ? projRes.data : []);
        setExperience(Array.isArray(expRes.data) ? expRes.data : []);
        setEducation(Array.isArray(eduRes.data) ? eduRes.data : []);
        setCertifications(Array.isArray(certRes.data) ? certRes.data : []);
        setSkills(Array.isArray(skillRes.data) ? skillRes.data : []);
      } catch (err) {
        console.error('Fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Intersection Observer for active nav
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [loading]);

  const handleFormChange = (e) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/messages', formState);
      setFormStatus('success');
      setFormState({ Sender_Name: '', Sender_Email: '', Subject: '', Message_Body: '' });
    } catch {
      setFormStatus('error');
    }
  };

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.Category]) acc[skill.Category] = [];
    acc[skill.Category].push(skill.Name);
    return acc;
  }, {});

  // Show ALL published projects in public view (not just featured)
  const allPublishedProjects = projects;
  const featuredProjects = projects.filter(p => p.Is_Featured);
  const baseProjects = featuredProjects.length > 0 ? featuredProjects : allPublishedProjects;
  const filteredProjects = activeFilter === 'all'
    ? baseProjects
    : baseProjects.filter(p => {
      const tags = Array.isArray(p.Tech_Tags) ? p.Tech_Tags : (typeof p.Tech_Tags === 'string' ? JSON.parse(p.Tech_Tags || '[]') : []);
      return tags.some(t => t.toLowerCase().includes(activeFilter.toLowerCase()));
    });

  // Helper
  function isVideo(path) {
    if (!path) return false;
    return /\.(mp4|webm|ogg|mov)$/i.test(path);
  }

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

  const avatarSrc = profile.Avatar_Path
    ? `${API_BASE}/uploads/${profile.Avatar_Path}`
    : null;

  const resumeHref = profile.Resume_Path
    ? `${API_BASE}/uploads/${profile.Resume_Path}`
    : '#';

  // Extract first part of tagline for the big heading
  const rawTagline = profile.Tagline || 'Full-Stack & Mobile Developer';
  // Split by |, -, or , to get the first part
  const taglineParts = rawTagline.split('|');
  const heroHeading = taglineParts[0].trim();
  const heroSubheading = rawTagline;


  return (
    <>
      {/* STICKY HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#061426]/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <a href="#about" className="font-sans text-[20px] leading-[28px] tracking-[-0.01em] font-[500] text-on-surface hover:text-primary transition-colors">
            {profile.Full_Name || 'Khizar Nadeem'}
          </a>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-5" aria-label="Primary navigation">
            {NAV_ITEMS.map(({ label, id }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`text-[13px] leading-[18px] transition-colors ${activeNav === id ? 'text-primary font-[500]' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <a
              href={resumeHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center h-8 px-3 rounded font-mono text-[11px] uppercase tracking-wider text-primary border border-[#414750] hover:border-primary hover:bg-[#132033] transition-all"
            >
              Resume
            </a>
            {avatarSrc ? (
              <img src={avatarSrc} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-xs text-primary font-medium">
                {profile.Full_Name?.[0] || 'K'}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* PAGE BODY */}
      <main className="w-full pt-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24 space-y-28 sm:space-y-36">

          {/* ── HERO ─────────────────────────────────────────── */}
          <header className="space-y-8 pt-4">
            <div className="flex items-center gap-5">
              {avatarSrc ? (
                <img src={avatarSrc} alt={profile.Full_Name} className="w-20 h-20 rounded-full object-cover ring-1 ring-[#414750]/50 shadow-md" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#132033] flex items-center justify-center text-2xl text-primary font-semibold ring-1 ring-[#414750]/50">
                  {profile.Full_Name?.[0] || 'K'}
                </div>
              )}
              <div className="space-y-1">
                <span className="font-mono text-[11px] uppercase tracking-widest text-primary">Portfolio</span>
                <h1 className="font-sans text-[24px] leading-[32px] tracking-[-0.015em] font-[500] text-on-surface">
                  {profile.Full_Name || 'Khizar Nadeem'}
                </h1>
              </div>
            </div>

            <div className="space-y-4">
              <p className="font-sans text-[48px] leading-[56px] tracking-[-0.03em] font-[600] text-on-surface">
                {heroHeading}
              </p>
              {heroSubheading && (
                <p className="font-sans text-[20px] leading-[28px] text-on-surface-variant font-normal">
                  {heroSubheading}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <a href="#projects" className="text-primary hover:text-[#96cbff] flex items-center gap-1.5 transition-colors text-[14px]">
                View Projects <span className="font-mono">→</span>
              </a>
              <a href="#contact" className="text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 transition-colors text-[14px]">
                Get in Touch <span className="font-mono">→</span>
              </a>
            </div>

            <div className="flex items-center gap-6 pt-4 text-on-surface-variant font-mono text-[11px]">
              {profile.GitHub_URL && (
                <>
                  <a href={profile.GitHub_URL} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">GitHub</a>
                  <span className="text-[#414750]">•</span>
                </>
              )}
              {profile.LinkedIn_URL && (
                <>
                  <a href={profile.LinkedIn_URL.startsWith('http') ? profile.LinkedIn_URL : `https://${profile.LinkedIn_URL}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
                  <span className="text-[#414750]">•</span>
                </>
              )}
              {profile.Email && (
                <a href={`mailto:${profile.Email}`} className="hover:text-primary transition-colors">{profile.Email}</a>
              )}
            </div>
          </header>

          {/* ── ABOUT ─────────────────────────────────────────── */}
          <section id="about" className="space-y-8 scroll-mt-24">
            <SectionTitle>About</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-4 space-y-2 text-[#8a919b] font-mono text-[11px] tracking-wider uppercase">
                <p>Perspective &amp; Focus</p>
                <div className="w-10 h-0.5 bg-[#414750]" />
              </div>
              <div
                className="md:col-span-8 space-y-5 font-sans text-[16px] leading-[26px] text-on-surface-variant"
                dangerouslySetInnerHTML={{ __html: profile.Bio_HTML || '<p>Loading bio...</p>' }}
              />
            </div>
          </section>

          {/* ── EXPERIENCE ─────────────────────────────────────── */}
          <section id="experience" className="space-y-10 scroll-mt-24">
            <SectionTitle>Experience</SectionTitle>
            {experience.length === 0 ? (
              <p className="text-outline text-sm">No experience entries yet.</p>
            ) : (
              <div className="space-y-12 pl-4 border-l border-[#414750]/40">
                {experience.map((exp, i) => {
                  const tags = Array.isArray(exp.Tech_Tags) ? exp.Tech_Tags : (typeof exp.Tech_Tags === 'string' ? JSON.parse(exp.Tech_Tags || '[]') : []);
                  const endLabel = exp.Is_Current ? 'Present' : fmtMonthYear(exp.End_Date);
                  const startLabel = fmtMonthYear(exp.Start_Date);
                  const duration = getDuration(exp.Start_Date, exp.End_Date, exp.Is_Current);
                  const thumbSrc = exp.Attachment_Path ? `${API_BASE}/uploads/${exp.Attachment_Path}` : null;
                  return (
                    <article key={exp.Exp_ID} className="relative space-y-3 pl-6 group">
                      <div className={`absolute -left-[21px] top-1.5 w-2 h-2 rounded-full ring-4 ring-[#061426] ${i === 0 ? 'bg-primary' : 'bg-[#8a919b]'}`} />
                      <Link href={`/experience/${exp.Exp_ID}`} className="block hover:opacity-90 transition-opacity">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {thumbSrc && (
                            <div className="shrink-0 w-full sm:w-24 h-16 rounded overflow-hidden bg-[#132033] border border-[#1d2b3d]">
                              {isVideo(exp.Attachment_Path) ? (
                                <video src={thumbSrc} className="w-full h-full object-cover" muted />
                              ) : (
                                <img src={thumbSrc} alt={exp.Company} className="w-full h-full object-cover" />
                              )}
                            </div>
                          )}
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                              <h3 className="font-sans text-[20px] leading-[28px] tracking-[-0.01em] font-[500] text-on-surface group-hover:text-primary transition-colors">
                                {exp.Job_Title} <span className="text-primary font-normal">·</span>{' '}
                                <span className="text-on-surface-variant font-normal">{exp.Company}</span>
                              </h3>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] text-[#8a919b]">{startLabel} — {endLabel}</span>
                                {duration && <span className="font-mono text-[10px] text-primary bg-[#0e1c2e] border border-primary/30 px-1.5 py-0.5 rounded">{duration}</span>}
                              </div>
                            </div>
                            <div
                              className="font-sans text-[14px] leading-[22px] text-on-surface-variant line-clamp-3"
                              dangerouslySetInnerHTML={{ __html: exp.Achievements_HTML || '' }}
                            />
                            {tags.length > 0 && (
                              <p className="font-mono text-[11px] text-[#8a919b] pt-1">
                                {tags.map((t, ti) => (
                                  <span key={ti}>{t}{ti < tags.length - 1 && <span className="text-[#414750] mx-1">·</span>}</span>
                                ))}
                              </p>
                            )}
                            <span className="font-mono text-[11px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">View details →</span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── PROJECTS ──────────────────────────────────────── */}
          <section id="projects" className="space-y-10 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
              <SectionTitle>Selected Projects</SectionTitle>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[#8a919b]">
                {['all', 'Flutter', 'Web', 'DevOps', 'Cloud'].map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f.toLowerCase())}
                    className={`px-2.5 py-1 rounded transition-colors capitalize ${activeFilter === f.toLowerCase() ? 'text-primary bg-[#1d2b3d]' : 'hover:text-on-surface'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {baseProjects.length === 0 ? (
              <p className="text-outline text-sm">No featured projects yet. Mark projects as featured in the Admin CMS.</p>
            ) : filteredProjects.length === 0 ? (
              <p className="text-outline text-sm">No projects match this filter.</p>
            ) : (
              <div className="space-y-6">
                {filteredProjects.map(p => {
                  const tags = Array.isArray(p.Tech_Tags) ? p.Tech_Tags : (typeof p.Tech_Tags === 'string' ? JSON.parse(p.Tech_Tags || '[]') : []);
                  const thumbSrc = p.Image_Path ? `${API_BASE}/uploads/${p.Image_Path}` : null;
                  return (
                    <article key={p.Project_ID} className="group">
                      <Link href={`/projects/${p.Slug}`} className="block">
                        <div className="flex flex-col sm:flex-row gap-5 p-4 -mx-4 rounded-lg hover:bg-[#0e1c2e] transition-colors border border-transparent hover:border-[#1d2b3d] cursor-pointer">
                          {thumbSrc && (
                            <div className="shrink-0 w-full sm:w-32 h-20 rounded overflow-hidden bg-[#132033] border border-[#1d2b3d]">
                              {isVideo(p.Image_Path) ? (
                                <video src={thumbSrc} className="w-full h-full object-cover" muted />
                              ) : (
                                <img src={thumbSrc} alt={p.Title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              )}
                            </div>
                          )}
                          <div className="flex-1 space-y-2 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                              <h3 className="font-sans text-[20px] leading-[28px] tracking-[-0.01em] font-[500] text-on-surface group-hover:text-primary transition-colors">
                                {p.Title}
                              </h3>
                              <div className="flex items-center gap-4 font-mono text-[11px]" onClick={e => e.stopPropagation()}>
                                {p.Repo_URL && <a href={p.Repo_URL} target="_blank" rel="noreferrer" className="text-primary hover:underline">GitHub ↗</a>}
                                {p.Live_URL && <a href={p.Live_URL} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-on-surface hover:underline">Live Demo ↗</a>}
                              </div>
                            </div>
                            <p className="font-sans text-[14px] leading-[22px] text-on-surface-variant">{p.Summary}</p>
                            {tags.length > 0 && (
                              <p className="font-mono text-[11px] text-[#8a919b]">
                                {tags.map((t, ti) => (
                                  <span key={ti}>{t}{ti < tags.length - 1 && <span className="text-[#414750] mx-1">·</span>}</span>
                                ))}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── EDUCATION ─────────────────────────────────────── */}
          <section id="education" className="space-y-8 scroll-mt-24">
            <SectionTitle>Education</SectionTitle>
            {education.length === 0 ? (
              <p className="text-outline text-sm">No education entries yet.</p>
            ) : (
              <div className="space-y-8">
                {education.map(edu => (
                  <article key={edu.Edu_ID} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <h3 className="font-sans text-[20px] leading-[28px] tracking-[-0.01em] font-[500] text-on-surface">{edu.Degree}</h3>
                      <span className="font-mono text-[11px] text-[#8a919b]">{edu.Start_Year} — {edu.End_Year}</span>
                    </div>
                    <p className="font-sans text-[14px] text-primary">
                      {edu.Institution}
                      {edu.CGPA && (
                        <><span className="text-[#414750] font-normal mx-2">|</span><span className="text-on-surface-variant">CGPA: {edu.CGPA}</span></>
                      )}
                    </p>
                    {edu.Description && (
                      <p className="font-sans text-[13px] leading-[18px] text-on-surface-variant max-w-2xl">{edu.Description}</p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* ── CERTIFICATIONS ──────────────────────────────────── */}
          <section id="certifications" className="space-y-8 scroll-mt-24">
            <SectionTitle>Certifications</SectionTitle>
            {certifications.length === 0 ? (
              <p className="text-outline text-sm">No certifications yet.</p>
            ) : (
              <ul className="space-y-3">
                {certifications.map(cert => {
                  const thumbSrc = cert.Attachment_Path ? `${API_BASE}/uploads/${cert.Attachment_Path}` : null;
                  return (
                    <li key={cert.Cert_ID}>
                      <Link href={`/certifications/${cert.Cert_ID}`} className="flex items-center gap-4 group p-3 -mx-3 rounded-lg hover:bg-[#0e1c2e] transition-colors">
                        {thumbSrc ? (
                          <div className="shrink-0 w-14 h-14 rounded overflow-hidden border border-[#1d2b3d] bg-[#132033]">
                            {isVideo(cert.Attachment_Path) ? (
                              <video src={thumbSrc} className="w-full h-full object-cover" muted />
                            ) : (
                              <img src={thumbSrc} alt={cert.Name} className="w-full h-full object-cover" />
                            )}
                          </div>
                        ) : (
                          <div className="shrink-0 w-14 h-14 rounded border border-[#1d2b3d] bg-[#0e1c2e] flex items-center justify-center">
                            <span className="font-mono text-primary text-lg">✓</span>
                          </div>
                        )}
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="font-sans text-[16px] leading-[26px] text-on-surface font-[500] group-hover:text-primary transition-colors block">{cert.Name}</span>
                            <p className="font-mono text-[11px] text-[#8a919b]">
                              {cert.Issuer}
                              {cert.Date_Issued && <><span className="text-[#414750] mx-1">·</span>{new Date(cert.Date_Issued).getFullYear()}</>}
                            </p>
                          </div>
                          <span className="font-mono text-[11px] text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">View →</span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* ── SKILLS ─────────────────────────────────────────── */}
          <section id="skills" className="space-y-8 scroll-mt-24">
            <SectionTitle>Skills</SectionTitle>
            {Object.keys(skillsByCategory).length === 0 ? (
              <p className="text-outline text-sm">No skills yet.</p>
            ) : (
              <div className="space-y-6">
                {Object.entries(skillsByCategory).map(([category, skillNames]) => (
                  <div key={category} className="space-y-1.5">
                    <h3 className="font-mono text-[11px] uppercase tracking-wider text-primary">{category}</h3>
                    <p className="font-sans text-[16px] leading-[26px] text-on-surface-variant">
                      {skillNames.map((s, i) => (
                        <span key={i}>
                          {s}
                          {i < skillNames.length - 1 && <span className="text-[#414750] font-light mx-1.5">·</span>}
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── CONTACT ──────────────────────────────────────── */}
          <section id="contact" className="space-y-10 scroll-mt-24 pt-4">
            <div className="space-y-3">
              <SectionTitle>Contact</SectionTitle>
              <p className="font-sans text-[48px] leading-[56px] tracking-[-0.03em] font-[600] text-on-surface">Let's build something useful.</p>
              <p className="font-sans text-[16px] leading-[26px] text-[#8a919b] max-w-xl">
                Whether you have a project in mind, an infrastructure challenge, or an engineering role, feel free to reach out.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5 max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="Sender_Name" className="block font-mono text-[11px] uppercase tracking-wider text-[#8a919b]">Name</label>
                  <input
                    id="Sender_Name" name="Sender_Name" type="text" required
                    value={formState.Sender_Name} onChange={handleFormChange}
                    placeholder="Your name"
                    className="w-full bg-[#132033] px-3.5 py-2.5 rounded text-on-surface text-[13px] placeholder:text-[#414750] focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="Sender_Email" className="block font-mono text-[11px] uppercase tracking-wider text-[#8a919b]">Email</label>
                  <input
                    id="Sender_Email" name="Sender_Email" type="email" required
                    value={formState.Sender_Email} onChange={handleFormChange}
                    placeholder="name@domain.com"
                    className="w-full bg-[#132033] px-3.5 py-2.5 rounded text-on-surface text-[13px] placeholder:text-[#414750] focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="Subject" className="block font-mono text-[11px] uppercase tracking-wider text-[#8a919b]">Subject</label>
                <input
                  id="Subject" name="Subject" type="text"
                  value={formState.Subject} onChange={handleFormChange}
                  placeholder="Project inquiry or conversation topic"
                  className="w-full bg-[#132033] px-3.5 py-2.5 rounded text-on-surface text-[13px] placeholder:text-[#414750] focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="Message_Body" className="block font-mono text-[11px] uppercase tracking-wider text-[#8a919b]">Message</label>
                <textarea
                  id="Message_Body" name="Message_Body" rows={4} required
                  value={formState.Message_Body} onChange={handleFormChange}
                  placeholder="Share details about your idea or requirements..."
                  className="w-full bg-[#132033] px-3.5 py-2.5 rounded text-on-surface text-[13px] placeholder:text-[#414750] focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                />
              </div>
              <div className="pt-1">
                <button type="submit" className="inline-flex items-center justify-center px-5 py-2.5 bg-[#006daa] hover:bg-[#4c95d8] text-on-surface rounded font-sans text-[14px] transition-colors gap-2">
                  <span>Send Message</span>
                  <span className="font-mono">→</span>
                </button>
              </div>
              {formStatus === 'success' && (
                <p className="text-primary font-sans text-[13px] pt-2">Thank you for reaching out. I will respond to your message promptly.</p>
              )}
              {formStatus === 'error' && (
                <p className="text-[#ffb4ab] font-sans text-[13px] pt-2">Something went wrong. Please try again.</p>
              )}
            </form>

            <div className="flex items-center gap-6 pt-4 text-on-surface-variant font-mono text-[11px]">
              {profile.Email && <a href={`mailto:${profile.Email}`} className="hover:text-primary transition-colors">{profile.Email}</a>}
              {profile.Email && <span className="text-[#414750]">•</span>}
              {profile.GitHub_URL && <a href={profile.GitHub_URL} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">GitHub</a>}
              {profile.GitHub_URL && <span className="text-[#414750]">•</span>}
              {profile.LinkedIn_URL && <a href={profile.LinkedIn_URL.startsWith('http') ? profile.LinkedIn_URL : `https://${profile.LinkedIn_URL}`} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>}
            </div>

            {/* Footer signoff */}
            <div className="pt-16 pb-8 border-t border-[#414750]/30 text-[#8a919b] font-mono text-[11px] flex flex-col sm:flex-row justify-between gap-3">
              <p>{profile.Full_Name || 'Khizar Nadeem'} <span className="text-[#414750]">|</span> {heroHeading}</p>
              <p>© {new Date().getFullYear()}</p>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#020e20]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#006daa]" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#8a919b]">
              {profile.Full_Name || 'Khizar Nadeem'} © {new Date().getFullYear()}
            </span>
          </div>
          <p className="font-sans text-[13px] text-[#8a919b]">{heroHeading}</p>
        </div>
      </footer>
    </>
  );
}
