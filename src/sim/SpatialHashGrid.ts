import type { Boid } from "./Boid";

/**
 * Grid de hash espacial ciente do toroide. Célula = raio de percepção.
 * Reduz a busca de vizinhos de O(n²) para ~O(n).
 */
export class SpatialHashGrid {
  readonly cell: number;
  readonly cols: number;
  readonly rows: number;
  private buckets: Boid[][];

  constructor(w: number, h: number, cell: number) {
    this.cell = Math.max(1, cell);
    this.cols = Math.max(1, Math.ceil(w / this.cell));
    this.rows = Math.max(1, Math.ceil(h / this.cell));
    this.buckets = Array.from({ length: this.cols * this.rows }, () => []);
  }

  private idx(cx: number, cy: number): number {
    const x = ((cx % this.cols) + this.cols) % this.cols;
    const y = ((cy % this.rows) + this.rows) % this.rows;
    return y * this.cols + x;
  }

  insert(boid: Boid): void {
    const cx = Math.floor(boid.pos.x / this.cell);
    const cy = Math.floor(boid.pos.y / this.cell);
    this.buckets[this.idx(cx, cy)].push(boid);
  }

  /** Candidatos na célula do boid + 8 vizinhas (com wrap toroidal). */
  query(boid: Boid): Boid[] {
    const cx = Math.floor(boid.pos.x / this.cell);
    const cy = Math.floor(boid.pos.y / this.cell);
    const res: Boid[] = [];
    const dedup = this.cols < 3 || this.rows < 3 ? new Set<number>() : null;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const i = this.idx(cx + dx, cy + dy);
        if (dedup) {
          if (dedup.has(i)) continue;
          dedup.add(i);
        }
        const b = this.buckets[i];
        for (let k = 0; k < b.length; k++) res.push(b[k]);
      }
    }
    return res;
  }
}
