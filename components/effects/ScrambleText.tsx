"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

interface ScrambleTextProps {
  children: string;
  className?: string;
}

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*";

export default function ScrambleText({
  children,
  className = "",
}: ScrambleTextProps) {
  const [text, setText] = useState(children);
  const animationRef = useRef<number | null>(null);

  const scramble = () => {
    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const original = children;
    const start = performance.now();
    const duration = 650;

    const animate = (now: number) => {
      const progress = Math.min(
        (now - start) / duration,
        1
      );

      const resolved = Math.floor(
        progress * original.length
      );

      let next = "";

      for (let i = 0; i < original.length; i++) {
        if (i < resolved) {
          next += original[i];
        } else if (original[i] === " ") {
          next += " ";
        } else {
          next +=
            characters[
              Math.floor(
                Math.random() * characters.length
              )
            ];
        }
      }

      setText(next);

      if (progress < 1) {
        animationRef.current =
          requestAnimationFrame(animate);
      } else {
        setText(original);
        animationRef.current = null;
      }
    };

    animationRef.current =
      requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <span
      className={className}
      onMouseEnter={scramble}
    >
      {text}
    </span>
  );
}