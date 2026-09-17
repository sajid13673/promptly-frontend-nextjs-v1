'use client';

import { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  analyserRef: React.RefObject<AnalyserNode | null>;
  isActive: boolean;
  barCount?: number;
  color?: string;
}

export function WaveformVisualizer({
  analyserRef,
  isActive,
  barCount = 32,
  color = '#ef4444',
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  // smoothed bar heights, persisted across frames so bars ease rather than jump
  const barsRef = useRef<number[]>(new Array(barCount).fill(0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const freqData = new Uint8Array(256);

    const draw = () => {
      const analyser = analyserRef.current;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      if (analyser) {
        analyser.getByteFrequencyData(freqData);

        // sample barCount points across the useful low/mid frequency range
        // (voice energy is concentrated here; the tail end of the spectrum is mostly noise)
        const usableBins = Math.floor(freqData.length * 0.5);
        const step = usableBins / barCount;

        for (let i = 0; i < barCount; i++) {
          const start = Math.floor(i * step);
          const end = Math.floor(start + step);
          let sum = 0;
          for (let j = start; j < end; j++) sum += freqData[j];
          const avg = sum / (end - start || 1);
          const target = avg / 255; // 0..1

          // ease toward target so bars don't jitter frame to frame
          barsRef.current[i] += (target - barsRef.current[i]) * 0.35;
        }
      } else {
        // idle decay if analyser briefly unavailable
        for (let i = 0; i < barCount; i++) barsRef.current[i] *= 0.9;
      }

      const gap = 3;
      const barWidth = (width - gap * (barCount - 1)) / barCount;
      const centerY = height / 2;
      const minBarHeight = 3;

      for (let i = 0; i < barCount; i++) {
        const h = Math.max(minBarHeight, barsRef.current[i] * height * 0.9);
        const x = i * (barWidth + gap);

        ctx.beginPath();
        const radius = Math.min(barWidth / 2, 3);
        const y = centerY - h / 2;
        ctx.roundRect(x, y, barWidth, h, radius);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.5 + barsRef.current[i] * 0.5; // louder = more opaque
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [analyserRef, isActive, barCount, color]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-12 rounded-lg"
      style={{ width: '100%', height: '48px' }}
    />
  );
}