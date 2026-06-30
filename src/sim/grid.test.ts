import { test, expect } from "bun:test";
import { Boid } from "./Boid";
import { SpatialHashGrid } from "./SpatialHashGrid";

function boidAt(x: number, y: number): Boid {
  const b = new Boid(x, y, 1);
  return b;
}

test("query retorna boids da mesma célula e células adjacentes, não os distantes", () => {
  const grid = new SpatialHashGrid(100, 100, 10); // 10x10 células
  const a = boidAt(15, 15); // célula (1,1)
  const b = boidAt(16, 16); // célula (1,1) — mesma
  const c = boidAt(25, 25); // célula (2,2) — adjacente
  const far = boidAt(55, 55); // célula (5,5) — distante
  [a, b, c, far].forEach((x) => grid.insert(x));

  const res = grid.query(a);
  expect(res).toContain(b);
  expect(res).toContain(c);
  expect(res).not.toContain(far);
});

test("perceive filtra por raio (distância toroidal)", () => {
  const grid = new SpatialHashGrid(100, 100, 30);
  const a = boidAt(50, 50);
  const near = boidAt(60, 50); // dist 10
  const edge = boidAt(80, 50); // dist 30 (fora do raio 25)
  [a, near, edge].forEach((x) => grid.insert(x));

  const neighbors = a.perceive(grid.query(a), 25, -1, 100, 100);
  const boids = neighbors.map((n) => n.boid);
  expect(boids).toContain(near);
  expect(boids).not.toContain(edge);
});
