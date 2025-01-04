import fs from "fs/promises";
import { marked } from "marked";
import type { MetaFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "music.tails" }];
};

export const loader = async () => {
  const postsDir = "app/posts";
  const files = await fs.readdir(postsDir);
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const filePath = `${postsDir}/${file}`;
        const content = await fs.readFile(filePath, "utf-8");
        const stats = await fs.stat(filePath);
        const slug = file.replace(".md", "");

        // Extract title from first line of markdown
        const title = content.split("\n")[0].replace("#", "").trim();

        return {
          title,
          slug,
          createdAt: stats.birthtime,
        };
      })
  );

  // Sort by created date descending
  posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return { posts };
};

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto max-w-screen-md px-4">
      <h1 className="text-4xl font-bold my-4 text-center">music.tails</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.slug} className="border-b pb-4">
            <Link
              to={`/${post.slug}`}
              className="text-xl font-medium hover:text-blue-600"
            >
              {post.title}
            </Link>
            <div className="text-sm text-gray-500">
              {post.createdAt.toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
