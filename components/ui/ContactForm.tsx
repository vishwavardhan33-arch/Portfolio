'use client';
import { FormEvent, useState } from 'react';
export default function ContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
  const id = process.env.NEXT_PUBLIC_FORMSPREE_ID;
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!id) return setState('err'); setState('sending');
    const r = await fetch(`https://formspree.io/f/${id}`, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(e.currentTarget) });
    setState(r.ok ? 'ok' : 'err');
  }
  const f = 'w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 focus:border-cyan-400';
  return (
    <form onSubmit={submit} className="glass pointer-events-auto grid gap-3 p-6">
      <label className="grid gap-1 text-sm">Name<input name="name" required className={f} /></label>
      <label className="grid gap-1 text-sm">Email<input name="email" type="email" required className={f} /></label>
      <label className="grid gap-1 text-sm">Message<textarea name="message" rows={4} required className={f} /></label>
      <button disabled={state === 'sending'} className="rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-black shadow-[0_0_24px_#22d3ee88]">Send a signal</button>
      <p role="status" className="text-sm">{state === 'ok' && 'Signal received. I will fire back soon.'}{state === 'err' && 'Could not send. Email me directly instead.'}</p>
    </form>
  );
}
