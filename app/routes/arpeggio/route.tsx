import { PitchDetector } from "pitchy";
import { frequencies } from "./frequencies";
import { playSound } from "./playSound";
import { useRef, useState, useEffect } from "react";

export default function Index() {
  const isRecordingRef = useRef(false);
  const [isRecording, setIsRecording] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const [lastPitch, setLastPitch] = useState<number | null>(null);
  const pitchHistoryRef = useRef<number[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Start video stream when component mounts
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 60 },
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };
    startVideo();

    // Cleanup video stream when component unmounts
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const findClosestNote = (frequency: number) => {
    return Array.from(frequencies.entries()).reduce((closest, [note, freq]) => {
      const currentDiff = Math.abs(freq - frequency);
      const closestDiff = Math.abs(closest[1] - frequency);
      return currentDiff < closestDiff ? [note, freq] : closest;
    }, Array.from(frequencies.entries())[0])[0];
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);

      analyser.fftSize = 4096;

      const detector = PitchDetector.forFloat32Array(analyser.fftSize);
      detector.minVolumeDecibels = -20;
      const dataArray = new Float32Array(detector.inputLength);

      const detectPitch = () => {
        if (!isRecordingRef.current) {
          streamRef.current?.getTracks().forEach((track) => track.stop());
          return;
        }

        analyser.getFloatTimeDomainData(dataArray);
        const [pitch, clarity] = detector.findPitch(
          dataArray,
          audioContext.sampleRate
        );

        setLastPitch(pitch);

        requestAnimationFrame(detectPitch);
      };

      isRecordingRef.current = true;
      setIsRecording(true);
      pitchHistoryRef.current = []; // Reset history when starting new recording

      detectPitch();
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  return (
    <div className="relative h-[100dvh] w-full">
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="h-full w-full object-cover"
          style={{
            aspectRatio: "9/16",
            objectPosition: "center",
            transform: "scaleX(-1)",
          }}
        />
      </div>
      <div className="relative z-10 mx-auto max-w-screen-lg h-full flex flex-col">
        <div className="p-4 pt-16 flex flex-col justify-between h-full safe-area-inset-top safe-area-inset-bottom">
          <div className="text-center text-white font-bold text-3xl">
            {!!lastPitch
              ? `${findClosestNote(lastPitch)} - ${Math.round(lastPitch)} Hz`
              : ""}
          </div>
          {!isRecording && (
            <button
              onClick={() => {
                startRecording();
              }}
              className="mx-auto block px-4 py-2 text-white rounded bg-green-500 hover:bg-green-600"
            >
              Start
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
