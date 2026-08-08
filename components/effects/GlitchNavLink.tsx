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


  const shouldAnimate = () =>
  !window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  const handleEnter = () => {
      if (!shouldAnimate()) return;
    if (!linkRef.current || !textRef.current || !accentRef.current) {
      return;
    }

    const text = textRef.current;
    const accent = accentRef.current;

    gsap.killTweensOf([text, accent]);

    const timeline = gsap.timeline();

    timeline
      .to(text, {
        x: -2,
        duration: 0.045,
        ease: "steps(1)",
      })
      .to(text, {
        x: 3,
        duration: 0.045,
        ease: "steps(1)",
      })
      .to(text, {
        x: -1,
        duration: 0.045,
        ease: "steps(1)",
      })
      .to(text, {
        x: 0,
        duration: 0.08,
        ease: "power2.out",
      });

    gsap.to(accent, {
      scaleX: 1,
      duration: 0.45,
      ease: "power3.out",
    });

    gsap.to(accent, {
      opacity: 1,
      duration: 0.08,
    });
  };


  const handleLeave = () => {
      if (!shouldAnimate()) return;
    if (!textRef.current || !accentRef.current) {
      return;
    }

    gsap.killTweensOf([
      textRef.current,
      accentRef.current,
    ]);

    gsap.to(textRef.current, {
      x: 0,
      duration: 0.2,
      ease: "power2.out",
    });

    gsap.to(accentRef.current, {
      scaleX: 0,
      duration: 0.35,
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
        className="relative block"
      >
        {children}
      </span>

      <span
        ref={accentRef}
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[var(--mm-accent)] opacity-0"
      />
    </Link>
  );
}