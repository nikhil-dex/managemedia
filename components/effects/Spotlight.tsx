"use client";

import { useEffect, useRef } from "react";

interface SpotlightProps {
  className?: string;
}

export default function Spotlight({
  className = "",
}: SpotlightProps) {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spotlight = spotlightRef.current;

    if (!spotlight) return;

    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );

    if (!finePointer.matches) return;

    let frame = 0;
    let mouseX = -200;
    let mouseY = -200;
    let currentX = mouseX;
    let currentY = mouseY;

    const move = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const render = () => {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;

      spotlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

      frame = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", move);
    frame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={spotlightRef}
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-20 hidden h-72 w-72 rounded-full md:block ${className}`}
      style={{
        background:
          "radial-gradient(circle, rgba(217,255,0,0.12) 0%, rgba(217,255,0,0.055) 28%, rgba(217,255,0,0) 70%)",
        filter: "blur(2px)",
        mixBlendMode: "screen",
      }}
    />
  );
}