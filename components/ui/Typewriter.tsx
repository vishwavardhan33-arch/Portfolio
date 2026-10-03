'use client';
import { useEffect, useState } from 'react';
export default function Typewriter({ words }: { words: string[] }) {
  const [w, setW] = useState(0); const [n, setN] = useState(0); const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = words[w];
    const t = setTimeout(() => {
      if (!del && n < cur.length) setN(n + 1);
      else if (!del) setDel(true);
      else if (n > 0) setN(n - 1);
      else { setDel(false); setW((w + 1) % words.length); }
    }, del ? 40 : n === cur.length ? 1200 : 80);
    return () => clearTimeout(t);
  }, [n, del, w, words]);
  return <span aria-label={words.join(', ')}>{words[w].slice(0, n)}<span className="animate-pulse">|</span></span>;
}
