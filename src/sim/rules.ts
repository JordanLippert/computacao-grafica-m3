import type { V } from "./vec";
import { sub, setMag, limit, mag } from "./vec";
import { toroidalDelta } from "./toroidal";
import type { Boid, Neighbor } from "./Boid";
import type { SimConfig } from "./config";

const ZERO: V = { x: 0, y: 0 };

/** Reynolds: steer = limit(setMag(desejado, maxSpeed) - vel, maxForce). */
function steer(desiredDir: V, vel: V, cfg: SimConfig): V {
  if (desiredDir.x === 0 && desiredDir.y === 0) return ZERO;
  const desired = setMag(desiredDir, cfg.maxSpeed);
  return limit(sub(desired, vel), cfg.maxForce);
}

/** Separação: repulsão de curto alcance, ponderada por 1/dist. */
export function separation(b: Boid, neighbors: Neighbor[], cfg: SimConfig): V {
  let sx = 0;
  let sy = 0;
  let count = 0;
  for (let i = 0; i < neighbors.length; i++) {
    const n = neighbors[i];
    if (n.dist >= cfg.sepRadius) continue;
    const inv = 1 / (n.dist * n.dist);
    sx += -n.d.x * inv;
    sy += -n.d.y * inv;
    count++;
  }
  if (count === 0) return ZERO;
  return steer({ x: sx, y: sy }, b.vel, cfg);
}

/** Alinhamento: casa a velocidade média dos vizinhos. */
export function alignment(b: Boid, neighbors: Neighbor[], cfg: SimConfig): V {
  if (neighbors.length === 0) return ZERO;
  let vx = 0;
  let vy = 0;
  for (let i = 0; i < neighbors.length; i++) {
    vx += neighbors[i].boid.vel.x;
    vy += neighbors[i].boid.vel.y;
  }
  return steer({ x: vx, y: vy }, b.vel, cfg);
}

/** Coesão: busca o centro de massa (média de posições, relativa e toroidal). */
export function cohesion(b: Boid, neighbors: Neighbor[], cfg: SimConfig): V {
  if (neighbors.length === 0) return ZERO;
  let ox = 0;
  let oy = 0;
  for (let i = 0; i < neighbors.length; i++) {
    ox += neighbors[i].d.x;
    oy += neighbors[i].d.y;
  }
  return steer({ x: ox / neighbors.length, y: oy / neighbors.length }, b.vel, cfg);
}

/** Fuga: afasta-se do predador, apenas dentro do raio do predador. */
export function flee(b: Boid, predator: V | null, cfg: SimConfig, w: number, h: number): V {
  if (!predator) return ZERO;
  const d = toroidalDelta(b.pos, predator, w, h); // boid -> predador
  const dist = mag(d);
  if (dist === 0 || dist >= cfg.predatorRadius) return ZERO;
  return steer({ x: -d.x, y: -d.y }, b.vel, cfg);
}
