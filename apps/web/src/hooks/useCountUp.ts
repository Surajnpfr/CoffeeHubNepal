import { useEffect, useState } from 'react';

interface UseCountUpOptions {
  duration?: number;
  startOnMount?: boolean;
}

export const useCountUp = (
  target: number,
  options: UseCountUpOptions = {}
) => {
  const { duration = 2000, startOnMount = true } = options;
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!startOnMount) return;

    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration, startOnMount]);

  return { count, isAnimating };
};

