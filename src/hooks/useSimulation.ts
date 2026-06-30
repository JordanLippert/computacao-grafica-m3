import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Simulation } from "../sim/Simulation";
import { Renderer, type Palette } from "../render/Renderer";
import { DEFAULTS, PRESETS, type SimConfig, type Weights } from "../sim/config";

export type Stats = { count: number; fps: number; neigh: number };

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function hexToRgba(hex: string, alpha: number): string {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function readPalette(): Palette {
  return {
    trail: hexToRgba(cssVar("--bg") || "#0b0e14", 0.22),
    accent: cssVar("--accent") || "#5ad1ff",
    sep: cssVar("--c-sep") || "#ff5a7a",
    align: cssVar("--c-align") || "#5affa0",
    coh: cssVar("--c-coh") || "#5a8bff",
    flee: cssVar("--c-flee") || "#ffd45a",
  };
}

export type SimControls = {
  set: <K extends keyof SimConfig>(key: K, value: SimConfig[K]) => void;
  applyPreset: (name: keyof typeof PRESETS) => Weights;
  toggleProbe: () => boolean;
};

export function useSimulation(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const simRef = useRef<Simulation | null>(null);
  const probeRef = useRef(false);
  const [stats, setStats] = useState<Stats>({ count: 0, fps: 0, neigh: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement as HTMLElement;
    const dpr = window.devicePixelRatio || 1;
    let w = parent.clientWidth || 800;
    let h = parent.clientHeight || 600;

    const sim = new Simulation(w, h);
    simRef.current = sim;
    const renderer = new Renderer(ctx, readPalette());

    const applyCanvasSize = () => {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const resize = () => {
      w = parent.clientWidth;
      h = parent.clientHeight;
      sim.resize(w, h);
      applyCanvasSize();
    };
    applyCanvasSize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      sim.predator = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => {
      sim.predator = null;
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    let raf = 0;
    let last = performance.now();
    let fpsAvg = 60;
    let hudT = 0;

    const frame = (now: number) => {
      const dt = now - last;
      last = now;
      if (dt > 0) fpsAvg += (1000 / dt - fpsAvg) * 0.1;

      sim.step();
      renderer.clear(sim.w, sim.h);
      const n = sim.boids.length;
      const probe = probeRef.current;
      for (let i = 0; i < n; i++) renderer.boid(sim.boids[i], probe && i === 0, sim.cfg.maxSpeed);
      if (probe && n > 0) renderer.probe(sim.boids[0], sim.cfg);

      hudT += dt;
      if (hudT > 250) {
        setStats({ count: n, fps: Math.round(fpsAvg), neigh: n > 0 ? sim.lastNeighborSum / n : 0 });
        hudT = 0;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      simRef.current = null;
    };
  }, [canvasRef]);

  const controls = useMemo<SimControls>(
    () => ({
      set: (key, value) => {
        const sim = simRef.current;
        if (!sim) return;
        sim.cfg[key] = value;
        if (key === "count") sim.setCount(value as number);
      },
      applyPreset: (name) => {
        const p = PRESETS[name];
        const sim = simRef.current;
        if (sim) Object.assign(sim.cfg, p);
        return p;
      },
      toggleProbe: () => {
        probeRef.current = !probeRef.current;
        return probeRef.current;
      },
    }),
    [],
  );

  return { stats, controls, defaults: DEFAULTS };
}
