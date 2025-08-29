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
    <main className="mx-auto max-w-screen-sm sm:max-w-3xl p-4 sm:p-6 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">Lateral Puzzles</h1>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title or text"
          className="px-3 py-2 rounded-lg border border-neutral-700 w-full sm:w-72 bg-neutral-900 text-white placeholder-neutral-400"
        />
      </header>

      <p className="text-sm text-neutral-400">
        Showing {visible.length} puzzles
      </p>

      <div className="space-y-6">
        {visible.map((p) => {
          const isFlipped = !!flipped[p.id];
          return (
            <section
              key={p.id}
              className="rounded-2xl border border-neutral-700 bg-white shadow p-5 space-y-3 text-black"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{p.title_en}</h2>

                {/* Small screens have big button below; keep this as a compact header button on desktop */}
                <button
                  onClick={() =>
                    setFlipped((f) => ({ ...f, [p.id]: !isFlipped }))
                  }
                  className="hidden sm:inline text-sm px-3 py-1 rounded-full border border-neutral-300 hover:bg-neutral-50 text-black"
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
                    <div className="text-xs uppercase tracking-wide text-neutral-600">
                      Surface
                    </div>
                    <p className="leading-relaxed">
                      {p.surface_en}
                    </p>
                    <div className="text-xs text-neutral-500">
                      (Tap card to reveal solution)
                    </div>
                  </div>
                }
                back={
                  <div className="space-y-2">
                    <div className="text-xs uppercase tracking-wide text-neutral-600">
                      Solution
                    </div>
                    <p className="leading-relaxed">
                      {p.solution_en}
                    </p>
                    <div className="text-xs text-neutral-500">
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
                className="mt-3 w-full sm:w-auto text-sm px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-50 text-black"
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
