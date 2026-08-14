"use client";

import { useRef } from "react";
import { gsap } from "gsap";

interface ServiceRowProps {
  number: string;
  title: string;
  description: string;
}

export default function ServiceRow({
  number,
  title,
  description,
}: ServiceRowProps) {
  const rowRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  const handleEnter = () => {
    if (
      !rowRef.current ||
      !lineRef.current ||
      !titleRef.current ||
      !arrowRef.current
    ) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    gsap.killTweensOf([
      rowRef.current,
      lineRef.current,
      titleRef.current,
      arrowRef.current,
    ]);

    /*
     * Reference 3D tilt starts with a very fast
     * transition so the card follows the cursor.
     */
    gsap.set(rowRef.current, {
      transformPerspective: 700,
      transformStyle: "preserve-3d",
    });

    gsap.to(lineRef.current, {
      scaleX: 1,
      duration: 0.6,
      ease: "power3.out",
    });

    gsap.to(arrowRef.current, {
      x: 5,
      y: -5,
      duration: 0.45,
      ease: "power3.out",
    });

    gsap.to(titleRef.current, {
      x: 8,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const handleMove = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    const row = rowRef.current;

    if (!row) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const rect = row.getBoundingClientRect();

    /*
     * Cursor position normalized to -0.5 → 0.5.
     */
    const x =
      (event.clientX - rect.left) / rect.width - 0.5;

    const y =
      (event.clientY - rect.top) / rect.height - 0.5;

    /*
     * Same core math as the reference 3D tilt.
     */
    gsap.to(row, {
      rotateY: x * 10,
      rotateX: -y * 10,
      scale: 1.015,
      duration: 0.12,
      ease: "none",
      overwrite: true,
    });
  };

  const handleLeave = () => {
    if (
      !rowRef.current ||
      !lineRef.current ||
      !titleRef.current ||
      !arrowRef.current
    ) {
      return;
    }

    gsap.killTweensOf([
      rowRef.current,
      lineRef.current,
      titleRef.current,
      arrowRef.current,
    ]);

    /*
     * Reference-style smooth reset.
     */
    gsap.to(rowRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: "power3.out",
      clearProps: "transform",
    });

    gsap.to(lineRef.current, {
      scaleX: 0,
      duration: 0.45,
      ease: "power3.inOut",
    });

    gsap.to(titleRef.current, {
      x: 0,
      duration: 0.4,
      ease: "power3.out",
    });

    gsap.to(arrowRef.current, {
      x: 0,
      y: 0,
      duration: 0.35,
      ease: "power3.out",
    });
  };

  return (
    <article
      ref={rowRef}
      className="group relative border-b border-[var(--mm-border)] transform-gpu"
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="grid gap-6 py-7 md:grid-cols-[80px_1fr_1fr_auto] md:items-center md:py-9">
        <span className="mm-mono text-xs text-white/35">
          {number}
        </span>

        <h3
          ref={titleRef}
          className="font-[var(--font-inter-tight)] text-[clamp(2.5rem,5vw,5.5rem)] font-extrabold uppercase leading-none tracking-[-0.06em]"
        >
          {title}
        </h3>

        <p className="max-w-sm text-sm leading-relaxed text-white/40 md:text-base">
          {description}
        </p>

        <span
          ref={arrowRef}
          aria-hidden="true"
          className="relative hidden h-10 w-10 text-[var(--mm-accent)] md:block"
        >
          <span className="absolute right-0.5 top-0.5 h-px w-10 origin-right -translate-y-1/2 rotate-[-45deg] bg-current" />

          <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-current" />
        </span>
      </div>

      <div
        ref={lineRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[var(--mm-accent)]"
      />
    </article>
  );
}