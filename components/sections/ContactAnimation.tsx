"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ContactAnimationProps {
  children: React.ReactNode;
}

export default function ContactAnimation({
  children,
}: ContactAnimationProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const context = gsap.context(() => {
      const section = root.querySelector("#contact");

      if (!section) return;

      const meta = section.querySelector("[data-contact-meta]");
      const label = section.querySelector("[data-contact-label]");
      const heading = section.querySelector("[data-contact-heading]");
      const links = section.querySelector("[data-contact-links]");
      const items = section.querySelectorAll("[data-contact-item]");
      const closing = section.querySelector("[data-contact-closing]");

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

      if (meta) {
        timeline.fromTo(
          meta,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 }
        );
      }

      if (label) {
        timeline.fromTo(
          label,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55 },
          "-=0.25"
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
          "-=0.3"
        );
      }

      if (links) {
        timeline.fromTo(
          links,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.35"
        );
      }

      if (items.length) {
        timeline.fromTo(
          items,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            stagger: 0.1,
          },
          "-=0.35"
        );
      }

      if (closing) {
        timeline.fromTo(
          closing,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55 },
          "-=0.2"
        );
      }
    }, root);

    return () => {
      context.revert();
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}