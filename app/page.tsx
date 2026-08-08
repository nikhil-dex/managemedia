import Navbar from "@/components/navigation/Navbar";
import WebGLCanvas from "@/components/effects/WebGLCanvas";
import WebGLScene from "@/components/effects/WebGLScene";
import Hero from "@/components/hero/Hero";

export default function Home() {
  return (
    <main className="min-h-screen">
      <WebGLCanvas>
        <WebGLScene />
      </WebGLCanvas>

      <Navbar />

      <Hero />
    </main>
  );
}