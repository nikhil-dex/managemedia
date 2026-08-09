import Container from "@/components/layout/Container";
import FooterAnimation from "./FooterAnimation";

const footerLinks = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <FooterAnimation>
      <footer className="relative overflow-hidden border-t border-[var(--mm-border)] bg-black">
        <Container>
          {/* Main CTA */}
          <div className="relative py-24 md:py-32 lg:py-40">
            <p
            data-footer-label
            className="mm-mono mb-8 text-[var(--mm-accent)]">
            ManageMedia / 007
          </p>

          <a
            href="#contact"
            className="group block"
          >
            <h2
            data-footer-cta
            className="max-w-[1500px] font-[var(--font-inter-tight)] text-[clamp(4rem,12vw,13rem)] font-extrabold uppercase leading-[0.76] tracking-[-0.08em]">
              Let&apos;s
              <br />
              talk
              <span
              className="text-[var(--mm-accent)]">.</span>
            </h2>

            <div className="mt-10 flex items-center gap-4">
              <span className="mm-mono text-xs uppercase text-white/45 transition-colors duration-300 group-hover:text-white">
                Start a conversation
              </span>

              <span
              data-footer-arrow
                aria-hidden="true"
                className="relative flex h-10 w-10 items-center justify-center text-[var(--mm-accent)] transition-transform duration-500 ease-out group-hover:translate-x-2 group-hover:-translate-y-2"
              >
                <span className="absolute h-px w-10 rotate-[-45deg] bg-current" />
                <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-current" />
              </span>
            </div>
          </a>
        </div>

        {/* Footer information */}
        <div className="grid border-t border-[var(--mm-border)] md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div
          data-footer-info
          className="border-b border-[var(--mm-border)] py-10 md:border-r md:pr-10 lg:border-b-0">
            <div
            
            className="font-[var(--font-inter-tight)] text-3xl font-extrabold uppercase tracking-[-0.06em]">
              Manage<span className="text-[var(--mm-accent)]">Media</span>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/40">
              Strategy, creativity and technology for brands
              building what comes next.
            </p>
          </div>

          {/* Navigation */}
          <div
          data-footer-info
          className="border-b border-[var(--mm-border)] py-10 md:pl-10 lg:border-b-0 lg:border-r lg:pr-10">
            <p className="mm-mono mb-6 text-xs text-white/30">
              Navigation
            </p>

            <nav className="flex flex-col">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="group flex items-center justify-between border-b border-white/[0.06] py-3 text-sm uppercase tracking-[0.04em] text-white/60 transition-colors duration-300 hover:text-white"
                >
                  <span>{link.label}</span>

                  <span
                    aria-hidden="true"
                    className="text-[var(--mm-accent)] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                  >
                    ↗
                  </span>
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div
          data-footer-info
          className="py-10 md:col-span-2 lg:col-span-1 lg:pl-10">
            <p className="mm-mono mb-6 text-xs text-white/30">
              Contact
            </p>

            <div className="flex flex-col gap-4">
              <a
                href="mailto:Managemedia2019@gmail.com"
                className="break-all text-sm text-white/60 transition-colors duration-300 hover:text-[var(--mm-accent)]"
              >
                Managemedia2019@gmail.com
              </a>

              <a
                href="tel:+919315226146"
                className="text-sm text-white/60 transition-colors duration-300 hover:text-[var(--mm-accent)]"
              >
                +91-9315226146
              </a>

              <span className="mm-mono mt-2 text-xs text-white/30">
                New Delhi / India
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
        data-footer-bottom
        className="flex flex-col gap-4 border-t border-[var(--mm-border)] py-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="mm-mono text-[10px] uppercase tracking-[0.12em] text-white/25">
            © {new Date().getFullYear()} ManageMedia
          </span>

          <span className="mm-mono text-[10px] uppercase tracking-[0.12em] text-white/25">
            Strategy / Creativity / Technology
          </span>
        </div>
      </Container>
    </footer>
    </FooterAnimation>
  );
}