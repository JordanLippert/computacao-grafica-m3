import { test, expect } from "bun:test";
import { Simulation } from "./Simulation";
import { DEFAULTS } from "./config";

test("setCount ajusta o número de boids", () => {
  const sim = new Simulation(800, 600, { ...DEFAULTS, count: 50 });
  expect(sim.boids.length).toBe(50);
  sim.setCount(20);
  expect(sim.boids.length).toBe(20);
  sim.setCount(70);
  expect(sim.boids.length).toBe(70);
});

test("após vários steps todos os boids ficam dentro do mundo (wrap toroidal)", () => {
  const sim = new Simulation(800, 600, { ...DEFAULTS, count: 60 });
  for (let s = 0; s < 20; s++) sim.step();
  for (const b of sim.boids) {
    expect(b.pos.x).toBeGreaterThanOrEqual(0);
    expect(b.pos.x).toBeLessThan(800);
    expect(b.pos.y).toBeGreaterThanOrEqual(0);
    expect(b.pos.y).toBeLessThan(600);
    expect(Number.isFinite(b.vel.x)).toBe(true);
    expect(Number.isFinite(b.vel.y)).toBe(true);
  }
});
