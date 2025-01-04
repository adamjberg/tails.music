import fs from "fs/promises";
import matter from "gray-matter";
import { marked } from "marked";

class PostService {
  private postsCache: Array<{
    title: string;
    slug: string;
    date: Date;
    html: string;
  }> | null = null;

  async getPosts() {
    if (this.postsCache) {
      return this.postsCache;
    }

    const postsDir = "app/posts";
    const files = await fs.readdir(postsDir);
    const posts = await Promise.all(
      files
        .filter((file) => file.endsWith(".md"))
        .map(async (file) => {
          const filePath = `${postsDir}/${file}`;
          const content = await fs.readFile(filePath, "utf-8");
          const { data, content: markdownContent } = matter(content);
          const html = await marked(markdownContent);

          return {
            title: data.title,
            slug: data.slug,
            date: new Date(data.date),
            html,
          };
        })
    );

    // Sort by date descending
    posts.sort((a, b) => b.date.getTime() - a.date.getTime());

    this.postsCache = posts;
    return posts;
  }
}

export const postService = new PostService();
