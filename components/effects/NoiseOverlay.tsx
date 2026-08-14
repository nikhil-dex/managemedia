"use client";

export default function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9990] overflow-hidden opacity-[0.035]"
    >
      <div className="noise-layer" />

      <style jsx>{`
        .noise-layer {
          position: absolute;
          inset: -50%;
          width: 200%;
          height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 180px 180px;
          animation: noise-shift 0.18s steps(2) infinite;
        }

        @keyframes noise-shift {
          0% {
            transform: translate3d(0, 0, 0);
          }

          25% {
            transform: translate3d(-3%, 2%, 0);
          }

          50% {
            transform: translate3d(2%, -3%, 0);
          }

          75% {
            transform: translate3d(3%, 3%, 0);
          }

          100% {
            transform: translate3d(-2%, -2%, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .noise-layer {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
