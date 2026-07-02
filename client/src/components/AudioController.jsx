import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const AMBIENT_URLS = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
];

function generateBrownNoise(ctx) {
  const len = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (last + 0.02 * white) / 1.02;
    last = data[i];
    data[i] *= 3.5;
  }
  return buffer;
}

function startGenerativeAmbient(ctx) {
  const now = ctx.currentTime;
  const nodes = [];

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.035, now);
  masterGain.connect(ctx.destination);
  nodes.push(masterGain);

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(0.07, now);
  lfoGain.gain.setValueAtTime(0.35, now);
  lfo.connect(lfoGain);
  lfoGain.connect(masterGain.gain);
  lfo.start();
  nodes.push(lfo, lfoGain);

  const noise = ctx.createBufferSource();
  noise.buffer = generateBrownNoise(ctx);
  noise.loop = true;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.setValueAtTime(160, now);
  noiseFilter.Q.setValueAtTime(0.7, now);
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.55, now);
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);
  noise.start();
  nodes.push(noise, noiseFilter, noiseGain);

  const sub = ctx.createOscillator();
  sub.type = 'sine';
  sub.frequency.setValueAtTime(52, now);
  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(0.25, now);
  sub.connect(subGain);
  subGain.connect(masterGain);
  sub.start();
  nodes.push(sub, subGain);

  const tone = ctx.createOscillator();
  tone.type = 'sine';
  tone.frequency.setValueAtTime(216, now);
  const toneFilter = ctx.createBiquadFilter();
  toneFilter.type = 'lowpass';
  toneFilter.frequency.setValueAtTime(380, now);
  const toneGain = ctx.createGain();
  toneGain.gain.setValueAtTime(0.12, now);
  tone.connect(toneFilter);
  toneFilter.connect(toneGain);
  toneGain.connect(masterGain);
  tone.start();
  nodes.push(tone, toneFilter, toneGain);

  return { nodes, masterGain };
}

function stopNodes(nodes) {
  nodes.forEach((n) => {
    try { if (n.stop) n.stop(); } catch {}
    try { n.disconnect(); } catch {}
  });
}

export default function AudioController() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.12);
  const [expanded, setExpanded] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const audioRef = useRef(null);
  const ctxRef = useRef(null);
  const nodesRef = useRef([]);
  const fallbackGainRef = useRef(null);
  const urlAttemptRef = useRef(0);

  const stopAll = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    if (nodesRef.current.length > 0) {
      stopNodes(nodesRef.current);
      nodesRef.current = [];
    }
    if (ctxRef.current) {
      ctxRef.current.close();
      ctxRef.current = null;
    }
    fallbackGainRef.current = null;
  }, []);

  const playUrl = useCallback((urlIndex = 0) => {
    stopAll();
    if (urlIndex >= AMBIENT_URLS.length) {
      playFallback();
      return;
    }
    const audio = new Audio(AMBIENT_URLS[urlIndex]);
    audio.loop = true;
    audio.volume = volume;
    audio.preload = 'auto';

    const onReady = () => {
      clearTimeout(loadTimeout);
      audioRef.current = audio;
      setUsingFallback(false);
      audio.play().then(() => setPlaying(true)).catch(() => {});
    };

    const onError = () => {
      clearTimeout(loadTimeout);
      urlAttemptRef.current = urlIndex + 1;
      playUrl(urlIndex + 1);
    };

    const loadTimeout = setTimeout(() => {
      audio.removeEventListener('canplaythrough', onReady);
      audio.removeEventListener('error', onError);
      onError();
    }, 8000);

    audio.addEventListener('canplaythrough', onReady, { once: true });
    audio.addEventListener('error', onError, { once: true });
    audio.load();
  }, [volume, stopAll]);

  const playFallback = useCallback(() => {
    stopAll();
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctxRef.current = ctx;
    setUsingFallback(true);

    const { nodes, masterGain } = startGenerativeAmbient(ctx);
    nodesRef.current = nodes;
    fallbackGainRef.current = masterGain;
    masterGain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
    setPlaying(true);
  }, [volume, stopAll]);

  const togglePlay = useCallback(() => {
    if (playing) {
      stopAll();
      setPlaying(false);
    } else {
      playUrl(0);
    }
  }, [playing, playUrl, stopAll]);

  useEffect(() => {
    if (playing && audioRef.current) {
      audioRef.current.volume = volume;
    }
    if (playing && fallbackGainRef.current && ctxRef.current) {
      try {
        fallbackGainRef.current.gain.setValueAtTime(volume * 0.3, ctxRef.current.currentTime);
      } catch {}
    }
  }, [volume, playing]);

  useEffect(() => {
    return () => stopAll();
  }, [stopAll]);

  const volumePct = Math.round(volume * 100);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out ${
          expanded ? 'opacity-100 scale-100 mb-2' : 'opacity-0 scale-90 pointer-events-none h-0 mb-0'
        }`}
      >
        <div
          className="flex items-center gap-3 pl-1 pr-4 py-2 rounded-full shadow-lg"
          style={{
            background: 'rgba(253, 251, 247, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          }}
        >
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer shrink-0 transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #d4af37, #b8962f)',
            }}
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? (
              <Pause className="w-3.5 h-3.5 text-white fill-white" />
            ) : (
              <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
            )}
          </button>

          <span className="text-[10px] font-semibold tracking-wider whitespace-nowrap"
            style={{ color: '#2C2A29' }}>
            {usingFallback ? 'Ambiance G\u00e9n\u00e9rative' : 'Ambiance Bien-\u00cAtre'}
          </span>

          <div className="flex items-center gap-1.5">
            <VolumeX className="w-3 h-3 shrink-0" style={{ color: '#9a9a9a' }} />
            <input
              type="range"
              min="0"
              max="100"
              value={volumePct}
              onChange={(e) => setVolume(e.target.value / 100)}
              className="w-16 h-1 rounded-full appearance-none cursor-pointer accent-champagne-400
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-sm"
              style={{
                background: `linear-gradient(to right, #d4af37 ${volumePct}%, rgba(212,175,55,0.2) ${volumePct}%)`,
              }}
              aria-label="Volume"
            />
            <Volume2 className="w-3 h-3 shrink-0" style={{ color: '#9a9a9a' }} />
          </div>
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 border-none cursor-pointer"
        style={{
          background: playing
            ? 'linear-gradient(135deg, #d4af37, #b8962f)'
            : 'rgba(253, 251, 247, 0.8)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: playing
            ? 'none'
            : '1px solid rgba(212, 175, 55, 0.2)',
        }}
        aria-label="Contr\u00f4le audio"
        title="Contr\u00f4le audio"
      >
        {playing ? (
          <Volume2 className={`w-5 h-5 transition-all duration-300 ${expanded ? 'text-white' : ''}`}
            style={{ color: expanded ? undefined : '#d4af37' }} />
        ) : (
          <VolumeX className="w-5 h-5" style={{ color: '#d4af37' }} />
        )}
      </button>
    </div>
  );
}
