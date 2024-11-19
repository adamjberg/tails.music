import fs from "fs/promises";
import { marked } from "marked";
import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "music.tails" }];
};

export const loader = async () => {
  const filePath = "app/posts/2024-11-18.md";
  const file = await fs.readFile(filePath, "utf-8");
  const html = marked.parse(file);
  return { html };
};

export default function Index() {
  const { html } = useLoaderData() as { html: string };

  return (
    <div className="mx-auto max-w-screen-md">
      <h1 className="text-4xl font-bold my-4 text-center">music.tails</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  );
}
