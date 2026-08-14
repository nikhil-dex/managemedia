"use client";

import {
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import gsap from "gsap";

interface ServicesPageAnimationProps {
  children: ReactNode;
}

export default function ServicesPageAnimation({
  children,
}: ServicesPageAnimationProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const intro = root.querySelector(
        "[data-services-page-intro]"
      );

      const title = root.querySelector(
        "[data-services-page-title]"
      );

      const copy = root.querySelector(
        "[data-services-page-copy]"
      );

      const tabs = root.querySelector(
        "[data-services-page-tabs]"
      );

      const tl = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      if (intro) {
        tl.fromTo(
          intro,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          }
        );
      }

      if (title) {
        tl.fromTo(
          title,
          {
            opacity: 0,
            y: 80,
            skewY: 2,
          },
          {
            opacity: 1,
            y: 0,
            skewY: 0,
            duration: 1,
          },
          "-=0.4"
        );
      }

      if (copy) {
        tl.fromTo(
          copy,
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=0.6"
        );
      }

      if (tabs) {
        tl.fromTo(
          tabs,
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.3"
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef}>
      {children}
    </div>
  );
}