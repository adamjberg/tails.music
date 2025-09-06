import { Link } from "react-router-dom";
import { PostPreview } from "../../PostPreview";

export function Blog() {
  return (
    <div className="min-h-screen flex flex-col items-center px-8 py-2">
      <div className="max-w-[800px] w-full mt-2">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-center mb-8">
            Blog
          </h1>
          
          <div className="w-full max-w-md">
            <Link to="/music-industry-thoughts">
              <PostPreview
                title="Thoughts on the music industry from an outsider's perspective"
                imageUrl="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center"
                imageAlt=""
              />
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Blog;
