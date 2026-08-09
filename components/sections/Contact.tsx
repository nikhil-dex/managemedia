import Container from "@/components/layout/Container";
import ContactAnimation from "./ContactAnimation";
const contactDetails = [
  {
    label: "Email",
    value: "Managemedia2019@gmail.com",
    href: "mailto:Managemedia2019@gmail.com",
  },
  {
    label: "Phone",
    value: "+91-9315226146",
    href: "tel:+919315226146",
  },
];

export default function Contact() {
  return (
    <ContactAnimation>
    <section
      id="contact"
      className="relative z-10 overflow-hidden border-t border-[var(--mm-border)] py-24 md:py-32 lg:py-40"
    >
      <Container>
        {/* Metadata */}
        <div
        data-contact-meta
        className="mb-16 flex items-start justify-between md:mb-24">
          <span className="mm-mono text-white/45">
            Contact / 006
          </span>

          <span className="mm-mono hidden text-right text-white/35 sm:block">
            ManageMedia
            <br />
            New Delhi / India
          </span>
        </div>

        {/* Heading */}
        <div
        
        className="max-w-[1500px]">
          <p
          data-contact-label
          className="mm-mono mb-8 text-[var(--mm-accent)]">
            Contact Us
          </p>

          <h2 
          data-contact-heading
          className="font-[var(--font-inter-tight)] text-[clamp(4rem,11vw,12rem)] font-extrabold uppercase leading-[0.78] tracking-[-0.075em]">
            Let&apos;s
            <br />
            talk<span className="text-[var(--mm-accent)]">.</span>
          </h2>
        </div>

        {/* Contact information */}
        <div
        data-contact-links
        className="mt-20 border-t border-[var(--mm-border)] md:mt-32">
          {contactDetails.map((detail) => (
            <a
            data-contact-item
              key={detail.label}
              href={detail.href}
              className="group flex flex-col gap-4 border-b border-[var(--mm-border)] py-7 md:grid md:grid-cols-[180px_1fr_auto] md:items-center md:py-9"
            >
              <span className="mm-mono text-xs text-white/35">
                {detail.label}
              </span>

              <span className="font-[var(--font-inter-tight)] text-[clamp(1.5rem,2vw,4rem)] font-bold tracking-[-0.05em] transition-transform duration-500 [transition-timing-function:var(--mm-ease)] md:group-hover:translate-x-2">
                {detail.value}
              </span>

              <span
                aria-hidden="true"
                className="relative h-8 w-8 text-[var(--mm-accent)] transition-transform duration-500 md:group-hover:translate-x-1 md:group-hover:-translate-y-1"
              >
                <span className="absolute right-0.5 top-0.5 h-px w-8 origin-right -translate-y-1/2 rotate-[-45deg] bg-current" />

                <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-current" />
              </span>
            </a>
          ))}
        </div>

        {/* Closing */}
        <div 
        data-contact-closing
        className="mt-16 flex flex-col gap-6 md:mt-24 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-sm leading-relaxed text-white/40">
            Ready to start a conversation?
            <br />
            Get in touch with ManageMedia.
          </p>

          <span className="mm-mono text-xs text-white/30">
            New Delhi / India
          </span>
        </div>
      </Container>
    </section>
    </ContactAnimation>
  );
}