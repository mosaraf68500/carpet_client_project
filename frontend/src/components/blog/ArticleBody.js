import Image from "next/image";

// Renders a post's `content` block array (paragraph | heading | image) —
// see the placeholder posts in data/blogContent.js for the block shape.
export default function ArticleBody({ blocks }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return (
            <h2 key={i} className="mt-10 mb-2 font-heading text-2xl text-heading">
              {block.text}
            </h2>
          );
        }
        if (block.type === "image") {
          return (
            <div key={i} className="relative my-2 aspect-[16/10] w-full overflow-hidden bg-box-grey">
              <Image
                src={block.src}
                alt={block.alt || ""}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          );
        }
        return (
          <p key={i} className="text-body leading-relaxed">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
