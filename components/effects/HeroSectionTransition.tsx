"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSectionTransition() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      return;
    }

    const context = gsap.context(() => {
      const line = root.querySelector("[data-transition-line]");
      const marker = root.querySelector("[data-transition-marker]");

      if (!line || !marker) {
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      timeline.fromTo(
        line,
        {
          scaleX: 0.15,
          opacity: 0.25,
        },
        {
          scaleX: 1,
          opacity: 0.8,
          ease: "none",
        }
      );

      timeline.fromTo(
        marker,
        {
          x: "-20%",
          opacity: 0.25,
        },
        {
          x: "20%",
          opacity: 1,
          ease: "none",
        },
        0
      );
    }, root);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-0 z-20 w-full overflow-hidden"
    >
      <div className="relative h-8 w-full">
        <div
          data-transition-line
          className="absolute bottom-3 left-0 h-px w-full origin-left bg-[var(--mm-accent)]"
        />

        <div
          data-transition-marker
          className="absolute bottom-3 left-0 h-1 w-1 rounded-full bg-[var(--mm-accent)]"
        />
      </div>
    </div>
  );
}