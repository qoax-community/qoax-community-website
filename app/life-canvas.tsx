"use client";

import { useEffect, useRef } from "react";

type LifeCanvasProps = {
  className?: string;
  /** Cell size in CSS pixels. */
  cell?: number;
  /** Milliseconds between generations. */
  tick?: number;
  /** Cell colour as "r, g, b". */
  rgb?: string;
  /** Peak opacity of a live cell. */
  alpha?: number;
};

// Glider, lightweight spaceship and R-pentomino, as [x, y] offsets.
const PATTERNS: Array<Array<[number, number]>> = [
  [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]],
  [[1, 0], [4, 0], [0, 1], [0, 2], [4, 2], [0, 3], [1, 3], [2, 3], [3, 3]],
  [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]],
];

const FADE_STEPS = 6;
// How long the board holds still after the visitor edits a cell.
const EDIT_HOLD_MS = 1400;

/**
 * Conway's Game of Life on a wrapping grid, drawn behind decorative surfaces.
 * It pauses while off screen or in a hidden tab, and draws one still frame
 * when the visitor prefers reduced motion. Clicking a square toggles that one
 * cell, and dragging with a mouse paints a line of cells. The board holds still
 * briefly after each edit, so the visitor sees exactly what they drew before the
 * next generation runs.
 */
export function LifeCanvas({ className, cell = 16, tick = 560, rgb = "28, 28, 26", alpha = 0.13 }: LifeCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cols = 0;
    let rows = 0;
    let grid = new Uint8Array(0);
    let next = new Uint8Array(0);
    // Generations since a cell died, so dead cells fade out instead of vanishing.
    let ghost = new Uint8Array(0);
    let visible = false;
    let timer = 0;
    let stale = 0;
    let lastPopulation = -1;
    let holdUntil = 0;
    let painting = false;
    let lastPainted = -1;

    const index = (x: number, y: number) => ((y + rows) % rows) * cols + ((x + cols) % cols);

    const stamp = (x: number, y: number, pattern: Array<[number, number]>) => {
      const flipX = Math.random() < 0.5 ? -1 : 1;
      const flipY = Math.random() < 0.5 ? -1 : 1;
      for (const [dx, dy] of pattern) grid[index(x + dx * flipX, y + dy * flipY)] = 1;
    };

    const seed = () => {
      grid.fill(0);
      ghost.fill(FADE_STEPS);
      for (let i = 0; i < grid.length; i += 1) if (Math.random() < 0.08) grid[i] = 1;
      const shapes = Math.max(4, Math.round((cols * rows) / 180));
      for (let i = 0; i < shapes; i += 1) {
        stamp(Math.floor(Math.random() * cols), Math.floor(Math.random() * rows), PATTERNS[i % PATTERNS.length]);
      }
      stale = 0;
      lastPopulation = -1;
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const nextCols = Math.max(8, Math.ceil(width / cell));
      const nextRows = Math.max(8, Math.ceil(height / cell));
      if (nextCols === cols && nextRows === rows) return draw();
      cols = nextCols;
      rows = nextRows;
      grid = new Uint8Array(cols * rows);
      next = new Uint8Array(cols * rows);
      ghost = new Uint8Array(cols * rows);
      seed();
      draw();
    };

    const step = () => {
      let population = 0;
      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const n =
            grid[index(x - 1, y - 1)] + grid[index(x, y - 1)] + grid[index(x + 1, y - 1)] +
            grid[index(x - 1, y)] + grid[index(x + 1, y)] +
            grid[index(x - 1, y + 1)] + grid[index(x, y + 1)] + grid[index(x + 1, y + 1)];
          const i = y * cols + x;
          const alive = n === 3 || (n === 2 && grid[i] === 1) ? 1 : 0;
          next[i] = alive;
          if (alive) {
            ghost[i] = 0;
            population += 1;
          } else if (ghost[i] < FADE_STEPS) {
            ghost[i] += 1;
          }
        }
      }
      [grid, next] = [next, grid];

      // Reseed when the board dies out or settles into still lifes and blinkers.
      stale = Math.abs(population - lastPopulation) <= 2 ? stale + 1 : 0;
      lastPopulation = population;
      if (population < (cols * rows) / 60 || stale > 24) seed();
    };

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      context.clearRect(0, 0, width, height);
      const size = cell - 3;
      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const i = y * cols + x;
          const strength = grid[i] ? 1 : ghost[i] < FADE_STEPS ? (1 - ghost[i] / FADE_STEPS) * 0.35 : 0;
          if (strength === 0) continue;
          context.fillStyle = `rgba(${rgb}, ${(alpha * strength).toFixed(3)})`;
          context.fillRect(x * cell + 1.5, y * cell + 1.5, size, size);
        }
      }
    };

    const loop = () => {
      if (performance.now() < holdUntil) return;
      step();
      draw();
    };

    const sync = () => {
      window.clearInterval(timer);
      timer = 0;
      if (!reduceMotion && visible && !document.hidden) timer = window.setInterval(loop, tick);
    };

    const cellAt = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      const x = Math.floor((event.clientX - box.left) / cell);
      const y = Math.floor((event.clientY - box.top) / cell);
      if (x < 0 || y < 0 || x >= cols || y >= rows) return -1;
      return y * cols + x;
    };

    const edit = (i: number, alive: 0 | 1) => {
      grid[i] = alive;
      // A cleared cell disappears at once instead of fading like a natural death.
      ghost[i] = alive ? 0 : FADE_STEPS;
      lastPainted = i;
      holdUntil = performance.now() + EDIT_HOLD_MS;
      stale = 0;
      draw();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (reduceMotion || event.button !== 0) return;
      // Links and buttons in the footer keep working without touching the board.
      if ((event.target as Element | null)?.closest("a, button, input, select, textarea, summary, label")) return;
      const i = cellAt(event);
      if (i < 0) return;
      painting = event.pointerType === "mouse";
      edit(i, grid[i] ? 0 : 1);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!painting) return;
      if ((event.buttons & 1) === 0) {
        painting = false;
        return;
      }
      const i = cellAt(event);
      if (i >= 0 && i !== lastPainted && !grid[i]) edit(i, 1);
    };

    const stopPainting = () => {
      painting = false;
      lastPainted = -1;
    };

    const host = canvas.parentElement ?? canvas;
    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });

    resize();
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopPainting);
    window.addEventListener("pointercancel", stopPainting);

    return () => {
      window.clearInterval(timer);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopPainting);
      window.removeEventListener("pointercancel", stopPainting);
    };
  }, [cell, tick, rgb, alpha]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
