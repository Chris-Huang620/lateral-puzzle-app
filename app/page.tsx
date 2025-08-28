"use client";

import { useEffect, useState } from "react";
import FlipCard from "./components/FlipCard";

type Puzzle = {
  id: string;
  slug: string;
  title_en: string;
  surface_en: string;
  solution_en: string;
};

export default function Home() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/puzzles")
      .then((r) => r.json())
      .then((d) => setPuzzles(d.puzzles));
  }, []);

  const visible = puzzles.filter((p) => {
    const term = q.trim().toLowerCase();
    if (!term) return true;
    return (
      p.title_en.toLowerCase().includes(term) ||
      p.surface_en.toLowerCase().includes(term)
    );
  });

  return (
    <main className="mx-auto max-w-screen-sm sm:max-w-3xl p-4 sm:p-6 space-y-6 text-neutral-900">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">Lateral Puzzles</h1>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title or text"
          className="px-3 py-2 rounded-lg border border-neutral-300 w-full sm:w-64"
        />
      </header>

      <p className="text-sm text-neutral-700">
        Showing {visible.length} puzzles
      </p>

      <div className="space-y-6">
        {visible.map((p) => {
          const isFlipped = !!flipped[p.id];
          return (
            <section
              key={p.id}
              className="rounded-2xl border bg-white shadow p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {p.title_en}
                </h2>
                <button
                  onClick={() =>
                    setFlipped((f) => ({ ...f, [p.id]: !isFlipped }))
                  }
                  className="hidden sm:inline text-sm px-3 py-1 rounded-full border border-neutral-300 hover:bg-neutral-50"
                >
                  {isFlipped ? "Show Surface" : "Reveal Solution"}
                </button>
              </div>

              <FlipCard
                flipped={isFlipped}
                onToggle={() =>
                  setFlipped((f) => ({ ...f, [p.id]: !isFlipped }))
                }
                front={
                  <div className="space-y-2">
                    <div className="text-xs uppercase tracking-wide text-neutral-500">
                      Surface
                    </div>
                    <p className="leading-relaxed text-neutral-900">
                      {p.surface_en}
                    </p>
                    <div className="text-xs text-neutral-400">
                      (Tap card to reveal solution)
                    </div>
                  </div>
                }
                back={
                  <div className="space-y-2">
                    <div className="text-xs uppercase tracking-wide text-neutral-500">
                      Solution
                    </div>
                    <p className="leading-relaxed text-neutral-900">
                      {p.solution_en}
                    </p>
                    <div className="text-xs text-neutral-400">
                      (Tap card to go back)
                    </div>
                  </div>
                }
              />

              {/* Big mobile-friendly toggle button under the card */}
              <button
                onClick={() =>
                  setFlipped((f) => ({ ...f, [p.id]: !isFlipped }))
                }
                className="mt-3 w-full sm:w-auto text-sm px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-50"
              >
                {isFlipped ? "Show Surface" : "Reveal Solution"}
              </button>
            </section>
          );
        })}
      </div>
    </main>
  );
}
