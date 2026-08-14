import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/sections/Footer";
import Container from "@/components/layout/Container";
import ServicesTabs from "@/components/sections/ServicesTabs";
import WebGLCanvas from "@/components/effects/WebGLCanvas";
import WebGLScene from "@/components/effects/WebGLScene";
import ServicesPageAnimation from "@/components/effects/ServicesPageAnimation";
import CustomCursor from "@/components/effects/CustomCursor";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
       <CustomCursor />
      <WebGLCanvas>
  <WebGLScene />
</WebGLCanvas>
<ServicesPageAnimation>
      <Navbar />

      {/* Page Hero */}
      <section
        data-webgl-scene="services"
        className="relative z-10 overflow-hidden border-b border-[var(--mm-border)] pt-32 md:pt-40 lg:pt-48"
      >
        <Container>
          <div className="pb-24 md:pb-32 lg:pb-40">
            <div className="mb-16 flex items-start justify-between md:mb-24">
              <span
              data-services-page-intro
              className="mm-mono text-white/45">
                Services / 002
              </span>

              <span className="mm-mono hidden text-right text-white/30 sm:block">
                ManageMedia
                <br />
                Digital agency
              </span>
            </div>

            <p className="mm-mono mb-8 text-[var(--mm-accent)]">
              What we do
            </p>

            <h1 
            data-services-page-title
            className="max-w-[1500px] font-[var(--font-inter-tight)] text-[clamp(4rem,11vw,12rem)] font-extrabold uppercase leading-[0.78] tracking-[-0.08em]">
              Strategy.
              <br />
              Creativity.
              <br />
              <span className="text-white/40">
                Technology.
              </span>
            </h1>

            <div className="mt-16 max-w-2xl border-t border-[var(--mm-border)] pt-6 md:mt-24">
              <p
              data-services-page-copy
              className="font-[var(--font-inter)] text-lg leading-relaxed text-white/55 md:text-2xl">
  We create digital experiences across development,
  marketing, content, communication and visual design.
</p>
            </div>
          </div>
        </Container>
      </section>
      {/* Full Services Catalogue */}
      <ServicesTabs />

      <Footer />
</ServicesPageAnimation>
    </main>
  );
}