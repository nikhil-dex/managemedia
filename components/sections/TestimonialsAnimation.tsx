"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TestimonialsAnimationProps {
  children: React.ReactNode;
}

export default function TestimonialsAnimation({
  children,
}: TestimonialsAnimationProps) {
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
      const section = root.querySelector("#testimonials");

      if (!section) {
        return;
      }

      const metadata = section.querySelector(
        "[data-testimonials-meta]"
      );
      const label = section.querySelector(
        "[data-testimonials-label]"
      );
      const quote = section.querySelector("blockquote");
      const author = section.querySelector(
        "[data-testimonials-author]"
      );
      const controls = section.querySelector(
        "[data-testimonials-controls]"
      );

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
          "-=0.25"
        );
      }

      if (quote) {
        timeline.fromTo(
          quote,
          {
            y: 55,
            opacity: 0,
            clipPath: "inset(0 0 100% 0)",
          },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.9,
          },
          "-=0.3"
        );
      }

      if (author) {
        timeline.fromTo(
          author,
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
          },
          "-=0.45"
        );
      }

      if (controls) {
        timeline.fromTo(
          controls,
          {
            y: 15,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
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