import fs from "fs/promises";
import { marked } from "marked";
import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "music.tails" }];
};
export const loader = async () => {
  const postsDir = "app/posts";
  const files = await fs.readdir(postsDir);
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .sort((a, b) => b.localeCompare(a)) // Sort filenames in descending order
      .map(async (file) => {
        const filePath = `${postsDir}/${file}`;
        const content = await fs.readFile(filePath, "utf-8");
        const html = marked.parse(content);
        return { html };
      })
  );
  return { posts };
};

export default function Index() {
  const { posts } = useLoaderData() as { posts: { html: string }[] };

  return (
    <div className="mx-auto max-w-screen-md px-4">
      <h1 className="text-4xl font-bold my-4 text-center">music.tails</h1>
      {posts.map((post, index) => (
        <div
          className="prose"
          key={index}
          dangerouslySetInnerHTML={{ __html: post.html }}
        ></div>
      ))}
    </div>
  );
}
