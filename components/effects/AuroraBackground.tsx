"use client";

export default function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="aurora aurora-three" />

      <style jsx>{`
        .aurora {
          position: absolute;
          width: 55vw;
          height: 55vw;
          max-width: 900px;
          max-height: 900px;
          border-radius: 9999px;
          filter: blur(90px);
          opacity: 0.08;
          mix-blend-mode: screen;
          will-change: transform;
        }

        .aurora-one {
          left: -15%;
          top: -20%;
          background: radial-gradient(
            circle,
            rgba(217, 255, 0, 0.9) 0%,
            rgba(217, 255, 0, 0) 70%
          );
          animation: aurora-one 16s ease-in-out infinite alternate;
        }

        .aurora-two {
          right: -20%;
          top: 20%;
          background: radial-gradient(
            circle,
            rgba(120, 255, 220, 0.55) 0%,
            rgba(120, 255, 220, 0) 70%
          );
          animation: aurora-two 21s ease-in-out infinite alternate;
        }

        .aurora-three {
          left: 30%;
          bottom: -35%;
          background: radial-gradient(
            circle,
            rgba(180, 100, 255, 0.35) 0%,
            rgba(180, 100, 255, 0) 70%
          );
          animation: aurora-three 25s ease-in-out infinite alternate;
        }

        @keyframes aurora-one {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }

          to {
            transform: translate3d(12vw, 8vh, 0) scale(1.15);
          }
        }

        @keyframes aurora-two {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }

          to {
            transform: translate3d(-10vw, 12vh, 0) scale(1.2);
          }
        }

        @keyframes aurora-three {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }

          to {
            transform: translate3d(-8vw, -10vh, 0) scale(1.18);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .aurora {
            animation: none;
          }
        }

        @media (max-width: 767px) {
          .aurora {
            width: 90vw;
            height: 90vw;
            filter: blur(70px);
            opacity: 0.055;
          }
        }
      `}</style>
    </div>
  );
}