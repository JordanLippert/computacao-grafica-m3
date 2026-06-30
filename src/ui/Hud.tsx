import type { Stats } from "../hooks/useSimulation";

export function Hud({ stats }: { stats: Stats }) {
  return (
    <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-[var(--panel-border)] bg-black/60 px-3 py-2 text-[13px] leading-6 tabular-nums backdrop-blur">
      Boids: <b className="text-[var(--accent)]">{stats.count}</b>
      <br />
      FPS: <b className="text-[var(--accent)]">{stats.fps}</b>
      <br />
      Vizinhos/boid: <b className="text-[var(--accent)]">{stats.neigh.toFixed(1)}</b>
    </div>
  );
}
