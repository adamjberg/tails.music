import type { MetaFunction } from "@remix-run/node";
import { Flywheel } from "../flywheel._index/flywheel";

export const meta: MetaFunction = () => {
  return [{ title: "tails.music" }];
};

function BookFreeStrategyCall({ id }: { id: string }) {
  return (
    <button
      data-umami-event={`book-call-${id}`}
      data-cal-link="adam-xyz/free-strategy-consultation"
      data-cal-namespace="15min"
      data-cal-config='{"layout":"month_view"}'
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
    >
      Book Free Strategy Call
    </button>
  );
}

export default function Index() {
  return (
    <>
      <div className="mx-auto max-w-screen-md px-4">
        <h1 className="text-4xl font-bold my-8 text-center">
          Free 15 Minute Ad Strategy Call
        </h1>

        <p className="text-lg mb-8 text-center">
          Let's chat about using Meta ads to grow your music career
        </p>

        <div className="flex justify-center my-12">
          <BookFreeStrategyCall id="1" />
        </div>

        <div className="flex justify-center ">
          <Flywheel />
        </div>

        <p className="text-lg my-12 text-center">
          Advertising is the spark that ignites your music's growth flywheel. By
          strategically placing your music in front of new listeners through
          targeted ads, you create the initial momentum needed for organic
          growth. These new listeners become fans, share your music, and help
          attract even more listeners - creating a self-reinforcing cycle of
          growth.
        </p>

        <div className="flex justify-center my-8">
          <BookFreeStrategyCall id="2" />
        </div>
      </div>
    </>
  );
}
