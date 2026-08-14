"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
  const testimonialRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
const dragX = useRef(0);
const isDragging = useRef(false);
const autoSwitchRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const isHovered = useRef(false);

  const testimonial = testimonials[active];
const changeTestimonial = useCallback((nextIndex: number) => {
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
  if (autoSwitchRef.current) {
  clearTimeout(autoSwitchRef.current);
  autoSwitchRef.current = null;
}

  const quote = quoteRef.current;
  const author = authorRef.current;

  gsap.killTweensOf([quote, author]);

  const timeline = gsap.timeline({
    onComplete: () => {
      isAnimating.current = false;
    },
  });

  /*
   * EXIT
   * Stronger than the existing simple fade.
   */
  timeline
    .to(
      quote,
      {
        x: -80,
        y: -20,
        skewX: -5,
        opacity: 0,
        clipPath: "inset(0 100% 0 0)",
        duration: 0.38,
        ease: "power3.in",
      }
    )
    .to(
      author,
      {
        x: -30,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      },
      "-=0.22"
    )

    /*
     * Change the testimonial only after
     * the previous one has disappeared.
     */
    .add(() => {
      setActive(nextIndex);
    })

    /*
     * Prepare incoming content.
     */
    .set(quote, {
      x: 80,
      y: 20,
      skewX: 5,
      opacity: 0,
      clipPath: "inset(0 0 0 100%)",
    })
    .set(author, {
      x: 30,
      opacity: 0,
    })

    /*
     * ENTER
     */
    .to(quote, {
      x: 0,
      y: 0,
      skewX: 0,
      opacity: 1,
      clipPath: "inset(0 0 0 0%)",
      duration: 0.65,
      ease: "power4.out",
    })
    .to(
      author,
      {
        x: 0,
        opacity: 1,
        duration: 0.45,
        ease: "power3.out",
      },
      "-=0.35"
    );
}, [active]);

const restartAutoSwitch = () => {
  if (
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {
    return;
  }

  if (isHovered.current || document.hidden) {
    return;
  }

  if (autoSwitchRef.current) {
    clearTimeout(autoSwitchRef.current);
  }

  autoSwitchRef.current = setTimeout(() => {
    if (
      !isHovered.current &&
      !document.hidden &&
      !isAnimating.current
    ) {
      changeTestimonial(
        (active + 1) % testimonials.length
      );
    }
  }, 5000);
};

useEffect(() => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) {
    return;
  }

  const scheduleNext = () => {
    if (autoSwitchRef.current) {
      clearTimeout(autoSwitchRef.current);
    }

    if (
      isHovered.current ||
      document.hidden
    ) {
      return;
    }

    autoSwitchRef.current = setTimeout(() => {
      if (
        !isHovered.current &&
        !document.hidden &&
        !isAnimating.current
      ) {
        changeTestimonial(
          (active + 1) % testimonials.length
        );
      }

      scheduleNext();
    }, 5000);
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      if (autoSwitchRef.current) {
        clearTimeout(autoSwitchRef.current);
        autoSwitchRef.current = null;
      }

      return;
    }

    scheduleNext();
  };

  document.addEventListener(
    "visibilitychange",
    handleVisibilityChange
  );

  scheduleNext();

  return () => {
    document.removeEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    if (autoSwitchRef.current) {
      clearTimeout(autoSwitchRef.current);
      autoSwitchRef.current = null;
    }
  };
}, [active, changeTestimonial]);

const handlePointerDown = (
  event: React.PointerEvent<HTMLDivElement>
) => {
  if (
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {
    return;
  }

  if (isAnimating.current) {
    return;
  }

  isDragging.current = true;
  dragStartX.current = event.clientX;
  dragX.current = 0;

  event.currentTarget.setPointerCapture(
    event.pointerId
  );

  if (autoSwitchRef.current) {
    clearTimeout(autoSwitchRef.current);
    autoSwitchRef.current = null;
  }

  if (quoteRef.current) {
    gsap.killTweensOf(quoteRef.current);
  }
};

const handlePointerMove = (
  event: React.PointerEvent<HTMLDivElement>
) => {
  if (
    !isDragging.current ||
    !quoteRef.current
  ) {
    return;
  }

  dragX.current =
    event.clientX - dragStartX.current;

  const limitedX = Math.max(
    -180,
    Math.min(180, dragX.current)
  );

  const resistance =
    Math.abs(limitedX) > 100
      ? 0.65
      : 0.85;

  const x = limitedX * resistance;

  gsap.set(quoteRef.current, {
    x,
    skewX: x * -0.025,
    opacity:
      1 -
      Math.min(
        Math.abs(x) / 500,
        0.28
      ),
  });
};

const handlePointerUp = (
  event: React.PointerEvent<HTMLDivElement>
) => {
  if (
    !isDragging.current ||
    !quoteRef.current
  ) {
    return;
  }

  isDragging.current = false;

  try {
    event.currentTarget.releasePointerCapture(
      event.pointerId
    );
  } catch {
    // Pointer capture may already be released.
  }

  const threshold = 90;
  const distance = dragX.current;

  if (Math.abs(distance) >= threshold) {
    if (distance < 0) {
      changeTestimonial(
        (active + 1) % testimonials.length
      );
    } else {
      changeTestimonial(
        (active - 1 + testimonials.length) %
          testimonials.length
      );
    }

    return;
  }

  /*
   * Didn't drag far enough:
   * smoothly spring back.
   */
  gsap.to(quoteRef.current, {
    x: 0,
    skewX: 0,
    opacity: 1,
    duration: 0.55,
    ease: "elastic.out(1, 0.55)",
    onComplete: restartAutoSwitch,
  });
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
    ref={testimonialRef}
    onMouseEnter={() => {
      isHovered.current = true;

      if (autoSwitchRef.current) {
        clearTimeout(autoSwitchRef.current);
        autoSwitchRef.current = null;
      }
    }}
    onMouseLeave={() => {
      isHovered.current = false;
      restartAutoSwitch();
    }}
    onFocus={() => {
      isHovered.current = true;

      if (autoSwitchRef.current) {
        clearTimeout(autoSwitchRef.current);
        autoSwitchRef.current = null;
      }
    }}
    onBlur={() => {
      isHovered.current = false;
      restartAutoSwitch();
    }}
    onPointerDown={handlePointerDown}
  onPointerMove={handlePointerMove}
  onPointerUp={handlePointerUp}
  onPointerCancel={handlePointerUp}
  style={{
    touchAction: "pan-y",
    cursor: "grab",
  }}
  >
    <div
      key={active}
      className="min-h-[280px] overflow-hidden select-none"
    >
      <blockquote
        ref={quoteRef}
        className="font-[var(--font-inter-tight)] text-[clamp(2.5rem,5.5vw,6rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.065em]"
      >
        “{testimonial.quote}”
      </blockquote>

      <div
        ref={authorRef}
        data-testimonials-author
        className="mt-12 border-t border-[var(--mm-border)] pt-5"
      >
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
      className="mt-12 flex items-center justify-between border-t border-[var(--mm-border)] pt-5"
    >
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
</div>
      </Container>
    </section>
    </TestimonialsAnimation>
  );
}