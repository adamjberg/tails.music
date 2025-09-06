import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./routes/_index/Home.tsx";
import { Blog } from "./routes/blog/Blog.tsx";
import { MusicIndustryThoughts } from "./routes/blog/posts/MusicIndustryThoughts.tsx";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/music-industry-thoughts" element={<MusicIndustryThoughts />} />
      </Routes>
    </Router>
  );
}

export default App;
