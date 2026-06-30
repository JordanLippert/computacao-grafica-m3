import { test, expect } from "bun:test";
import { mag, limit, setMag, normalize, v } from "./vec";
import { toroidalDelta } from "./toroidal";

test("limit reduz a magnitude acima do teto", () => {
  expect(mag(limit(v(3, 4), 2))).toBeCloseTo(2, 6);
});

test("limit preserva se abaixo do teto", () => {
  expect(mag(limit(v(3, 4), 10))).toBeCloseTo(5, 6);
});

test("setMag ajusta a magnitude", () => {
  expect(mag(setMag(v(3, 4), 10))).toBeCloseTo(10, 6);
});

test("normalize -> magnitude 1", () => {
  expect(mag(normalize(v(3, 4)))).toBeCloseTo(1, 6);
});

test("toroidalDelta escolhe a volta quando é mais curto", () => {
  const d = toroidalDelta(v(1, 1), v(9, 9), 10, 10);
  expect(d.x).toBeCloseTo(-2, 6);
  expect(d.y).toBeCloseTo(-2, 6);
});

test("toroidalDelta usa caminho direto quando é mais curto", () => {
  const d = toroidalDelta(v(1, 1), v(3, 4), 10, 10);
  expect(d.x).toBeCloseTo(2, 6);
  expect(d.y).toBeCloseTo(3, 6);
});
