"use client";

import React, { useEffect, useRef, useState } from "react";

export default function FlipCard({
  front,
  back,
  flipped,
  onToggle,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  flipped: boolean;
  onToggle: () => void;
}) {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  // Measure visible face and cap to 75vh to avoid overflow on mobile
  const measure = () => {
    const el = (flipped ? backRef.current : frontRef.current);
    if (!el) return;
    const h = el.scrollHeight;
    const max = Math.floor(window.innerHeight * 0.75);
    setHeight(Math.min(h, max));
  };

  useEffect(() => {
    const id = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped, front, back]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped]);

  return (
    <div className="[perspective:1200px] w-full">
      <button
        onClick={onToggle}
        className="relative block w-full rounded-2xl shadow border border-neutral-700 bg-white text-left transition-transform duration-500 [transform-style:preserve-3d]"
        style={{
          transform: `rotateY(${flipped ? 180 : 0}deg)`,
          height: height ?? "auto",
        }}
        aria-label="Flip card"
      >
        {/* FRONT */}
        <div
          ref={frontRef}
          className="absolute inset-0 p-5 overflow-y-auto backface-hidden text-black"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {front}
        </div>

        {/* BACK */}
        <div
          ref={backRef}
          className="absolute inset-0 p-5 overflow-y-auto backface-hidden [transform:rotateY(180deg)] text-black"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {back}
        </div>
      </button>

      <style jsx>{`
        .backface-hidden { backface-visibility: hidden; }
      `}</style>

      {/* Respect reduced motion */}
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          button[aria-label="Flip card"] {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
