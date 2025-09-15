import { Link } from "react-router-dom";
import { PostPreview } from "../../PostPreview";
import { getBlogPostMetas } from "../../utils/markdown";

export function Blog() {
  const posts = getBlogPostMetas();
  
  return (
    <div className="min-h-screen flex flex-col items-center px-8 py-2">
      <div className="max-w-[800px] w-full mt-2">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-center mb-8">
            Blog
          </h1>
          
          <div className="w-full max-w-md space-y-6">
            {posts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`}>
                <PostPreview
                  title={post.title}
                  imageUrl={post.image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop&crop=center"}
                  imageAlt={post.title}
                />
              </Link>
            ))}
            
            {posts.length === 0 && (
              <p className="text-center text-gray-600">
                No blog posts found. Check back later!
              </p>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Blog;
