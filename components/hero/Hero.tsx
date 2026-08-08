import Container from "@/components/layout/Container";
import HeroIntroAnimation from "./HeroIntroAnimation";

export default function Hero() {
  return (
    <section
      id="hero"
      data-webgl-scene
      className="relative z-10 min-h-screen overflow-hidden"
    >
  
        <HeroIntroAnimation>
      <Container className="flex min-h-screen flex-col justify-between pb-8 pt-28 md:pb-10 md:pt-32">
        {/* Top metadata */}
        <div
        data-hero-meta
        className="flex items-start justify-between">
          <div className="mm-mono text-white/45">
            ManageMedia / 001
          </div>

          <div className="mm-mono hidden text-right text-white/45 sm:block">
            Digital agency
            <br />
            New Delhi / India
          </div>
        </div>

        {/* Main content */}
        <div className="pb-[8vh]">
          <p
          data-hero-description
          className="mb-6 max-w-md text-sm leading-relaxed text-white/55 md:mb-8 md:text-base">
            Strategy, creativity and technology
            for brands building what comes next.
          </p>

         <h1
  className="max-w-[1450px] font-[var(--font-inter-tight)] text-[clamp(4.25rem,13vw,13rem)] font-extrabold uppercase leading-[0.76] tracking-[-0.075em]"
>
  <span
    data-hero-title
    className="block"
  >
    Manage
  </span>

  <span
    data-hero-title
    className="ml-[8vw] block text-white/75"
  >
    Media
  </span>
</h1>
        </div>

        {/* Bottom information */}
        <div
        data-hero-bottom
        className="flex flex-col gap-8 border-t border-[var(--mm-border)] pt-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="mm-mono text-white/40">
            Strategy
            <span className="mx-2 text-[var(--mm-accent)]">
              /
            </span>
            Design
            <span className="mx-2 text-[var(--mm-accent)]">
              /
            </span>
            Technology
          </div>

          <a
            href="#services"
            className="group flex w-fit items-center gap-5 font-[var(--font-inter)] text-sm font-medium uppercase tracking-[0.08em]"
          >
            <span>Explore</span>

            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-all duration-500 [transition-timing-function:var(--mm-ease)] group-hover:border-[var(--mm-accent)] group-hover:bg-[var(--mm-accent)] group-hover:text-black">
              <span className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </span>
          </a>
        </div>
      </Container>
</HeroIntroAnimation>
    </section>
  );
}