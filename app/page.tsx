import Navbar from "@/components/navigation/Navbar";
import WebGLCanvas from "@/components/effects/WebGLCanvas";
import WebGLScene from "@/components/effects/WebGLScene";
import Hero from "@/components/hero/Hero";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import Testimonials from "@/components/sections/Testimonials";
import About from "@/components/sections/About";

export default function Home() {
  return (
    <main className="min-h-screen">
      <WebGLCanvas>
        <WebGLScene />
      </WebGLCanvas>

      <Navbar />

      <Hero />
      <Services />
      <Work />
      <Testimonials />
      <About />
    </main>
  );
}