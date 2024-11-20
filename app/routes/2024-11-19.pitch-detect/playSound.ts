export const playSound = (frequencyToPlay: number) => {
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(
    frequencyToPlay,
    audioContext.currentTime
  );
  oscillator.connect(audioContext.destination);
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
  }, 1000);
};
