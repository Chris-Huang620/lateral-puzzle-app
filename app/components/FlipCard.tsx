"use client";

import clsx from "clsx";
import React from "react";

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
  return (
    <div className="[perspective:1200px] w-full">
      <button
        onClick={onToggle}
        className="relative block w-full min-h-48 rounded-2xl shadow bg-white text-left transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: `rotateY(${flipped ? 180 : 0}deg)` }}
        aria-label="Flip card"
      >
        <div className={clsx("absolute inset-0 p-5 backface-hidden")}>
          {front}
        </div>
        <div className={clsx("absolute inset-0 p-5 rotate-y-180 backface-hidden")}>
          {back}
        </div>
      </button>

      <style jsx>{`
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
