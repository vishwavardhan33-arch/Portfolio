'use client';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { beyond, clusters, experience, nodes, profile, projects } from '@/data/content';
import Typewriter from '@/components/ui/Typewriter';
import ContactForm from '@/components/ui/ContactForm';

const Scene = dynamic(() => import('@/components/three/Scene'), { ssr: false });
const sec = 'relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-6 px-6 py-24 pointer-events-none';
const btn = 'pointer-events-auto rounded-full border border-cyan-400/50 px-5 py-2 text-sm hover:bg-cyan-400/10';

export default function Portfolio() {
  const [simple, setSimple] = useState(true);
  const [reduce, setReduce] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const [trained, setTrained] = useState(false);
  const fire = useRef(false);

  useEffect(() => {
    const r = matchMedia('(prefers-reduced-motion: reduce)').matches; setReduce(r);
    const weak = innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 2;
    setSimple(r || weak);
  }, []);

  const train = () => { fire.current = true; setTrained(true); setTimeout(() => setTrained(false), 5000); };
  const proj = projects.find((p) => p.id === sel);
  const node = nodes.find((n) => n.id === sel);
  const bey = beyond.find((b) => b.id === sel);

  return (
    <main>
      {!simple && <div className="fixed inset-0 z-0" aria-hidden><Scene onSelect={setSel} fire={fire} reduce={reduce} /></div>}
      {simple && <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,#0b1530,#05070f)]" aria-hidden />}

      <nav className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between px-6 py-4 text-sm">
        <span className="font-display">{profile.short}</span>
        <div className="flex gap-2">
          {!simple && <button onClick={train} className={btn}>Train the network</button>}
          <button onClick={() => setSimple(!simple)} className={btn} aria-pressed={simple}>{simple ? 'Enter 3D view' : 'Simple view'}</button>
        </div>
      </nav>

      <section id="hero" className={sec}>
        <h1 className="font-display text-5xl font-bold md:text-7xl">{profile.name}</h1>
        <p className="font-display text-2xl text-cyan-300"><Typewriter words={profile.roles} /></p>
        <p className="max-w-xl text-lg text-slate-300">{profile.tagline}</p>
        <div className="flex flex-wrap gap-3">
          <a className={btn} href="#projects">View Projects</a>
          <a className={btn} href={profile.resume} download>Download Resume</a>
          <a className={btn} href="#contact">Contact</a>
        </div>
      </section>

      <section id="about" className={sec}>
        <h2 className="font-display text-3xl">About</h2>
        <div className="glass pointer-events-auto grid gap-6 p-6 md:grid-cols-[1fr_220px]">
          <p className="text-slate-200">{profile.about}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.photo} alt={`Portrait of ${profile.name}`} className="aspect-square rounded-xl border border-white/10 object-cover" />
        </div>
      </section>

      <section id="skills" className={sec}>
        <h2 className="font-display text-3xl">Skills graph</h2>
        {!simple && <p className="glass pointer-events-auto max-w-md p-4 text-sm text-slate-300">Keep scrolling to fly through the network. Hover a node to light its connections, click for details.</p>}
        {simple && (Object.keys(clusters) as (keyof typeof clusters)[]).map((k) => (
          <div key={k} className="glass pointer-events-auto p-4">
            <h3 className="mb-2 font-display" style={{ color: clusters[k].color }}>{clusters[k].label}</h3>
            <div className="flex flex-wrap gap-2">{nodes.filter((n) => n.cluster === k).map((n) => <span key={n.id} className="rounded-full border border-white/15 px-3 py-1 text-xs">{n.id}</span>)}</div>
          </div>
        ))}
      </section>

      <section id="projects" className={sec}>
        <h2 className="font-display text-3xl">Projects</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <article key={p.id} className="glass pointer-events-auto grid gap-3 p-5">
              <h3 className="font-display text-xl text-cyan-300">{p.id}</h3>
              <p className="text-sm text-slate-300">{p.blurb}</p>
              <p className="text-sm text-amber-300">{p.result}</p>
              <p className="text-xs text-slate-400" aria-label="Architecture">{p.flow.join(' → ')}</p>
              <div className="flex flex-wrap gap-1">{p.stack.map((t) => <span key={t} className="rounded bg-white/10 px-2 py-0.5 text-xs">{t}</span>)}</div>
              {p.github && <a className={btn + ' w-fit'} href={p.github} target="_blank" rel="noreferrer">GitHub</a>}
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className={sec}>
        <h2 className="font-display text-3xl">Experience</h2>
        <ol className="pointer-events-auto border-l-2 border-cyan-400/60 pl-6 shadow-[-6px_0_18px_-8px_#22d3ee]">
          {experience.map((x) => (
            <li key={x.title} className="mb-8">
              <p className="text-xs text-cyan-300">{x.when}</p>
              <h3 className="font-display text-xl">{x.title} · {x.org}</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">{x.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </li>
          ))}
        </ol>
      </section>

      <section id="beyond" className={sec}>
        <h2 className="font-display text-3xl">Beyond the code</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {beyond.map((b) => (
            <div key={b.id} className="glass pointer-events-auto p-5">
              <h3 className="font-display text-pink-300">{b.id}</h3>
              <p className={`mt-2 text-sm text-slate-300 ${b.id === 'Film Writing' ? 'font-mono' : ''}`}>{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className={sec}>
        <h2 className="font-display text-3xl">Send a signal</h2>
        <div className="max-w-lg"><ContactForm /></div>
        <div className="flex gap-3">
          <a className={btn} href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <a className={btn} href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a className={btn} href={`mailto:${profile.email}`}>Email</a>
        </div>
      </section>

      <AnimatePresence>
        {sel && (
          <motion.aside initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} className="glass fixed bottom-4 right-4 top-16 z-40 w-[min(380px,90vw)] overflow-auto p-6" aria-label="Node details">
            <button onClick={() => setSel(null)} className="float-right text-sm" aria-label="Close panel">✕</button>
            <h3 className="font-display text-2xl" style={{ color: node ? clusters[node.cluster].color : undefined }}>{sel}</h3>
            <p className="mt-1 text-xs text-slate-400">{node && clusters[node.cluster].label}</p>
            <p className="mt-4 text-sm text-slate-200">{proj?.blurb ?? bey?.text ?? 'A node in the network. Hover to see what it connects to.'}</p>
            {proj && <p className="mt-3 text-sm text-amber-300">{proj.result}</p>}
          </motion.aside>
        )}
        {trained && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass fixed bottom-4 left-4 z-40 p-3 text-xs">
            <p>loss ↓ 0.01</p>
            <svg width="160" height="60" aria-label="Loss curve going down"><motion.path d="M0 5 C30 8, 40 45, 160 55" stroke="#22d3ee" strokeWidth="2" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3 }} /></svg>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
