export type SimConfig = {
  wSep: number;
  wAlign: number;
  wCoh: number;
  wFlee: number;
  perception: number;
  sepRadius: number;
  fovDeg: number;
  maxSpeed: number;
  maxForce: number;
  predatorRadius: number;
  count: number;
};

export const DEFAULTS: SimConfig = {
  wSep: 1.6,
  wAlign: 1.1,
  wCoh: 0.9,
  wFlee: 2.2,
  perception: 55,
  sepRadius: 24,
  fovDeg: 270,
  maxSpeed: 3.2,
  maxForce: 0.09,
  predatorRadius: 90,
  count: 250,
};

/** Presets ajustam só os pesos das três regras. */
export type Weights = Pick<SimConfig, "wSep" | "wAlign" | "wCoh">;

export const PRESETS: Record<string, Weights> = {
  sep: { wSep: 2.5, wAlign: 0.0, wCoh: 0.0 },
  align: { wSep: 0.3, wAlign: 2.5, wCoh: 0.0 },
  coh: { wSep: 0.5, wAlign: 0.0, wCoh: 2.0 },
  balanced: { wSep: 1.6, wAlign: 1.1, wCoh: 0.9 },
};
