import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { postService } from "~/services/postService";
import { PostType } from "~/types/PostType";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { slug } = params;

  try {
    const posts = await postService.getPosts();
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
      throw new Response("Not Found", { status: 404 });
    }

    return post;
  } catch (error) {
    throw new Response("Not Found", { status: 404 });
  }
};

export default function Post() {
  const post = useLoaderData() as PostType;

  if (!post) {
    return null;
  }

  return (
    <div className="mx-auto max-w-screen-md px-4">
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </div>
  );
}
