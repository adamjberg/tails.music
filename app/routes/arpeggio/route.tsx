import { PitchDetector } from "pitchy";
import { frequencies } from "./frequencies";
import { playSound } from "./playSound";
import { useRef, useState, useEffect } from "react";

export default function Index() {
  const [frequencyToPlay, setFrequencyToPlay] = useState(
    frequencies.get("D3")!
  );
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
          video: { facingMode: "user" },
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

  const currentNote = findClosestNote(frequencyToPlay);

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
    <div className="mx-auto max-w-screen-lg h-screen flex flex-col">
      <div className="h-1/2 p-4 flex flex-col justify-center items-center">
        <div className="flex justify-center items-center gap-4 mb-4">
          <input
            type="number"
            value={frequencyToPlay}
            onChange={(e) => setFrequencyToPlay(Number(e.target.value))}
            className="px-2 py-1 border rounded"
            step="0.1"
          />
          <button
            onClick={() => playSound(frequencyToPlay)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Play {currentNote}
          </button>
        </div>
        <button
          onClick={() => {
            if (isRecordingRef.current) {
              isRecordingRef.current = false;
              setIsRecording(false);
            } else {
              startRecording();
            }
          }}
          className="mx-auto block px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <div className="text-center mt-4">
          {!!lastPitch
            ? `${findClosestNote(lastPitch)} - ${lastPitch?.toFixed(2)} Hz`
            : "None"}
        </div>
      </div>
      <div className="h-1/2 bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
