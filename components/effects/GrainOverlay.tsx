"use client";

import { useEffect, useState } from "react";

export default function GrainOverlay() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const update = () => setReducedMotion(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[9999] overflow-hidden ${
        reducedMotion ? "opacity-[0.025]" : "opacity-[0.045]"
      }`}
    >
      <div className="mm-grain absolute -inset-[50%] h-[200%] w-[200%]" />
    </div>
  );
}