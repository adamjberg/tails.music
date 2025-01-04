import type { MetaFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { postService } from "~/services/postService";

export const meta: MetaFunction = () => {
  return [{ title: "music.tails" }];
};

export const loader = async () => {
  const posts = await postService.getPosts();
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
              {post.date.toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
