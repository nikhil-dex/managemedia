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
  const ghostARef = useRef<HTMLSpanElement>(null);
  const ghostBRef = useRef<HTMLSpanElement>(null);
  const scanlineRef = useRef<HTMLSpanElement>(null);
  const patternRef = useRef<HTMLSpanElement>(null);
  const accentRef = useRef<HTMLSpanElement>(null);

  const canAnimate = () => {
    return !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  };

  const handleEnter = () => {
    if (!canAnimate()) return;

    const text = textRef.current;
    const ghostA = ghostARef.current;
    const ghostB = ghostBRef.current;
    const scanline = scanlineRef.current;
    const pattern = patternRef.current;
    const accent = accentRef.current;

    if (
      !text ||
      !ghostA ||
      !ghostB ||
      !scanline ||
      !pattern ||
      !accent
    ) {
      return;
    }

    gsap.killTweensOf([
      text,
      ghostA,
      ghostB,
      scanline,
      pattern,
      accent,
    ]);

    /*
     * Main text displacement
     */
    const textTimeline = gsap.timeline();

    textTimeline
      .to(text, {
        x: -3,
        skewX: -8,
        duration: 0.045,
        ease: "steps(1)",
      })
      .to(text, {
        x: 4,
        skewX: 7,
        duration: 0.045,
        ease: "steps(1)",
      })
      .to(text, {
        x: -2,
        skewX: -4,
        duration: 0.045,
        ease: "steps(1)",
      })
      .to(text, {
        x: 2,
        skewX: 2,
        duration: 0.045,
        ease: "steps(1)",
      })
      .to(text, {
        x: 0,
        skewX: 0,
        duration: 0.16,
        ease: "power2.out",
      });

    /*
     * Ghost displacement layers
     */
    gsap.fromTo(
      ghostA,
      {
        x: -5,
        opacity: 0,
        clipPath: "inset(0 100% 0 0)",
      },
      {
        x: 4,
        opacity: 0.55,
        clipPath: "inset(0 0% 0 0)",
        duration: 0.08,
        ease: "steps(1)",
        repeat: 4,
        yoyo: true,
      }
    );

    gsap.fromTo(
      ghostB,
      {
        x: 5,
        opacity: 0,
        clipPath: "inset(0 0 0 100%)",
      },
      {
        x: -4,
        opacity: 0.35,
        clipPath: "inset(0 0 0 0%)",
        duration: 0.065,
        ease: "steps(1)",
        repeat: 3,
        yoyo: true,
      }
    );

    /*
     * Scanline sweep
     */
    gsap.fromTo(
      scanline,
      {
        yPercent: -120,
        opacity: 0,
      },
      {
        yPercent: 120,
        opacity: 0.7,
        duration: 0.42,
        ease: "none",
      }
    );

    /*
     * Repeating scanline pattern
     */
    gsap.fromTo(
      pattern,
      {
        backgroundPositionY: "0px",
        opacity: 0,
      },
      {
        backgroundPositionY: "12px",
        opacity: 0.45,
        duration: 0.18,
        ease: "none",
        repeat: 4,
      }
    );

    /*
     * Green accent
     */
    gsap.fromTo(
      accent,
      {
        scaleX: 0,
        opacity: 0,
      },
      {
        scaleX: 1,
        opacity: 1,
        duration: 0.28,
        ease: "power3.out",
      }
    );
  };

  const handleLeave = () => {
    const elements = [
      textRef.current,
      ghostARef.current,
      ghostBRef.current,
      scanlineRef.current,
      patternRef.current,
      accentRef.current,
    ];

    gsap.killTweensOf(elements);

    if (!canAnimate()) return;

    gsap.to(textRef.current, {
      x: 0,
      skewX: 0,
      duration: 0.18,
      ease: "power2.out",
    });

    gsap.to(
      [
        ghostARef.current,
        ghostBRef.current,
        scanlineRef.current,
        patternRef.current,
      ],
      {
        opacity: 0,
        duration: 0.12,
        ease: "power2.out",
      }
    );

    gsap.to(accentRef.current, {
      scaleX: 0,
      opacity: 0,
      duration: 0.22,
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
        className="relative z-20 block"
      >
        {children}
      </span>

      {/* Ghost layer A */}
      <span
        ref={ghostARef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 block text-[var(--mm-accent)] opacity-0"
      >
        {children}
      </span>

      {/* Ghost layer B */}
      <span
        ref={ghostBRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 block text-white opacity-0"
      >
        {children}
      </span>

      {/* Scanline */}
      <span
        ref={scanlineRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-30 h-px bg-[var(--mm-accent)] opacity-0"
      />

      {/* Scanline pattern */}
      <span
        ref={patternRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 opacity-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(217,255,0,0.18) 4px)",
          backgroundSize: "100% 8px",
        }}
      />

      {/* Accent underline */}
      <span
        ref={accentRef}
        aria-hidden="true"
        className="absolute bottom-0 left-0 z-40 h-px w-full origin-left scale-x-0 bg-[var(--mm-accent)] opacity-0"
      />
    </Link>
  );
}