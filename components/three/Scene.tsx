'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdaptiveDpr, Html, PointMaterial, Points } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import { clusters, crossLinks, nodes } from '@/data/content';

interface Props { onSelect: (id: string) => void; fire: MutableRefObject<boolean>; reduce: boolean }
const P = 36;

function Network({ onSelect, fire, reduce }: Props) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const pulses = useRef<THREE.InstancedMesh>(null);
  const hoverRef = useRef(-1);
  const wave = useRef(-99);
  const [hover, setHover] = useState(-1);

  const g = useMemo(() => {
    const idx = new Map(nodes.map((n, i) => [n.id, i]));
    const per: Record<string, number> = {};
    nodes.forEach((n) => (per[n.cluster] = (per[n.cluster] || 0) + 1));
    const seen: Record<string, number> = {};
    const target = nodes.map((n) => {
      const c = clusters[n.cluster]; const i = (seen[n.cluster] = (seen[n.cluster] ?? -1) + 1);
      const y = 1 - ((i + 0.5) / per[n.cluster]) * 2; const r = Math.sqrt(1 - y * y); const a = i * 2.39996; const R = 3.4;
      return new THREE.Vector3(c.pos[0] + Math.cos(a) * r * R, c.pos[1] + y * R, c.pos[2] + Math.sin(a) * r * R);
    });
    const start = nodes.map(() => new THREE.Vector3().randomDirection().multiplyScalar(18 + Math.random() * 25));
    const edges: [number, number][] = []; const hubs: number[] = [];
    (Object.keys(clusters) as (keyof typeof clusters)[]).forEach((k) => {
      const ids = nodes.map((n, i) => (n.cluster === k ? i : -1)).filter((i) => i >= 0);
      hubs.push(ids[0]);
      ids.forEach((v, j) => { if (j > 0) edges.push([ids[j - 1], v]); if (j > 1) edges.push([ids[0], v]); });
    });
    hubs.forEach((h, i) => i > 0 && edges.push([hubs[i - 1], h]));
    crossLinks.forEach(([a, b]) => { const x = idx.get(a), y = idx.get(b); if (x !== undefined && y !== undefined) edges.push([x, y]); });
    const pulseState = Array.from({ length: P }, () => ({ e: Math.floor(Math.random() * edges.length), p: Math.random(), v: 0.15 + Math.random() * 0.3 }));
    return { target, start, edges, pulseState, base: nodes.map((n) => new THREE.Color(clusters[n.cluster].color)) };
  }, []);

  const lineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(g.edges.length * 6), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(g.edges.length * 6), 3));
    return geo;
  }, [g]);

  useEffect(() => { g.base.forEach((c, i) => mesh.current?.setColorAt(i, c)); }, [g]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const cur = useMemo(() => nodes.map(() => new THREE.Vector3()), []);
  const tmp = useMemo(() => new THREE.Color(), []);
  const white = useMemo(() => new THREE.Color('#ffffff'), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (fire.current) { wave.current = t; fire.current = false; }
    const a = reduce ? 1 : Math.min(1, t / 3); const ease = 1 - Math.pow(1 - a, 3);
    const wz = 12 - (t - wave.current) * 22;
    nodes.forEach((n, i) => {
      cur[i].lerpVectors(g.start[i], g.target[i], ease);
      const d = cur[i].z - wz; const boost = Math.exp(-(d * d) / 14);
      const sc = n.size * (1 + 0.08 * Math.sin(t * 2 + i) + boost * 1.6) * (hoverRef.current === i ? 1.5 : 1);
      dummy.position.copy(cur[i]); dummy.scale.setScalar(sc); dummy.updateMatrix();
      mesh.current?.setMatrixAt(i, dummy.matrix);
      mesh.current?.setColorAt(i, tmp.copy(g.base[i]).lerp(white, Math.min(1, boost)));
    });
    if (mesh.current) { mesh.current.instanceMatrix.needsUpdate = true; if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true; }

    const pos = lineGeo.getAttribute('position') as THREE.BufferAttribute; const col = lineGeo.getAttribute('color') as THREE.BufferAttribute;
    g.edges.forEach(([u, v], k) => {
      pos.setXYZ(k * 2, cur[u].x, cur[u].y, cur[u].z); pos.setXYZ(k * 2 + 1, cur[v].x, cur[v].y, cur[v].z);
      const hot = hoverRef.current >= 0 && (u === hoverRef.current || v === hoverRef.current);
      const c = hot ? 1 : 0.2;
      col.setXYZ(k * 2, 0.13 * c, 0.83 * c, 0.93 * c); col.setXYZ(k * 2 + 1, 0.55 * c, 0.36 * c, 0.96 * c);
    });
    pos.needsUpdate = true; col.needsUpdate = true;

    const speed = t - wave.current < 2 ? 6 : 1;
    g.pulseState.forEach((s, i) => {
      s.p += dt * s.v * speed; if (s.p > 1) { s.p = 0; s.e = Math.floor(Math.random() * g.edges.length); }
      const [u, v] = g.edges[s.e]; dummy.position.lerpVectors(cur[u], cur[v], s.p); dummy.scale.setScalar(0.09); dummy.updateMatrix();
      pulses.current?.setMatrixAt(i, dummy.matrix);
    });
    if (pulses.current) pulses.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={mesh} args={[undefined, undefined, nodes.length]}
        onPointerMove={(e) => { e.stopPropagation(); const i = e.instanceId ?? -1; hoverRef.current = i; setHover(i); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { hoverRef.current = -1; setHover(-1); document.body.style.cursor = ''; }}
        onClick={(e) => { e.stopPropagation(); if (e.instanceId !== undefined) onSelect(nodes[e.instanceId].id); }}>
        <sphereGeometry args={[1, 20, 20]} /><meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <lineSegments geometry={lineGeo}><lineBasicMaterial vertexColors transparent opacity={0.9} /></lineSegments>
      <instancedMesh ref={pulses} args={[undefined, undefined, P]}>
        <sphereGeometry args={[1, 8, 8]} /><meshBasicMaterial color="#c4f4ff" toneMapped={false} />
      </instancedMesh>
      {hover >= 0 && (
        <Html position={g.target[hover]} center style={{ pointerEvents: 'none' }}>
          <div className="glass -translate-y-8 whitespace-nowrap px-3 py-1 text-xs">{nodes[hover].id} · {clusters[nodes[hover].cluster].label}</div>
        </Html>
      )}
    </>
  );
}

function Rig() {
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const m = (e: MouseEvent) => (mouse.current = { x: e.clientX / innerWidth - 0.5, y: e.clientY / innerHeight - 0.5 });
    window.addEventListener('mousemove', m); return () => window.removeEventListener('mousemove', m);
  }, []);
  useFrame(({ camera, clock }) => {
    const h = document.documentElement; const p = Math.min(1, scrollY / Math.max(1, h.scrollHeight - innerHeight));
    const tz = 14 - 56 * p;
    camera.position.z += (tz - camera.position.z) * 0.06;
    camera.position.x += (mouse.current.x * 3 + Math.sin(clock.elapsedTime * 0.3) * 0.4 - camera.position.x) * 0.04;
    camera.position.y += (-mouse.current.y * 2 - camera.position.y) * 0.04;
    camera.lookAt(camera.position.x * 0.3, camera.position.y * 0.3, camera.position.z - 10);
  });
  return null;
}

export default function Scene(props: Props) {
  const dust = useMemo(() => Float32Array.from({ length: 2400 }, (_, i) => (i % 3 === 2 ? 15 - Math.random() * 70 : (Math.random() - 0.5) * 50)), []);
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 14], fov: 60 }} gl={{ antialias: false, powerPreference: 'high-performance' }}>
      <color attach="background" args={['#05070f']} />
      <AdaptiveDpr pixelated />
      <Rig />
      <Points positions={dust} stride={3}><PointMaterial size={0.06} color="#9fb3ff" transparent opacity={0.5} depthWrite={false} sizeAttenuation /></Points>
      <Network {...props} />
      <EffectComposer><Bloom intensity={1.2} luminanceThreshold={0.1} mipmapBlur /></EffectComposer>
    </Canvas>
  );
}
