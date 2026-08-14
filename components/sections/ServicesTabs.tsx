"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { serviceCategories } from "@/data/services";
import Container from "@/components/layout/Container";
import Magnetic from "@/components/effects/Magnetic";

export default function ServicesTabs() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openService, setOpenService] = useState<number | null>(0);
  const contentRef = useRef<HTMLDivElement>(null);
const indicatorRefs = useRef<(HTMLSpanElement | null)[]>([]);
const descriptionRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const category = serviceCategories[activeCategory];
  useEffect(() => {
  if (!contentRef.current) return;

  if (
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {
    return;
  }

  gsap.fromTo(
    contentRef.current,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.55,
      ease: "power3.out",
    }
  );
}, [activeCategory]);
useEffect(() => {
  indicatorRefs.current.forEach((indicator, index) => {
    if (!indicator) return;

    gsap.to(indicator, {
      width: index === activeCategory ? "100%" : "0%",
      duration: 0.45,
      ease: "power3.out",
    });
  });
}, [activeCategory]);
useEffect(() => {
  if (
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {
    return;
  }

  descriptionRefs.current.forEach((element, index) => {
    if (!element) return;

    gsap.to(element, {
      opacity:
        index === openService ? 1 : 0,
      y:
        index === openService ? 0 : 8,
      duration: 0.4,
      ease: "power3.out",
    });
  });
}, [openService]);
  return (
    <section 
    data-services-page-tabs
    className="relative overflow-hidden border-t border-[var(--mm-border)] py-24 md:py-32 lg:py-40">
      <Container>
        {/* Section header */}
        <div className="mb-16 md:mb-24">
          <div className="mb-6 flex items-center justify-between">
            <span className="mm-mono text-xs text-white/35">
              Services / 002
            </span>

            <span className="mm-mono hidden text-xs text-white/25 sm:block">
              {String(activeCategory + 1).padStart(2, "0")} /{" "}
              {String(serviceCategories.length).padStart(2, "0")}
            </span>
          </div>

          <h2 className="max-w-5xl font-[var(--font-inter-tight)] text-[clamp(3.5rem,9vw,9rem)] font-extrabold uppercase leading-[0.8] tracking-[-0.075em]">
            What
            <br />
            <span className="text-white/35">we do.</span>
          </h2>
        </div>

        {/* Category tabs */}
        <div className="border-y border-[var(--mm-border)]">
          <div className="flex overflow-x-auto scrollbar-none">
            {serviceCategories.map((item, index) => {
              const isActive = index === activeCategory;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(index);
                    setOpenService(0);
                  }}
                  className={[
                    "group relative shrink-0 px-5 py-5 text-left transition-colors duration-300 md:px-8",
                    isActive
                      ? "text-white"
                      : "text-white/35 hover:text-white/70",
                  ].join(" ")}
                >
                  <span className="mm-mono block text-[10px]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="mt-2 block whitespace-nowrap font-[var(--font-inter-tight)] text-sm font-semibold uppercase tracking-[-0.02em] md:text-base">
                    {item.label}
                  </span>

                  <span
  ref={(element) => {
    indicatorRefs.current[index] = element;
  }}
  className={[
    "absolute bottom-0 left-0 h-px bg-[var(--mm-accent)]",
    isActive ? "w-full" : "w-0",
  ].join(" ")}
/>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active category */}
        <div
        ref={contentRef}
        className="grid border-b border-[var(--mm-border)] lg:grid-cols-[0.32fr_1fr]">
          {/* Category information */}
          <div className="border-b border-[var(--mm-border)] py-8 lg:border-b-0 lg:border-r lg:py-12 lg:pr-10">
            <span className="mm-mono text-xs text-[var(--mm-accent)]">
              {String(activeCategory + 1).padStart(2, "0")}
            </span>

            <h3 className="mt-5 font-[var(--font-inter-tight)] text-3xl font-bold uppercase tracking-[-0.05em] md:text-5xl">
              {category.label}
            </h3>

            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/40">
              Explore our {category.label.toLowerCase()} services and
              capabilities.
            </p>
          </div>

          {/* Services */}
          <div className="lg:pl-10">
            {category.services.map((service, index) => {
              const isOpen = openService === index;

              return (
                <div
                  key={service.title}
                  className="border-b border-white/[0.07] last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenService(isOpen ? null : index)
                    }
                    className="group flex w-full items-center justify-between gap-6 py-7 text-left md:py-9"
                    aria-expanded={isOpen}
                  >
                    <div className="flex min-w-0 items-start gap-5 md:gap-8">
                      <span className="mm-mono shrink-0 pt-1 text-[10px] text-white/25">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        className={[
                          "font-[var(--font-inter-tight)] text-xl font-semibold uppercase leading-tight tracking-[-0.04em] transition-colors duration-300 md:text-3xl",
                          isOpen
                            ? "text-white"
                            : "text-white/60 group-hover:text-white",
                        ].join(" ")}
                      >
                        {service.title}
                      </span>
                    </div>

                    <span
                      aria-hidden="true"
                      className={[
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                        isOpen
                          ? "rotate-45 border-[var(--mm-accent)] bg-[var(--mm-accent)] text-black"
                          : "border-white/15 text-white/50 group-hover:border-white/40",
                      ].join(" ")}
                    >
                      +
                    </span>
                  </button>

                  <div
                    className={[
                      "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    ].join(" ")}
                  >
                    <div className="overflow-hidden">
  <div className="relative pb-10 pl-10 md:pb-12 md:pl-16">
    {/* Editorial accent line */}
    <span
      aria-hidden="true"
      className="absolute bottom-0 left-0 top-0 w-px bg-[var(--mm-accent)]/40"
    />

    <p
  ref={(element) => {
    descriptionRefs.current[index] = element;
  }}
  className="max-w-3xl text-sm leading-7 text-white/45 md:text-base md:leading-8"
>
  {service.description}
</p>
  </div>
</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom statement */}
        <div className="mt-20 flex justify-end md:mt-28">
          <p className="max-w-3xl font-[var(--font-inter-tight)] text-2xl font-medium leading-tight tracking-[-0.04em] text-white/60 md:text-4xl">
            We combine strategy, design and technology to make
            digital experiences matter.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-20 md:mt-28">
          <Magnetic strength={12}>
            <a
              href="/#contact"
              className="group flex w-fit items-center gap-5"
            >
              <span className="mm-mono text-xs uppercase text-white/45 transition-colors duration-300 group-hover:text-white">
                Start a conversation
              </span>

              <span
                aria-hidden="true"
                className="relative flex h-10 w-10 items-center justify-center text-[var(--mm-accent)]"
              >
                <span className="absolute h-px w-10 rotate-[-45deg] bg-current" />
                <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-current" />
              </span>
            </a>
          </Magnetic>
        </div>
      </Container>
    </section>
  );
}