import type { V } from "../sim/vec";
import { mag, heading } from "../sim/vec";
import type { Boid } from "../sim/Boid";
import type { SimConfig } from "../sim/config";

export type Palette = {
  trail: string; // cor do fundo com alpha (efeito de rastro)
  accent: string;
  sep: string;
  align: string;
  coh: string;
  flee: string;
};

export class Renderer {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private palette: Palette,
  ) {}

  /** Preenche o fundo com alpha baixo: deixa rastro das posições anteriores. */
  clear(w: number, h: number): void {
    this.ctx.fillStyle = this.palette.trail;
    this.ctx.fillRect(0, 0, w, h);
  }

  boid(b: Boid, highlighted: boolean, maxSpeed: number): void {
    const ctx = this.ctx;
    const speed = mag(b.vel);
    const ang = speed > 0 ? heading(b.vel) : 0;
    const t = Math.min(1, speed / maxSpeed);
    const color = highlighted ? this.palette.accent : `hsl(${200 - t * 110}, 90%, ${55 + t * 15}%)`;

    ctx.save();
    ctx.translate(b.pos.x, b.pos.y);
    ctx.rotate(ang);
    ctx.shadowColor = color;
    ctx.shadowBlur = highlighted ? 16 : 7;
    ctx.beginPath();
    const s = highlighted ? 1.5 : 1;
    ctx.moveTo(8 * s, 0);
    ctx.lineTo(-5 * s, 4 * s);
    ctx.lineTo(-5 * s, -4 * s);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  probe(b: Boid, cfg: SimConfig): void {
    const ctx = this.ctx;
    const dbg = b.dbg;
    if (!dbg) return;

    ctx.save();
    ctx.shadowBlur = 0;

    // raio de percepção
    ctx.strokeStyle = "rgba(90,209,255,.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(b.pos.x, b.pos.y, cfg.perception, 0, Math.PI * 2);
    ctx.stroke();

    // ligações aos vizinhos (imagem toroidal mais próxima)
    ctx.strokeStyle = "rgba(255,255,255,.12)";
    ctx.beginPath();
    for (const n of dbg.neighbors) {
      ctx.moveTo(b.pos.x, b.pos.y);
      ctx.lineTo(b.pos.x + n.d.x, b.pos.y + n.d.y);
    }
    ctx.stroke();

    // vetores de direção (escalados para visibilidade)
    const S = 600;
    this.vector(b.pos, dbg.sep, S, this.palette.sep);
    this.vector(b.pos, dbg.ali, S, this.palette.align);
    this.vector(b.pos, dbg.coh, S, this.palette.coh);
    this.vector(b.pos, dbg.fl, S, this.palette.flee);

    ctx.restore();
  }

  private vector(p: V, vec: V, scale: number, color: string): void {
    if (vec.x === 0 && vec.y === 0) return;
    const ctx = this.ctx;
    const ex = p.x + vec.x * scale;
    const ey = p.y + vec.y * scale;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    const a = Math.atan2(ey - p.y, ex - p.x);
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - 7 * Math.cos(a - 0.4), ey - 7 * Math.sin(a - 0.4));
    ctx.lineTo(ex - 7 * Math.cos(a + 0.4), ey - 7 * Math.sin(a + 0.4));
    ctx.closePath();
    ctx.fill();
  }
}
