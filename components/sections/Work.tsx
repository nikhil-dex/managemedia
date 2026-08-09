import Container from "@/components/layout/Container";
import WorkCTA from "./WorkCTA";

export default function Work() {
  return (
    <section
      id="work"
      className="relative z-10 overflow-hidden border-t border-[var(--mm-border)] py-24 md:py-32 lg:py-40"
    >
      <Container>
        {/* Section metadata */}
        <div className="mb-16 flex items-start justify-between md:mb-24">
          <span className="mm-mono text-white/45">
            ManageMedia / 003
          </span>

          <span className="mm-mono hidden text-right text-white/35 sm:block">
            Selected work
            <br />
            Digital experiences
          </span>
        </div>

        {/* Main heading */}
        <div className="max-w-[1500px]">
          <p className="mm-mono mb-8 text-[var(--mm-accent)]">
            Work
          </p>

          <h2 className="font-[var(--font-inter-tight)] text-[clamp(4rem,11vw,11rem)] font-extrabold uppercase leading-[0.78] tracking-[-0.075em]">
            Want to
            <br />
            see our
            <br />
            <span className="text-white/45">work?</span>
          </h2>
        </div>

        {/* Visual work panel */}
        <div className="mt-20 md:mt-32">
          <div className="relative overflow-hidden border border-[var(--mm-border)]">
            <div className="grid min-h-[420px] grid-cols-2 md:min-h-[600px] md:grid-cols-4">
              <div className="border-r border-[var(--mm-border)] bg-white/[0.025]" />
              <div className="border-r border-[var(--mm-border)] bg-white/[0.015]" />
              <div className="border-r border-[var(--mm-border)] bg-white/[0.025]" />
              <div className="bg-white/[0.015]" />
            </div>

            {/* Center message */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="text-center">
                <p className="mb-5 mm-mono text-xs uppercase tracking-[0.18em] text-white/35">
                  ManageMedia
                </p>

                <p className="max-w-xl font-[var(--font-inter-tight)] text-[clamp(2rem,5vw,5rem)] font-bold uppercase leading-[0.9] tracking-[-0.055em]">
                  Want to see
                  <br />
                  our work
                  <span className="text-[var(--mm-accent)]">?</span>
                </p>
              </div>
            </div>

            {/* Corner details */}
            <span className="absolute left-5 top-5 mm-mono text-[10px] text-white/30 md:left-7 md:top-7">
              003
            </span>

            <span className="absolute bottom-5 right-5 mm-mono text-[10px] text-white/30 md:bottom-7 md:right-7">
              WORK / PROJECTS
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 flex justify-end">
            <WorkCTA />
        </div>
      </Container>
    </section>
  );
}