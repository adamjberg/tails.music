import { PitchDetector } from "pitchy";
import { frequencies } from "./frequencies";
import { playSound } from "./playSound";
import { useRef, useState, useEffect } from "react";

import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Pitch Detector",
      description:
        "Prototype pitch detector in preparation for a mini-game I'm building",
    },
  ];
};

export default function Index() {
  const isRecordingRef = useRef(false);
  const [isRecording, setIsRecording] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const [lastPitch, setLastPitch] = useState<number | null>(null);
  const pitchHistoryRef = useRef<number[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Start video stream when component mounts
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30 },
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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawFrame = () => {
      // Set canvas size to match window dimensions
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Draw video
      ctx.save();
      ctx.scale(-1, 1); // Mirror the video
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      ctx.restore();

      // Draw UI elements
      ctx.fillStyle = "white";
      ctx.font = "bold 48px sans-serif";
      ctx.textAlign = "center";

      // Draw pitch text
      if (lastPitch) {
        const text = `${findClosestNote(lastPitch)} - ${Math.round(
          lastPitch
        )} Hz`;
        ctx.fillText(text, canvas.width / 2, 100);
      }

      // Draw start/stop button
      const buttonWidth = 120;
      const buttonHeight = 50;
      const buttonX = (canvas.width - buttonWidth) / 2;
      const buttonY = canvas.height - 100;

      ctx.fillStyle = isRecording ? "#ef4444" : "#22c55e"; // red-500 : green-500
      ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.font = "20px sans-serif";
      ctx.fillText(
        isRecording ? "Stop" : "Start",
        canvas.width / 2,
        buttonY + 32
      );

      animationFrameRef.current = requestAnimationFrame(drawFrame);
    };

    drawFrame();

    const handleClick = (e: MouseEvent) => {
      const buttonWidth = 120;
      const buttonHeight = 50;
      const buttonX = (canvas.width - buttonWidth) / 2;
      const buttonY = canvas.height - 100;

      if (
        e.clientX >= buttonX &&
        e.clientX <= buttonX + buttonWidth &&
        e.clientY >= buttonY &&
        e.clientY <= buttonY + buttonHeight
      ) {
        if (isRecording) {
          stopRecording();
        } else {
          startRecording();
        }
      }
    };

    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("click", handleClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording, lastPitch]);

  const findClosestNote = (frequency: number) => {
    return Array.from(frequencies.entries()).reduce((closest, [note, freq]) => {
      const currentDiff = Math.abs(freq - frequency);
      const closestDiff = Math.abs(closest[1] - frequency);
      return currentDiff < closestDiff ? [note, freq] : closest;
    }, Array.from(frequencies.entries())[0])[0];
  };

  const stopRecording = () => {
    isRecordingRef.current = false;
    setIsRecording(false);
    streamRef.current?.getTracks().forEach((track) => track.stop());

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
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

      // Start canvas recording
      const canvas = canvasRef.current;
      if (canvas) {
        const canvasStream = canvas.captureStream(30);
        const combinedStream = new MediaStream([
          ...canvasStream.getTracks(),
          ...stream.getTracks(),
        ]);

        chunksRef.current = [];
        const options = { mimeType: "video/mp4" };
        mediaRecorderRef.current = MediaRecorder.isTypeSupported("video/mp4")
          ? new MediaRecorder(combinedStream, options)
          : new MediaRecorder(combinedStream, { mimeType: "video/webm" });

        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const mimeType = MediaRecorder.isTypeSupported("video/mp4")
            ? "video/mp4"
            : "video/webm";
          const extension = mimeType === "video/mp4" ? "mp4" : "webm";
          const blob = new Blob(chunksRef.current, { type: mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `recording.${extension}`;
          a.click();
          URL.revokeObjectURL(url);
        };

        mediaRecorderRef.current.start();
      }

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
    <>
      <video ref={videoRef} autoPlay playsInline style={{ display: "none" }} />
      <canvas ref={canvasRef} className="fixed inset-0 touch-none" />
    </>
  );
}
