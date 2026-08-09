"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface WorkAnimationProps {
  children: React.ReactNode;
}

export default function WorkAnimation({
  children,
}: WorkAnimationProps) {
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
      const section = root.querySelector("#work");

      if (!section) {
        return;
      }

      const metadata = section.querySelector("[data-work-meta]");
      const label = section.querySelector("[data-work-label]");
      const heading = section.querySelector("[data-work-heading]");
      const panel = section.querySelector("[data-work-panel]");
      const cta = section.querySelector("[data-work-cta]");

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          once: true,
        },
        defaults: {
          ease: "power3.out",
        },
      });

      if (metadata) {
        timeline.fromTo(
          metadata,
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
          }
        );
      }

      if (label) {
        timeline.fromTo(
          label,
          {
            y: 25,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
          },
          "-=0.3"
        );
      }

      if (heading) {
        timeline.fromTo(
          heading,
          {
            y: 70,
            opacity: 0,
            clipPath: "inset(0 0 100% 0)",
          },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.9,
          },
          "-=0.35"
        );
      }

      if (panel) {
        timeline.fromTo(
          panel,
          {
            y: 45,
            opacity: 0,
            scale: 0.98,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
          },
          "-=0.35"
        );
      }

      if (cta) {
        timeline.fromTo(
          cta,
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
          },
          "-=0.25"
        );
      }
    }, root);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="contents">
      {children}
    </div>
  );
}