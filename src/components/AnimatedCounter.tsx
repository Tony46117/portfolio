import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

interface AnimatedCounterProps {
  from?: number;
  to: number;
  suffix?: string;
  label: string;
  duration?: number;
  decimals?: number;
  icon?: React.ReactNode;
}

export default function AnimatedCounter({
  from = 0,
  to,
  suffix = '',
  label,
  duration = 2,
  decimals = 0,
  icon,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const range = to - from;

    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + range * eased;

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(to);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, from, to, duration]);

  return (
    <div ref={ref} className="text-center group">
      <div className="text-3xl sm:text-4xl font-bold text-white font-sans tracking-tight tabular-nums">
        {icon && <span className="inline-block mr-1.5 text-indigo-400">{icon}</span>}
        {count.toFixed(decimals)}
        {suffix}
      </div>
      <div className="text-xs text-neutral-500 font-mono mt-1 group-hover:text-neutral-400 transition-colors">
        {label}
      </div>
    </div>
  );
}
