"use client";
import GlitchNavLink from "@/components/effects/GlitchNavLink";
import Link from "next/link";
import { useLayoutEffect, useState,useRef } from "react";
import { gsap } from "gsap";

const navigation = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);
const brandRef = useRef<HTMLAnchorElement>(null);
const desktopNavRef = useRef<HTMLElement>(null);
const menuButtonRef = useRef<HTMLButtonElement>(null);
 

useLayoutEffect(() => {
  const navbar = navbarRef.current;

  if (!navbar) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    return;
  }

  const context = gsap.context(() => {
    const timeline = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    timeline
      .fromTo(
        brandRef.current,
        {
          y: -12,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
        }
      )
      .fromTo(
        desktopNavRef.current?.children ?? [],
        {
          y: -8,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.07,
        },
        "-=0.35"
      )
      .fromTo(
        menuButtonRef.current,
        {
          y: -8,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
        },
        "-=0.35"
      );
  }, navbar);

  return () => {
    context.revert();
  };
}, []);
  return (
    <header
    ref={navbarRef}
    className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-20 w-full max-w-[var(--mm-max-width)] items-center justify-between px-[var(--mm-page-padding)]">
        {/* Brand */}
        <Link
        ref={brandRef}
          href="/"
          aria-label="ManageMedia home"
          className="group relative z-50 flex items-center"
        >
          <span className="font-[var(--font-inter-tight)] text-xl font-extrabold tracking-[-0.06em]">
            MANAGE
            <span className="text-white/40">MEDIA</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
        ref={desktopNavRef}
          aria-label="Main navigation"
          className="hidden items-center gap-8 md:flex"
        >
        {navigation.map((item) => (
          <GlitchNavLink
            key={item.href}
            href={item.href}
          >
            {item.label}
          </GlitchNavLink>
        ))}
        </nav>

        {/* Menu button */}
        <button
        ref={menuButtonRef}
          type="button"
          aria-label={
            menuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
          className="relative z-50 flex items-center gap-3 md:hidden"
        >
          <span className="mm-mono">
            {menuOpen ? "Close" : "Menu"}
          </span>

          <span
            aria-hidden="true"
            className="flex w-6 flex-col gap-1.5"
          >
            <span
              className={`block h-px w-full bg-white transition-transform duration-500 ${
                menuOpen
                  ? "translate-y-[3px] -rotate-45"
                  : ""
              }`}
            />

            <span
              className={`block h-px w-4 self-end bg-white transition-transform duration-500 ${
                menuOpen
                  ? "-translate-y-[3px] -rotate-45"
                  : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        aria-hidden={!menuOpen}
        className={`fixed inset-0 -z-10 bg-[var(--mm-black)] transition-[opacity,visibility] duration-500 ${
          menuOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      >
        <nav
          aria-label="Mobile navigation"
          className="flex h-full flex-col justify-center px-[var(--mm-page-padding)]"
        >
          <div className="flex flex-col">
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`border-b border-[var(--mm-border)] py-5 font-[var(--font-inter-tight)] text-[clamp(3rem,13vw,6rem)] font-extrabold leading-[0.9] tracking-[-0.06em] transition-all duration-700 ${
                  menuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{
                  transitionDelay: menuOpen
                    ? `${index * 70}ms`
                    : "0ms",
                }}
              >
                <span className="flex items-center justify-between">
                  <span>{item.label}</span>

                 <span
  aria-hidden="true"
  className="
    relative block h-5 w-5
    text-[var(--mm-accent)]
    transition-transform duration-500
    group-hover:translate-x-1
    group-hover:-translate-y-1
  "
>
  <span
    className="
      absolute
      right-0.5
      top-0.5
      h-px
      w-5
      origin-right
      -translate-y-1/2
      rotate-[-45deg]
      bg-current
    "
  />

  <span
    className="
      absolute
      right-0
      top-0
      h-2.5
      w-2.5
      border-r
      border-t
      border-current
    "
  />
</span>
                </span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

