import Navbar from "@/components/navigation/Navbar";
import WebGLCanvas from "@/components/effects/WebGLCanvas";
import WebGLScene from "@/components/effects/WebGLScene";

export default function Home() {
  return (
    <main className="min-h-screen">
      <WebGLCanvas>
        <WebGLScene />
      </WebGLCanvas>

      <Navbar />

      <section
        data-webgl-scene
        className="relative z-10 min-h-screen"
      >
        <div className="flex min-h-screen items-end px-[var(--mm-page-padding)] pb-16">
          <div>
            <span className="mm-mono text-white/50">
              MANAGEMEDIA / 001
            </span>

            <h1 className="mt-6 max-w-5xl font-[var(--font-inter-tight)] text-[clamp(4.5rem,11vw,11rem)] font-extrabold leading-[0.82] tracking-[-0.075em]">
              Digital
              <br />
              experiences.
            </h1>
          </div>
        </div>
      </section>
    </main>
  );
}