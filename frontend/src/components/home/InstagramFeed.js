import Image from "next/image";
import { instagramFeed } from "@/data/siteContent";
import Container from "@/components/common/Container";

export default function InstagramFeed() {
  return (
    <section className="bg-box-grey py-16">
      <Container size="boxed">
        <h2 className="text-center font-heading text-3xl sm:text-4xl">
          {instagramFeed.heading}
        </h2>
        <div className="mt-3 flex justify-center gap-2 text-sm">
          {instagramFeed.handles.map((h, i) => (
            <span key={h.href} className="flex items-center gap-2">
              <a href={h.href} target="_blank" rel="noreferrer" className="hover:text-primary">
                {h.label}
              </a>
              {i < instagramFeed.handles.length - 1 && <span>|</span>}
            </span>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Image
            src={instagramFeed.profile.avatar}
            alt={instagramFeed.profile.username}
            width={56}
            height={56}
            className="rounded-full"
          />
          <div>
            <p className="font-heading">{instagramFeed.profile.username}</p>
            <p className="max-w-md text-sm text-body">{instagramFeed.profile.bio}</p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {instagramFeed.posts.map((post, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden bg-white">
              <Image
                src={post.image}
                alt={post.caption}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
              <div className="absolute inset-0 hidden items-center justify-center bg-black/60 p-4 text-center text-xs text-white group-hover:flex">
                {post.caption}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={instagramFeed.profile.followHref}
            target="_blank"
            rel="noreferrer"
            className="border border-black px-7 py-3 text-sm uppercase tracking-wide hover:bg-black hover:text-white"
          >
            Follow on Instagram
          </a>
        </div>
      </Container>
    </section>
  );
}
