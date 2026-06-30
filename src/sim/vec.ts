/** Vetor 2D imutável. */
export type V = { x: number; y: number };

export const v = (x: number, y: number): V => ({ x, y });

export const add = (a: V, b: V): V => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a: V, b: V): V => ({ x: a.x - b.x, y: a.y - b.y });
export const scale = (a: V, s: number): V => ({ x: a.x * s, y: a.y * s });
export const mag2 = (a: V): number => a.x * a.x + a.y * a.y;
export const mag = (a: V): number => Math.hypot(a.x, a.y);
export const heading = (a: V): number => Math.atan2(a.y, a.x);

export const normalize = (a: V): V => {
  const m = Math.hypot(a.x, a.y);
  return m > 0 ? { x: a.x / m, y: a.y / m } : { x: 0, y: 0 };
};

export const setMag = (a: V, m: number): V => {
  const cur = Math.hypot(a.x, a.y);
  return cur > 0 ? { x: (a.x / cur) * m, y: (a.y / cur) * m } : { x: 0, y: 0 };
};

export const limit = (a: V, max: number): V => {
  const m = Math.hypot(a.x, a.y);
  return m > max && m > 0 ? { x: (a.x / m) * max, y: (a.y / m) * max } : { x: a.x, y: a.y };
};
