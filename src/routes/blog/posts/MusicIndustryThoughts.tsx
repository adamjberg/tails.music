import { Link } from "react-router-dom";

export function MusicIndustryThoughts() {
  return (
    <div className="min-h-screen flex flex-col items-center px-8 py-2">
      <div className="max-w-[800px] w-full mt-2">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-center mb-8">
            Thoughts on the Music Industry from an Outsider's Perspective
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="text-sm mb-6">
              First Draft - September 5, 2025
            </div>
            
            
            <p>
              
            </p>

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

export default MusicIndustryThoughts;
