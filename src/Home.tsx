import "./index.css";
import { Link } from "react-router-dom";
import { InstagramLogo } from "./InstagramLogo";
import adam from "./adam.jpg";

export function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="max-w-[800px] w-full mt-8">
        <div className="flex flex-col items-center">
          <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
            <img 
              src={adam} 
              alt="Adam" 
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-semibold text-center mb-4">
            Hi, I'm Adam
          </h2>
          <p className="text-gray-300 text-center max-w-2xl leading-relaxed">
            I'm building tech to put the power back in indie artists' hands.
          </p>
        </div>
      </div>

      <div className="max-w-[800px] w-full mt-12">
        <Link to="/blog" className="block w-full">
          <button className="w-full py-4 px-8 bg-white text-black text-xl font-bold rounded-lg hover:bg-gray-200 transition-colors">
            Blog
          </button>
        </Link>
      </div>

      <div className="max-w-[800px] w-full mt-auto mb-8">
        <div className="flex justify-center">
          <a href="https://www.instagram.com/music.tails/">
            <InstagramLogo />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
