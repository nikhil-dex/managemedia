"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const label = labelRef.current;

    if (!cursor || !label) return;

    const isDesktop = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    if (!isDesktop) return;
    document.documentElement.style.cursor = "none";
document.body.style.cursor = "none";
document.documentElement.classList.add("custom-cursor-active");

    const handleMouseMove = (event: MouseEvent) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursor.style.opacity = "1";
    };

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      if (!target) return;

      const interactive = target.closest(
        "a, button, [data-cursor]"
      );

      if (!interactive) return;

      const cursorLabel =
        interactive.getAttribute("data-cursor-label");

      gsap.to(cursor, {
        scale: 2.5,
        duration: 0.3,
        ease: "power3.out",
        overwrite: true,
      });

      if (cursorLabel) {
        label.textContent = cursorLabel;

        gsap.to(label, {
          opacity: 1,
          duration: 0.2,
          overwrite: true,
        });
      }
    };

    const handleMouseOut = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      if (!target) return;

      const interactive = target.closest(
        "a, button, [data-cursor]"
      );

      if (!interactive) return;

      gsap.to(cursor, {
        scale: 1,
        duration: 0.25,
        ease: "power3.out",
        overwrite: true,
      });

      gsap.to(label, {
        opacity: 0,
        duration: 0.15,
        overwrite: true,
      });
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      cursor.style.opacity = "1";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    document.documentElement.addEventListener(
      "mouseleave",
      handleMouseLeave
    );

    document.documentElement.addEventListener(
      "mouseenter",
      handleMouseEnter
    );

    return () => {
         document.documentElement.style.cursor = "";
         document.body.style.cursor = "";
         document.documentElement.classList.remove("custom-cursor-active");
      document.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      document.removeEventListener(
        "mouseover",
        handleMouseOver
      );

      document.removeEventListener(
        "mouseout",
        handleMouseOut
      );

      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );

      document.documentElement.removeEventListener(
        "mouseenter",
        handleMouseEnter
      );
    };
  }, []);

   return (
    <>
  
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed z-[9999] flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--mm-accent)] mix-blend-difference"
    >
    <span
  ref={labelRef}
  className="absolute bottom-full left-1/2 mb-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.14em] text-fuchsia-500 opacity-0"
/>
    </div>
</>
  );

}