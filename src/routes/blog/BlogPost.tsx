import { useParams, Navigate } from "react-router-dom";
import { getBlogPostBySlug } from "../../utils/markdown";
import { MarkdownPost } from "../../components/MarkdownPost";

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug) {
    return <Navigate to="/blog" replace />;
  }
  
  const post = getBlogPostBySlug(slug);
  
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center px-8 py-2">
        <div className="max-w-[800px] w-full mt-2">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold text-center mb-8">
              Post Not Found
            </h1>
            <p className="text-center mb-8">
              The blog post "{slug}" could not be found.
            </p>
            <a 
              href="/blog" 
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              ← Back to Blog
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  return <MarkdownPost post={post} />;
}

export default BlogPost;