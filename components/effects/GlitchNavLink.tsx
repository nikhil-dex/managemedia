"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";

interface GlitchNavLinkProps {
  children: React.ReactNode;
  href: string;
}

export default function GlitchNavLink({
  children,
  href,
}: GlitchNavLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const accentRef = useRef<HTMLSpanElement>(null);
  const glitchRef = useRef<HTMLSpanElement>(null);

  const shouldAnimate = () =>
    !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  const handleEnter = () => {
    if (!shouldAnimate()) return;

    const text = textRef.current;
    const accent = accentRef.current;
    const glitch = glitchRef.current;

    if (!text || !accent || !glitch) return;

    gsap.killTweensOf([text, accent, glitch]);

    const timeline = gsap.timeline();

    // Main text: short digital displacement.
    timeline
      .to(text, {
        x: -3,
        skewX: -8,
        duration: 0.05,
        ease: "steps(1)",
      })
      .to(text, {
        x: 4,
        skewX: 6,
        duration: 0.05,
        ease: "steps(1)",
      })
      .to(text, {
        x: -2,
        skewX: -3,
        duration: 0.05,
        ease: "steps(1)",
      })
      .to(text, {
        x: 0,
        skewX: 0,
        duration: 0.12,
        ease: "power2.out",
      });

    // Retro ghost layer.
    gsap.fromTo(
      glitch,
      {
        x: -3,
        y: 0,
        opacity: 0,
        clipPath: "inset(0 100% 0 0)",
      },
      {
        x: 3,
        y: 0,
        opacity: 0.65,
        clipPath: "inset(0 0% 0 0)",
        duration: 0.08,
        ease: "steps(1)",
        yoyo: true,
        repeat: 3,
      }
    );

    // Green accent line.
    gsap.fromTo(
      accent,
      {
        scaleX: 0,
        opacity: 0,
      },
      {
        scaleX: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power3.out",
      }
    );
  };

  const handleLeave = () => {
    if (!shouldAnimate()) return;

    const text = textRef.current;
    const accent = accentRef.current;
    const glitch = glitchRef.current;

    if (!text || !accent || !glitch) return;

    gsap.killTweensOf([text, accent, glitch]);

    gsap.to(text, {
      x: 0,
      skewX: 0,
      duration: 0.18,
      ease: "power2.out",
    });

    gsap.to(glitch, {
      opacity: 0,
      x: 0,
      duration: 0.12,
      ease: "power2.out",
    });

    gsap.to(accent, {
      scaleX: 0,
      opacity: 0,
      duration: 0.25,
      ease: "power3.inOut",
    });
  };

  return (
    <Link
      ref={linkRef}
      href={href}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group relative py-2 font-[var(--font-inter)] text-sm font-medium"
    >
      <span
        ref={textRef}
        className="relative z-10 block"
      >
        {children}
      </span>

      {/* Retro glitch ghost */}
      <span
        ref={glitchRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-2 z-0 block text-[var(--mm-accent)] opacity-0"
      >
        {children}
      </span>

      {/* Accent line */}
      <span
        ref={accentRef}
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[var(--mm-accent)] opacity-0"
      />
    </Link>
  );
}