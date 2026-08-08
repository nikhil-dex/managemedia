"use client";

import {
  useLayoutEffect,
  useRef,
} from "react";

import { gsap } from "gsap";

interface HeroIntroAnimationProps {
  children: React.ReactNode;
}

export default function HeroIntroAnimation({
  children,
}: HeroIntroAnimationProps) {
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
      const timeline = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      timeline.fromTo(
        "[data-hero-meta]",
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
        }
      );

      timeline.fromTo(
        "[data-hero-description]",
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
        },
        "-=0.4"
      );

timeline.fromTo(
  "[data-hero-title]",
  {
    yPercent: 45,
    opacity: 0,
  },
  {
    yPercent: 0,
    opacity: 1,
    duration: 1.15,
    stagger: 0.1,
    ease: "power4.out",
  },
  "-=0.45"
);

      timeline.fromTo(
        "[data-hero-bottom]",
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
        },
        "-=0.5"
      );
    }, root);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="contents"
    >
      {children}
    </div>
  );
}