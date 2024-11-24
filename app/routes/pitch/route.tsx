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
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const canvasStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Create offscreen canvas
    offscreenCanvasRef.current = document.createElement("canvas");
    offscreenCanvasRef.current.width = 1080;
    offscreenCanvasRef.current.height = 1920;

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
    const offscreenCanvas = offscreenCanvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !offscreenCanvas) return;

    const ctx = canvas.getContext("2d");
    const offscreenCtx = offscreenCanvas.getContext("2d");
    if (!ctx || !offscreenCtx) return;

    const drawFrame = () => {
      // Set display canvas size to maintain 9:16 aspect ratio while fitting window
      const windowAspect = window.innerWidth / window.innerHeight;
      const targetAspect = 9 / 16;

      let canvasWidth, canvasHeight;
      if (windowAspect > targetAspect) {
        // Window is wider than target aspect - fit to height
        canvasHeight = window.innerHeight;
        canvasWidth = canvasHeight * targetAspect;
      } else {
        // Window is taller than target aspect - fit to width
        canvasWidth = window.innerWidth;
        canvasHeight = canvasWidth / targetAspect;
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Calculate dimensions to maintain aspect ratio while filling height
      const videoAspect = video.videoWidth / video.videoHeight;

      // Draw to offscreen canvas first
      const drawHeight = offscreenCanvas.height;
      const drawWidth = offscreenCanvas.height * videoAspect;
      const offsetX = (offscreenCanvas.width - drawWidth) / 2;
      const offsetY = 0;

      offscreenCtx.save();
      offscreenCtx.scale(-1, 1);
      offscreenCtx.drawImage(
        video,
        -offsetX - drawWidth,
        offsetY,
        drawWidth,
        drawHeight
      );
      offscreenCtx.restore();

      // Draw UI elements on offscreen canvas
      offscreenCtx.fillStyle = "white";
      offscreenCtx.font = "bold 48px sans-serif";
      offscreenCtx.textAlign = "center";

      if (lastPitch) {
        const text = `${findClosestNote(lastPitch)} - ${Math.round(
          lastPitch
        )} Hz`;
        offscreenCtx.fillText(text, offscreenCanvas.width / 2, 100);
      }

      const buttonWidth = 360; // 3x larger
      const buttonHeight = 150; // 3x larger
      const buttonX = (offscreenCanvas.width - buttonWidth) / 2;
      const buttonY = offscreenCanvas.height - 200; // Moved up slightly to accommodate larger size

      offscreenCtx.fillStyle = isRecording ? "#ef4444" : "#22c55e";
      offscreenCtx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 24); // Increased border radius
      offscreenCtx.fill();

      offscreenCtx.fillStyle = "white";
      offscreenCtx.font = "60px sans-serif"; // 3x larger font
      offscreenCtx.fillText(
        isRecording ? "Stop" : "Start",
        offscreenCanvas.width / 2,
        buttonY + 96 // Adjusted for larger button
      );

      // Draw offscreen canvas to display canvas
      ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);

      if (canvasStreamRef.current) {
        const videoTrack = canvasStreamRef.current.getVideoTracks()[0];
        if (videoTrack) {
          (videoTrack as any).requestFrame();
        }
      }

      animationFrameRef.current = requestAnimationFrame(drawFrame);
    };

    drawFrame();

    const handleClick = (e: MouseEvent) => {
      const buttonWidth = 360; // Match button size above
      const buttonHeight = 150;
      const buttonX = (canvas.width - buttonWidth) / 2;
      const buttonY = canvas.height - 200;

      // Get click position relative to canvas
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Scale coordinates based on canvas scaling
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const scaledX = x * scaleX;
      const scaledY = y * scaleY;

      if (
        scaledX >= buttonX &&
        scaledX <= buttonX + buttonWidth &&
        scaledY >= buttonY &&
        scaledY <= buttonY + buttonHeight
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
      const offscreenCanvas = offscreenCanvasRef.current;
      if (offscreenCanvas) {
        const canvasStream = offscreenCanvas.captureStream(0);
        canvasStreamRef.current = canvasStream;
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
      pitchHistoryRef.current = [];

      detectPitch();
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ position: "absolute", width: 1, height: 1 }}
      />
      <canvas ref={canvasRef} className="fixed inset-0 touch-none m-auto" />
    </>
  );
}
