"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AboutIntroAnimationProps {
  children: React.ReactNode;
}

export default function AboutIntroAnimation({
  children,
}: AboutIntroAnimationProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const context = gsap.context(() => {
      const section = root.closest("section");

      if (!section) return;

      const meta = section.querySelector(
        "[data-about-meta]"
      );

      const label = section.querySelector(
        "[data-about-label]"
      );

      

      const titleLines = section.querySelectorAll(
        "[data-about-line]"
      );

      const content = section.querySelector(
        "[data-about-content]"
      );

      const items = section.querySelectorAll(
        "[data-about-item]"
      );

      /*
       * Initial state
       */

      gsap.set(
        [meta, label, content, ...Array.from(items)],
        {
          opacity: 0,
          y: 24,
        }
      );

      gsap.set(titleLines, {
        opacity: 0,
        x: (index) =>
          index % 2 === 0 ? 110 : -110,
        skewX: (index) =>
          index % 2 === 0 ? -5 : 5,
      });

      /*
       * Entrance animation
       */

      const entrance = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      entrance
        .to(meta, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        })
        .to(
          label,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.25"
        )
        .to(
          titleLines,
          {
            opacity: 1,
            x: 0,
            skewX: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "power4.out",
          },
          "-=0.2"
        )
        .to(
          content,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.35"
        )
        .to(
          items,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.3"
        );

      /*
       * Scroll-driven title movement
       *
       * This is the new reference-style effect.
       */
/*
 * Scroll-driven title movement
 *
 * Desktop only.
 * On mobile the title stays centered so it
 * cannot create horizontal overflow.
 */

const mm = gsap.matchMedia();

mm.add("(min-width: 768px)", () => {
  const scrollTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });

  scrollTimeline
    .to(
      titleLines[0],
      {
        x: 70,
        rotation: 0.6,
        ease: "none",
      },
      0
    )
    .to(
      titleLines[1],
      {
        x: -55,
        rotation: -0.5,
        ease: "none",
      },
      0
    )
    .to(
      titleLines[2],
      {
        x: 80,
        rotation: 0.7,
        ease: "none",
      },
      0
    );
});
    }, root);

    return () => {
      context.revert();
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}