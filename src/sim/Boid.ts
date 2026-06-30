import type { V } from "./vec";
import { mag } from "./vec";
import { toroidalDelta } from "./toroidal";

export type Neighbor = { boid: Boid; d: V; dist: number };

/** Vetores de direção guardados para a sonda de percepção (didático). */
export type DebugVectors = {
  sep: V;
  ali: V;
  coh: V;
  fl: V;
  neighbors: Neighbor[];
};

export class Boid {
  pos: V;
  vel: V;
  acc: V = { x: 0, y: 0 };
  dbg: DebugVectors | null = null;

  constructor(x: number, y: number, maxSpeed: number) {
    this.pos = { x, y };
    const a = Math.random() * Math.PI * 2;
    this.vel = { x: Math.cos(a) * maxSpeed, y: Math.sin(a) * maxSpeed };
  }

  /**
   * Filtra candidatos por raio + ângulo de visão (FOV).
   * `fovCos = -1` desativa o FOV (visão de 360°). `d` aponta deste boid -> vizinho.
   */
  perceive(candidates: Boid[], radius: number, fovCos: number, w: number, h: number): Neighbor[] {
    const out: Neighbor[] = [];
    const r2 = radius * radius;
    const speed = mag(this.vel);
    const hx = speed > 0 ? this.vel.x / speed : 0;
    const hy = speed > 0 ? this.vel.y / speed : 0;
    const useFov = fovCos > -1 && speed > 0;

    for (let i = 0; i < candidates.length; i++) {
      const o = candidates[i];
      if (o === this) continue;
      const d = toroidalDelta(this.pos, o.pos, w, h);
      const dist2 = d.x * d.x + d.y * d.y;
      if (dist2 > r2 || dist2 === 0) continue;
      if (useFov) {
        const dm = Math.sqrt(dist2);
        if ((d.x / dm) * hx + (d.y / dm) * hy < fovCos) continue;
      }
      out.push({ boid: o, d, dist: Math.sqrt(dist2) });
    }
    return out;
  }
}
