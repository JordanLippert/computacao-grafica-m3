import { test, expect } from "bun:test";
import { Boid, type Neighbor } from "./Boid";
import { separation, alignment, cohesion, flee } from "./rules";
import { DEFAULTS } from "./config";

function still(x: number, y: number): Boid {
  const b = new Boid(x, y, 1);
  b.vel = { x: 0, y: 0 };
  return b;
}

test("separação aponta para longe de um vizinho à direita", () => {
  const b = still(50, 50);
  const other = still(60, 50);
  const neighbors: Neighbor[] = [{ boid: other, d: { x: 10, y: 0 }, dist: 10 }];
  const f = separation(b, neighbors, DEFAULTS);
  expect(f.x).toBeLessThan(0); // foge para a esquerda
});

test("coesão aponta em direção a um vizinho à direita", () => {
  const b = still(50, 50);
  const other = still(60, 50);
  const neighbors: Neighbor[] = [{ boid: other, d: { x: 10, y: 0 }, dist: 10 }];
  const f = cohesion(b, neighbors, DEFAULTS);
  expect(f.x).toBeGreaterThan(0); // busca a direita
});

test("alinhamento segue a velocidade do vizinho", () => {
  const b = still(50, 50);
  const other = still(60, 50);
  other.vel = { x: 2, y: 0 };
  const neighbors: Neighbor[] = [{ boid: other, d: { x: 10, y: 0 }, dist: 10 }];
  const f = alignment(b, neighbors, DEFAULTS);
  expect(f.x).toBeGreaterThan(0);
});

test("fuga sem predador é vetor nulo", () => {
  const b = still(50, 50);
  const f = flee(b, null, DEFAULTS, 100, 100);
  expect(f.x).toBe(0);
  expect(f.y).toBe(0);
});

test("fuga afasta do predador próximo", () => {
  const b = still(50, 50);
  const f = flee(b, { x: 60, y: 50 }, DEFAULTS, 800, 600);
  expect(f.x).toBeLessThan(0); // predador à direita -> foge à esquerda
});
