"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";

interface GlitchNavLinkProps {
  children: React.ReactNode;
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*";

export default function GlitchNavLink({
  children,
  href,
  onClick,
}: GlitchNavLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const ghostARef = useRef<HTMLSpanElement>(null);
  const ghostBRef = useRef<HTMLSpanElement>(null);
  const scanlineRef = useRef<HTMLSpanElement>(null);
  const patternRef = useRef<HTMLSpanElement>(null);
  const accentRef = useRef<HTMLSpanElement>(null);

  const scrambleRef = useRef<number | null>(null);

  const canAnimate = () => {
    return !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  };

  const scrambleText = () => {
    const text = textRef.current;

    if (!text || !canAnimate()) {
      return;
    }

    const original = String(children);
    const start = performance.now();
    const duration = 380;

    if (scrambleRef.current) {
      cancelAnimationFrame(scrambleRef.current);
    }

    const animate = (now: number) => {
      const progress = Math.min(
        (now - start) / duration,
        1
      );

      const resolved = Math.floor(
        progress * original.length
      );

      let output = "";

      for (let i = 0; i < original.length; i++) {
        if (original[i] === " ") {
          output += " ";
          continue;
        }

        if (i < resolved) {
          output += original[i];
        } else {
          output +=
            SCRAMBLE_CHARS[
              Math.floor(
                Math.random() *
                  SCRAMBLE_CHARS.length
              )
            ];
        }
      }

      text.textContent = output;

      if (progress < 1) {
        scrambleRef.current =
          requestAnimationFrame(animate);
      } else {
        text.textContent = original;
        scrambleRef.current = null;
      }
    };

    scrambleRef.current =
      requestAnimationFrame(animate);
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

    scrambleText();

    gsap.killTweensOf([
      text,
      ghostA,
      ghostB,
      scanline,
      pattern,
      accent,
    ]);

    /*
     * Main glitch displacement
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
     * Ghost layer A
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

    /*
     * Ghost layer B
     */
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
    if (scrambleRef.current) {
      cancelAnimationFrame(scrambleRef.current);
      scrambleRef.current = null;
    }

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

    if (textRef.current) {
      textRef.current.textContent = String(children);
    }

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
  onClick={onClick}
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

      <span
        ref={ghostARef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 block text-[var(--mm-accent)] opacity-0"
      >
        {children}
      </span>

      <span
        ref={ghostBRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 block text-white opacity-0"
      >
        {children}
      </span>

      <span
        ref={scanlineRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-30 h-px bg-[var(--mm-accent)] opacity-0"
      />

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

      <span
        ref={accentRef}
        aria-hidden="true"
        className="absolute bottom-0 left-0 z-40 h-px w-full origin-left scale-x-0 bg-[var(--mm-accent)] opacity-0"
      />
    </Link>
  );
}