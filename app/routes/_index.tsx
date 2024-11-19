import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "music.tails" }];
};

export default function Index() {
  return (
    <div className="mx-auto max-w-screen-lg">
      <h1 className="text-4xl font-bold my-4 text-center">music.tails</h1>
    </div>
  );
}
