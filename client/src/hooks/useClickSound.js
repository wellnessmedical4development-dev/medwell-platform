import { useEffect, useRef } from 'react';

export default function useClickSound() {
  const ctxRef = useRef(null);

  useEffect(() => {
    let frameId = null;

    const playClick = () => {
      if (!ctxRef.current) {
        ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = ctxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.start(now);
      osc.stop(now + 0.04);

      const noise = ctx.createBufferSource();
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * 0.3;
      }
      noise.buffer = noiseBuffer;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.015, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
    };

    const handler = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(playClick);
    };

    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
      if (frameId) cancelAnimationFrame(frameId);
      if (ctxRef.current) ctxRef.current.close();
    };
  }, []);
}
