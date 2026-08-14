"use client";

import {
  useRef,
  type ReactNode,
  type MouseEvent,
} from "react";

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export default function Magnetic({
  children,
  strength = 14,
  className = "",
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    const element = ref.current;

    if (!element) return;

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    const rect = element.getBoundingClientRect();

    const x =
      event.clientX -
      (rect.left + rect.width / 2);

    const y =
      event.clientY -
      (rect.top + rect.height / 2);

    const moveX =
      (x / (rect.width / 2)) * strength;

    const moveY =
      (y / (rect.height / 2)) * strength;

    element.style.transform =
      `translate3d(${moveX}px, ${moveY}px, 0)`;
  };

  const handleLeave = () => {
    const element = ref.current;

    if (!element) return;

    element.style.transform =
      "translate3d(0, 0, 0)";
  };

  return (
    <div
      ref={ref}
      className={`transition-transform duration-500 ease-out will-change-transform ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}