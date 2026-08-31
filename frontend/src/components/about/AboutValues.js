import Container from "@/components/common/Container";
import { aboutValues } from "@/data/aboutContent";

// TODO: replace with real design once client provides it — card copy is
// placeholder filler (see data/aboutContent.js).
export default function AboutValues() {
  return (
    <section className="bg-box-grey py-16">
      <Container size="boxed">
        <h2 className="text-center font-heading text-3xl">{aboutValues.heading}</h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {aboutValues.cards.map((card) => (
            <div key={card.title} className="text-center">
              <h3 className="font-heading text-lg">{card.title}</h3>
              <p className="mt-2 text-sm text-text-light">{card.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
