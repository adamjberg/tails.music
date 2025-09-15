import { Link } from "react-router-dom";
import { BlogPost } from "../utils/markdown";

interface MarkdownPostProps {
  post: BlogPost;
}

export function MarkdownPost({ post }: MarkdownPostProps) {
  return (
    <div className="min-h-screen flex flex-col items-center px-8 py-2">
      <div className="max-w-[800px] w-full mt-2">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-center mb-8">
            {post.title}
          </h1>
          
          <div className="prose prose-lg max-w-none">
            {post.excerpt && (
              <div className="text-sm mb-6">
                {post.excerpt}
              </div>
            )}
            
            <div 
              dangerouslySetInnerHTML={{ __html: post.htmlContent }}
            />
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              to="/blog" 
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarkdownPost;