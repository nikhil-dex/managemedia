import Container from "@/components/layout/Container";
import ServiceRow from "./ServiceRow";

const services = [
  {
    number: "01",
    title: "Strategy",
    description:
      "We turn ideas, audiences and business goals into clear digital direction.",
  },
  {
    number: "02",
    title: "Creative",
    description:
      "We build visual identities and creative experiences designed to be remembered.",
  },
  {
    number: "03",
    title: "Digital",
    description:
      "We design and develop digital products that feel fast, useful and distinctive.",
  },
  {
    number: "04",
    title: "Technology",
    description:
      "We use modern technology to turn ambitious concepts into reliable experiences.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative z-10 overflow-hidden border-t border-[var(--mm-border)] py-24 md:py-32 lg:py-40"
    >
      <Container>
        {/* Section heading */}
        <div className="mb-20 flex flex-col gap-8 md:mb-28 md:flex-row md:items-start md:justify-between">
          <div className="mm-mono text-white/45">
            Services / 002
          </div>

          <div className="max-w-2xl">
            <h2 className="font-[var(--font-inter-tight)] text-[clamp(3.5rem,8vw,8rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.07em]">
              What
              <br />
              we do.
            </h2>
          </div>

          <p className="max-w-xs text-sm leading-relaxed text-white/45 md:pt-3">
            From strategy to technology, we create digital
            experiences that move brands forward.
          </p>
        </div>

        {/* Services list */}
        <div className="border-t border-[var(--mm-border)]">
       {services.map((service) => (
  <ServiceRow
    key={service.number}
    number={service.number}
    title={service.title}
    description={service.description}
  />
))}
        </div>

        {/* Closing statement */}
        <div className="mt-20 flex justify-end md:mt-28">
          <p className="max-w-xl font-[var(--font-inter-tight)] text-2xl font-medium leading-tight tracking-[-0.03em] text-white/65 md:text-4xl">
            We combine strategy, design and technology to
            make digital experiences matter.
          </p>
        </div>
      </Container>
    </section>
  );
}