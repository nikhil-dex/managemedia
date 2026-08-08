import Navbar from "@/components/navigation/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="flex min-h-screen items-center px-[var(--mm-page-padding)]">
        <div>
          <span className="mm-mono text-white/50">
            MANAGEMEDIA / 001
          </span>

          <h1 className="mt-6 max-w-4xl font-[var(--font-inter-tight)] text-[clamp(4rem,10vw,10rem)] font-extrabold leading-[0.85] tracking-[-0.07em]">
            Digital
            <br />
            experiences.
          </h1>
        </div>
      </section>
    </main>
  );
}