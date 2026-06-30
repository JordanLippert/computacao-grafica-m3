import type { V } from "./vec";

/**
 * Menor vetor de `a` para `b` num mundo toroidal `w`×`h`
 * (escolhe o caminho que dá a volta nas bordas quando é mais curto).
 */
export function toroidalDelta(a: V, b: V, w: number, h: number): V {
  let dx = b.x - a.x;
  let dy = b.y - a.y;
  if (dx > w / 2) dx -= w;
  else if (dx < -w / 2) dx += w;
  if (dy > h / 2) dy -= h;
  else if (dy < -h / 2) dy += h;
  return { x: dx, y: dy };
}

/** Mantém `p` dentro de [0,w)×[0,h) com wrap toroidal (muta `p`). */
export function wrap(p: V, w: number, h: number): void {
  if (p.x < 0) p.x += w;
  else if (p.x >= w) p.x -= w;
  if (p.y < 0) p.y += h;
  else if (p.y >= h) p.y -= h;
}
