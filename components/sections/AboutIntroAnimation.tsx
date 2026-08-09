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

      const title = section.querySelector(
        "[data-about-title]"
      );

      const content = section.querySelector(
        "[data-about-content]"
      );

      const items = section.querySelectorAll(
        "[data-about-item]"
      );

      gsap.set(
        [meta, label, content, ...Array.from(items)],
        {
          opacity: 0,
          y: 24,
        }
      );

      if (title) {
        gsap.set(title, {
          opacity: 0,
          y: 60,
        });
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      timeline
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
          title,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
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
    }, root);

    return () => {
      context.revert();
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}