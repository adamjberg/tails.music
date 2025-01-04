import fs from "fs/promises";
import { marked } from "marked";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { slug } = params;

  try {
    const filePath = `app/posts/${slug}.md`;
    const content = await fs.readFile(filePath, "utf-8");
    const html = marked(content);

    return json({ html });
  } catch (error) {
    throw new Response("Not Found", { status: 404 });
  }
};

export default function Post() {
  const { html } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto max-w-screen-md px-4">
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
