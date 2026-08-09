"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ServicesAnimationProps {
  children: React.ReactNode;
}

export default function ServicesAnimation({
  children,
}: ServicesAnimationProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      return;
    }

    const context = gsap.context(() => {
      const section = root.querySelector("#services");

      if (!section) {
        return;
      }

      const metadata = section.querySelector("[data-services-meta]");
      const heading = section.querySelector("[data-services-heading]");
      const intro = section.querySelector("[data-services-intro]");

      const rows = section.querySelectorAll("article");
      const closing = section.querySelector("[data-services-closing]");

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          once: true,
        },
        defaults: {
          ease: "power3.out",
        },
      });

      if (metadata) {
        timeline.fromTo(
          metadata,
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
          }
        );
      }

      if (heading) {
        timeline.fromTo(
          heading,
          {
            y: 60,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
          },
          "-=0.25"
        );
      }

      if (intro) {
        timeline.fromTo(
          intro,
          {
            y: 25,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
          },
          "-=0.55"
        );
      }

      if (rows.length) {
        timeline.fromTo(
          rows,
          {
            y: 35,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.1,
          },
          "-=0.2"
        );
      }

      if (closing) {
        timeline.fromTo(
          closing,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
          },
          "-=0.25"
        );
      }
    }, root);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="contents">
      {children}
    </div>
  );
}