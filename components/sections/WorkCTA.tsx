"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import Magnetic from "@/components/effects/Magnetic";

const PROJECTS_URL =
  "https://linktr.ee/Managemedia.in?utm_source=linktree_profile_share";

export default function WorkCTA() {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const handleEnter = () => {
    if (
      !linkRef.current ||
      !arrowRef.current ||
      !labelRef.current
    ) {
      return;
    }

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    gsap.killTweensOf([
      arrowRef.current,
      labelRef.current,
    ]);

    gsap.to(labelRef.current, {
      x: 8,
      duration: 0.4,
      ease: "power3.out",
    });

    gsap.to(arrowRef.current, {
      x: 6,
      y: -6,
      rotate: 8,
      duration: 0.45,
      ease: "power3.out",
    });
  };

  const handleLeave = () => {
    if (
      !arrowRef.current ||
      !labelRef.current
    ) {
      return;
    }

    gsap.killTweensOf([
      arrowRef.current,
      labelRef.current,
    ]);

    gsap.to(labelRef.current, {
      x: 0,
      duration: 0.35,
      ease: "power3.out",
    });

    gsap.to(arrowRef.current, {
      x: 0,
      y: 0,
      rotate: 0,
      duration: 0.35,
      ease: "power3.out",
    });
  };

  return (
    <a
      ref={linkRef}
      href={PROJECTS_URL}
      data-cursor
data-cursor-label="VIEW"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group flex w-fit items-center gap-5 font-[var(--font-inter)] text-sm font-medium uppercase tracking-[0.08em]"
    >
      <Magnetic>
        <span ref={labelRef}>
          View our work
        </span>
      </Magnetic>
      <span
        ref={arrowRef}
        aria-hidden="true"
        className="relative block h-10 w-10 text-[var(--mm-accent)]"
      >
        <span className="absolute right-0.5 top-0.5 h-px w-10 origin-right -translate-y-1/2 rotate-[-45deg] bg-current" />

        <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-current" />
      </span>
    </a>
  );
}