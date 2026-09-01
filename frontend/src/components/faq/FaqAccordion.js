// Native <details>/<summary> gives accordion behaviour (keyboard-operable,
// no layout-shift on open) with zero client JS — no need for a client
// component just to toggle open/closed state.
export default function FaqAccordion({ items }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col divide-y divide-border">
      {items.map((item) => (
        <details key={item.question} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-lg text-heading marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            {item.question}
            <span aria-hidden="true" className="shrink-0 text-xl text-primary group-open:hidden">
              +
            </span>
            <span aria-hidden="true" className="hidden shrink-0 text-xl text-primary group-open:block">
              −
            </span>
          </summary>
          <p className="mt-3 text-body">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
