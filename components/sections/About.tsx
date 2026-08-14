import Container from "@/components/layout/Container";
import AboutIntroAnimation from "./AboutIntroAnimation";

export default function About() {
  return (
    <section
      id="about"
      className="relative z-10 overflow-hidden border-t border-[var(--mm-border)] py-24 md:py-32 lg:py-40"
    >

     <AboutIntroAnimation>
      <Container>
        {/* Metadata */}
        <div
        data-about-meta
        className="mb-16 flex items-start justify-between md:mb-24">
          <span className="mm-mono text-white/45">
            About / 005
          </span>

          <span className="mm-mono hidden text-right text-white/35 sm:block">
            ManageMedia
            <br />
            Digital agency
          </span>
        </div>

        {/* Main statement */}
        <div className="max-w-[1500px]">
          <p
          data-about-label
          className="mm-mono mb-8 text-[var(--mm-accent)]">
            About us
          </p>

          <h2
  data-about-title
  className="font-[var(--font-inter-tight)] text-[clamp(3.5rem,9vw,10rem)] font-extrabold uppercase leading-[0.8] tracking-[-0.075em]"
>
  <span data-about-line className="block">
    Strategy.
  </span>

  <span data-about-line className="block">
    Creativity.
  </span>

  <span
    data-about-line
    className="block text-white/45"
  >
    Technology.
  </span>
</h2>
        </div>

        {/* Supporting content */}
        <div
        data-about-content
        className="mt-20 grid gap-12 border-t border-[var(--mm-border)] pt-8 md:mt-32 md:grid-cols-[1fr_1.5fr] md:gap-20">
          <div>
            <span className="mm-mono text-xs text-white/35">
              005 / 01
            </span>
          </div>

          <div className="max-w-3xl">
            <p className="font-[var(--font-inter)] text-lg leading-relaxed text-white/65 md:text-2xl md:leading-relaxed">
              Strategy, creativity and technology for brands
              building what comes next.
            </p>

            <div className="mt-12 grid gap-6 border-t border-[var(--mm-border)] pt-6 sm:grid-cols-3">
              <div data-about-item>
                <span className="mm-mono text-xs text-white/35">
                  01
                </span>
                <p className="mt-3 text-sm text-white/60">
                  Strategy
                </p>
              </div>

              <div data-about-item>
                <span className="mm-mono text-xs text-white/35">
                  02
                </span>
                <p className="mt-3 text-sm text-white/60">
                  Creativity
                </p>
              </div>

              <div data-about-item>
                <span className="mm-mono text-xs text-white/35">
                  03
                </span>
                <p className="mt-3 text-sm text-white/60">
                  Technology
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </AboutIntroAnimation>

    </section>
  );
}