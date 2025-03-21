import { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { useEffect, useState } from "react";
import { db } from "~/services/databaseService";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const url = formData.get("url");
  const email = formData.get("email");

  await db.getDb().collection("sound-download-requests").insertOne({
    url,
    email,
  });

  return redirect("/tiktok/sound-downloader/success");
};

export default function TikTokSoundDownloader() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date("2025-01-19").getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="md:container md:mx-auto flex justify-center">
      <div className="max-w-2xl w-full p-2">
        <h1 className="text-3xl font-bold text-center mb-8">
          TikTok Sound UGC Video Downloader
        </h1>

        <h2 className="text-xl font-bold text-center mb-4">
          TikTok will be banned in the US on January 19
        </h2>

        <div className="flex justify-center gap-4 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold">{timeLeft.days}</div>
            <div className="text-sm">Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{timeLeft.hours}</div>
            <div className="text-sm">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{timeLeft.minutes}</div>
            <div className="text-sm">Minutes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{timeLeft.seconds}</div>
            <div className="text-sm">Seconds</div>
          </div>
        </div>

        <div className="prose text-center mb-4">
          <p className="text-lg">
            Save your sound's videos now before they're gone
          </p>
        </div>

        <Form method="post" className="space-y-4">
          <div>
            <label htmlFor="url" className="block mb-2">
              URL to sound
            </label>
            <input
              type="text"
              id="url"
              name="url"
              placeholder="https://www.tiktok.com/music/original-sound-7396833524533250858"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Download Videos
          </button>
        </Form>
      </div>
    </div>
  );
}
