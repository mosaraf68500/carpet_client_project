import BlogCard from "./BlogCard";

export default function BlogGrid({ posts }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.href} post={post} />
      ))}
    </div>
  );
}
