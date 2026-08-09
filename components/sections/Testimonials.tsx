"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import Container from "@/components/layout/Container";
import TestimonialsAnimation from "./TestimonialsAnimation";


const testimonials = [
  {
    quote:
      "ManageMedia has been a fantastic partner in helping us define and optimize our digital objectives at ACMA",
    name: "Ankita Dasgupta",
    role: "Marketing Manager, Teamwork Arts",
  },
  {
    quote:
      "As a marketer if I have a story, they are the best story tellers. They make your story heard & understood.",
    name: "Harkaran Malhotra",
    role: "Deputy Director, ACMA",
  },
  {
    quote:
      "It is reassuring to work with people who treat your properties as their own and think pro-actively",
    name: "Gaurav Sandilya",
    role: "S.R. Overseas",
  },
];

export default function Testimonials() {
const quoteRef = useRef<HTMLQuoteElement>(null);
const authorRef = useRef<HTMLDivElement>(null);
const isAnimating = useRef(false);
  const [active, setActive] = useState(0);

  const testimonial = testimonials[active];
  const changeTestimonial = (nextIndex: number) => {
  if (
    isAnimating.current ||
    nextIndex === active ||
    !quoteRef.current ||
    !authorRef.current
  ) {
    return;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) {
    setActive(nextIndex);
    return;
  }

  isAnimating.current = true;

  const timeline = gsap.timeline({
    onComplete: () => {
      isAnimating.current = false;
    },
  });

  timeline
    .to(
      [quoteRef.current, authorRef.current],
      {
        y: -30,
        opacity: 0,
        duration: 0.35,
        stagger: 0.04,
        ease: "power3.in",
      }
    )
    .add(() => {
      setActive(nextIndex);
    })
    .fromTo(
      [quoteRef.current, authorRef.current],
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.06,
        ease: "power4.out",
      }
    );
};

  return (
    <TestimonialsAnimation>
      <section
        id="testimonials"
        className="relative z-10 overflow-hidden border-t border-[var(--mm-border)] py-24 md:py-32 lg:py-40"
      >
        <Container>
        <div
        data-testimonials-meta
        className="mb-16 flex items-start justify-between md:mb-24">
          <span className="mm-mono text-white/45">
            Clients / 004
          </span>

          <span className="mm-mono text-right text-white/35">
            What they say
            <br />
            About ManageMedia
          </span>
        </div>

        <div className="grid gap-16 lg:grid-cols-[0.7fr_2fr] lg:gap-24">
          {/* Label */}
          <div>
            <p 
            data-testimonials-label
            className="mm-mono text-[var(--mm-accent)]">
              Testimonials
            </p>
          </div>

          {/* Testimonial */}
          <div>
            <div
              key={active}
              className="min-h-[280px] overflow-hidden"
            >
              <blockquote
              ref={quoteRef}
              className="font-[var(--font-inter-tight)] text-[clamp(2.5rem,5.5vw,6rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.065em]">
                “{testimonial.quote}”
              </blockquote>

              <div
              ref={authorRef}
              data-testimonials-author
              className="mt-12 border-t border-[var(--mm-border)] pt-5">
                <p className="font-[var(--font-inter)] text-sm font-medium uppercase tracking-[0.06em]">
                  {testimonial.name}
                </p>

                <p className="mt-1 text-sm text-white/40">
                  {testimonial.role}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div
            data-testimonials-controls
            className="mt-12 flex items-center justify-between border-t border-[var(--mm-border)] pt-5">
              <span className="mm-mono text-xs text-white/35">
                0{active + 1} / 0{testimonials.length}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous testimonial"
                  onClick={() =>
                    changeTestimonial(
                      (active - 1 + testimonials.length) %
                        testimonials.length
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center border border-white/15 text-white/60 transition-colors duration-300 hover:border-[var(--mm-accent)] hover:text-[var(--mm-accent)]"
                >
                  ←
                </button>

                <button
                  type="button"
                  aria-label="Next testimonial"
                  onClick={() =>
                    changeTestimonial(
                      (active + 1) % testimonials.length
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center border border-white/15 text-white/60 transition-colors duration-300 hover:border-[var(--mm-accent)] hover:text-[var(--mm-accent)]"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
    </TestimonialsAnimation>
  );
}