"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FooterAnimationProps {
  children: React.ReactNode;
}

export default function FooterAnimation({
  children,
}: FooterAnimationProps) {
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
      const cta = root.querySelector("[data-footer-cta]");
      const label = root.querySelector("[data-footer-label]");
      const arrow = root.querySelector("[data-footer-arrow]");
      const info = root.querySelectorAll("[data-footer-info]");
      const bottom = root.querySelector("[data-footer-bottom]");

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 82%",
          once: true,
        },
        defaults: {
          ease: "power4.out",
        },
      });

      if (label) {
        timeline.fromTo(
          label,
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
          }
        );
      }

      if (cta) {
        timeline.fromTo(
          cta,
          {
            yPercent: 35,
            opacity: 0,
            clipPath: "inset(0 0 100% 0)",
          },
          {
            yPercent: 0,
            opacity: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 1,
          },
          "-=0.35"
        );
      }

      if (arrow) {
        timeline.fromTo(
          arrow,
          {
            x: -20,
            y: 20,
            opacity: 0,
            rotate: -20,
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 0.65,
          },
          "-=0.55"
        );
      }

      if (info.length) {
        timeline.fromTo(
          info,
          {
            y: 25,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.08,
          },
          "-=0.25"
        );
      }

      if (bottom) {
        timeline.fromTo(
          bottom,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.5,
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