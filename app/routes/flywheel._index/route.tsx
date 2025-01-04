import { Flywheel } from "./flywheel";

export default function FlywheelRoute() {
  return (
    <div className="mx-auto max-w-screen-md px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">
        The Artist Flywheel
      </h1>
      <div className="flex justify-center items-center">
        <Flywheel />
      </div>
    </div>
  );
}
