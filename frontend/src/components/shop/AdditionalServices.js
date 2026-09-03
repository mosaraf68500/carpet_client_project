import Image from "next/image";

// Alternating image/text rows on a light-gray band, per the reference
// design — image left on odd rows, right on even rows (desktop only;
// stacks image-on-top on mobile).
export default function AdditionalServices({ services }) {
  return (
    <div className="flex flex-col gap-6">
      {services.map((service, index) => (
        <div
          key={service.title}
          className={`flex flex-col items-center gap-8 bg-box-grey px-6 py-12 sm:px-10 lg:gap-16 lg:px-16 ${
            index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
          }`}
        >
          <div className="relative aspect-[4/3] w-full max-w-xl overflow-hidden lg:w-1/2">
            <Image
              src={service.image}
              alt={service.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <h3 className="font-heading text-2xl font-bold text-heading sm:text-3xl">{service.title}</h3>
            <p className="mt-4 text-body">{service.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
