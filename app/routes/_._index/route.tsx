import type { MetaFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { postService } from "~/services/postService";
import { Flywheel } from "../flywheel._index/flywheel";

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
    <>
      <div className="mx-auto max-w-screen-md px-4">
        <div className="flex justify-center">
          <Flywheel />
        </div>
        <h1 className="text-4xl font-bold mb-8 text-center">
          Helping artists develop their flywheel
        </h1>

        <div className="flex justify-center mb-8">
          <button
            data-cal-link="adam-xyz/free-strategy-consultation"
            data-cal-namespace="15min"
            data-cal-config='{"layout":"month_view"}'
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Book Free Strategy Call
          </button>
        </div>

        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-lg">Latest Posts</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

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
    </>
  );
}
