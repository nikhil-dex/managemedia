"use client";

interface MarqueeProps {
  items: string[];
}

export default function Marquee({
  items,
}: MarqueeProps) {
  const content = [...items, ...items];

  return (
    <div className="relative mt-20 overflow-hidden border-y border-[var(--mm-border)] py-5 md:mt-28 md:py-6">
      <div className="marquee-track flex w-max items-center gap-8 md:gap-12">
        {content.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex shrink-0 items-center gap-8 md:gap-12"
          >
            <span className="font-[var(--font-inter-tight)] text-[clamp(1.4rem,3vw,3rem)] font-semibold uppercase tracking-[-0.04em] text-white/45 transition-colors duration-300 hover:text-white">
              {item}
            </span>

            <span
              aria-hidden="true"
              className="text-[var(--mm-accent)]"
            >
              ✦
            </span>
          </span>
        ))}
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee-scroll 24s linear infinite;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes marquee-scroll {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}