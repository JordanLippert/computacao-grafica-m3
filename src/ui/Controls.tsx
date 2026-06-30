import { useState } from "react";
import type { SimConfig } from "../sim/config";
import type { SimControls } from "../hooks/useSimulation";

type SliderDef = {
  key: keyof SimConfig;
  label: string;
  min: number;
  max: number;
  step: number;
  fmt: (v: number) => string;
};

const SLIDERS: SliderDef[] = [
  { key: "wSep", label: "Separação", min: 0, max: 3, step: 0.05, fmt: (v) => v.toFixed(2) },
  { key: "wAlign", label: "Alinhamento", min: 0, max: 3, step: 0.05, fmt: (v) => v.toFixed(2) },
  { key: "wCoh", label: "Coesão", min: 0, max: 3, step: 0.05, fmt: (v) => v.toFixed(2) },
  { key: "perception", label: "Raio de percepção", min: 20, max: 160, step: 1, fmt: (v) => String(v) },
  { key: "sepRadius", label: "Raio de separação", min: 5, max: 80, step: 1, fmt: (v) => String(v) },
  { key: "fovDeg", label: "Ângulo de visão", min: 30, max: 360, step: 5, fmt: (v) => `${v}°` },
  { key: "maxSpeed", label: "Velocidade máx", min: 1, max: 6, step: 0.1, fmt: (v) => v.toFixed(1) },
  { key: "count", label: "Nº de boids", min: 20, max: 800, step: 10, fmt: (v) => String(v) },
];

const PRESET_BTNS: { name: "sep" | "align" | "coh" | "balanced"; label: string }[] = [
  { name: "sep", label: "Só separação" },
  { name: "align", label: "Só alinhamento" },
  { name: "coh", label: "Só coesão" },
  { name: "balanced", label: "Equilibrado" },
];

export function Controls({
  controls,
  defaults,
}: {
  controls: SimControls;
  defaults: SimConfig;
}) {
  const [vals, setVals] = useState<SimConfig>({ ...defaults });
  const [probe, setProbe] = useState(false);

  const update = <K extends keyof SimConfig>(key: K, value: SimConfig[K]) => {
    setVals((v) => ({ ...v, [key]: value }));
    controls.set(key, value);
  };

  const applyPreset = (name: "sep" | "align" | "coh" | "balanced") => {
    const w = controls.applyPreset(name);
    setVals((v) => ({ ...v, ...w }));
  };

  return (
    <aside className="flex w-[300px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-[var(--panel-border)] bg-[var(--panel)] p-5">
      <div>
        <h1 className="text-base font-semibold">Boids</h1>
        <p className="text-xs text-[var(--muted)]">Reynolds, 1987 — Flocks, Herds, and Schools</p>
      </div>

      <div className="flex flex-col gap-3">
        {SLIDERS.map((s) => {
          const value = vals[s.key];
          return (
            <label key={s.key} className="flex flex-col gap-1 text-[13px]">
              <span className="flex justify-between">
                {s.label}
                <span className="tabular-nums text-[var(--accent)]">{s.fmt(value)}</span>
              </span>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={value}
                className="accent-[var(--accent)]"
                onChange={(e) => update(s.key, Number(e.target.value))}
              />
            </label>
          );
        })}
      </div>

      <div>
        <p className="mb-2 text-[13px]">Cenários</p>
        <div className="grid grid-cols-2 gap-1.5">
          {PRESET_BTNS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p.name)}
              className="rounded-md border border-[var(--panel-border)] bg-[#1d2738] px-2 py-1.5 text-xs hover:border-[var(--accent)]"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setProbe(controls.toggleProbe())}
        className={`rounded-md border px-2 py-1.5 text-xs ${
          probe
            ? "border-[var(--accent)] bg-[var(--accent)] text-[#08121a]"
            : "border-[var(--panel-border)] bg-[#1d2738]"
        }`}
      >
        Sonda de percepção: {probe ? "ON" : "OFF"}
      </button>

      <div className="mt-auto text-xs leading-relaxed text-[var(--muted)]">
        <p className="mb-1 text-[var(--text)]">Mova o cursor sobre o quadro = predador.</p>
        <p>
          Vetores: <span className="text-[var(--c-sep)]">■ separação</span>{" "}
          <span className="text-[var(--c-align)]">■ alinhamento</span>{" "}
          <span className="text-[var(--c-coh)]">■ coesão</span>{" "}
          <span className="text-[var(--c-flee)]">■ fuga</span>
        </p>
      </div>
    </aside>
  );
}
