import type { V } from "./vec";
import { add, limit } from "./vec";
import { wrap } from "./toroidal";
import { Boid } from "./Boid";
import { SpatialHashGrid } from "./SpatialHashGrid";
import { separation, alignment, cohesion, flee } from "./rules";
import { DEFAULTS, type SimConfig } from "./config";

export class Simulation {
  w: number;
  h: number;
  cfg: SimConfig;
  predator: V | null = null;
  boids: Boid[] = [];
  lastNeighborSum = 0;

  constructor(w: number, h: number, cfg: SimConfig = { ...DEFAULTS }) {
    this.w = w;
    this.h = h;
    this.cfg = cfg;
    this.setCount(cfg.count);
  }

  resize(w: number, h: number): void {
    this.w = w;
    this.h = h;
  }

  setCount(n: number): void {
    const cur = this.boids.length;
    if (n > cur) {
      for (let i = cur; i < n; i++) {
        this.boids.push(new Boid(Math.random() * this.w, Math.random() * this.h, this.cfg.maxSpeed));
      }
    } else if (n < cur) {
      this.boids.length = n;
    }
  }

  step(): void {
    const cfg = this.cfg;
    const grid = new SpatialHashGrid(this.w, this.h, cfg.perception);
    for (let i = 0; i < this.boids.length; i++) grid.insert(this.boids[i]);

    const fovCos = cfg.fovDeg >= 360 ? -1 : Math.cos(((cfg.fovDeg * Math.PI) / 180) / 2);
    let neighborTotal = 0;

    // fase 1: aceleração (lê o estado atual de todos)
    for (let i = 0; i < this.boids.length; i++) {
      const b = this.boids[i];
      const neighbors = b.perceive(grid.query(b), cfg.perception, fovCos, this.w, this.h);
      neighborTotal += neighbors.length;

      const sep = separation(b, neighbors, cfg);
      const ali = alignment(b, neighbors, cfg);
      const coh = cohesion(b, neighbors, cfg);
      const fl = flee(b, this.predator, cfg, this.w, this.h);

      const ax = sep.x * cfg.wSep + ali.x * cfg.wAlign + coh.x * cfg.wCoh + fl.x * cfg.wFlee;
      const ay = sep.y * cfg.wSep + ali.y * cfg.wAlign + coh.y * cfg.wCoh + fl.y * cfg.wFlee;
      b.acc = limit({ x: ax, y: ay }, cfg.maxForce);
      b.dbg = { sep, ali, coh, fl, neighbors };
    }

    // fase 2: integração de Euler + wrap toroidal
    for (let i = 0; i < this.boids.length; i++) {
      const b = this.boids[i];
      b.vel = limit(add(b.vel, b.acc), cfg.maxSpeed);
      b.pos.x += b.vel.x;
      b.pos.y += b.vel.y;
      wrap(b.pos, this.w, this.h);
    }

    this.lastNeighborSum = neighborTotal;
  }
}
