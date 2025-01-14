export default function DownloadSuccess() {
  return (
    <div className="md:container md:mx-auto flex justify-center">
      <div className="max-w-2xl w-full p-2 text-center">
        <h1 className="text-3xl font-bold mb-8">Request Received!</h1>

        <div className="prose text-center">
          <p className="text-lg">
            Thank you for your request. We will process your TikTok sound videos
            and send them to your email within 24 hours.
          </p>
          <p className="text-lg">
            Please check your email (including spam folder) for the download
            link.
          </p>
        </div>
      </div>
    </div>
  );
}
