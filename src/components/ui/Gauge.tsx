import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "../../lib/utils";

interface GaugeProps {
  value: number; // 0 to 100
  className?: string;
}

export function Gauge({ value, className }: GaugeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || reducedMotion) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x / rect.width - 0.5);
    mouseY.set(y / rect.height - 0.5);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // 0-100 to angle: Let's do a 180 degree sweep. -90 to +90
  const angle = (value / 100) * 180 - 90;

  // Colors based on risk
  let colorClass = "text-sage";
  if (value > 40) colorClass = "text-amber";
  if (value > 70) colorClass = "text-burnt";
  if (value > 90) colorClass = "text-brick";

  return (
    <div
      ref={ref}
      className={cn("relative w-64 h-32 perspective-1000", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Risk score gauge"
      role="meter"
    >
      <motion.div
        className="w-full h-full preserve-3d"
        style={{
          rotateX: reducedMotion ? 0 : rotateX,
          rotateY: reducedMotion ? 0 : rotateY,
        }}
        animate={{
          y: reducedMotion || isHovered ? 0 : [0, -5, 0],
        }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* SVG Gauge Face */}
        <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible drop-shadow-md">
          {/* Background Arc */}
          <path
            d="M 10 90 A 80 80 0 0 1 190 90"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="20"
            strokeLinecap="butt"
          />
          {/* Value Arc (Risk band) */}
          <motion.path
            d="M 10 90 A 80 80 0 0 1 190 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="20"
            strokeLinecap="butt"
            className={colorClass}
            strokeDasharray="251"
            initial={{ strokeDashoffset: 251 }}
            animate={{ strokeDashoffset: 251 - (value / 100) * 251 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          
          {/* Needle Origin */}
          <circle cx="100" cy="90" r="10" fill="var(--color-ink)" />
          <circle cx="100" cy="90" r="4" fill="var(--color-paper)" />

          {/* Needle */}
          <motion.g
            initial={{ rotate: -90 }}
            animate={{ rotate: angle }}
            transition={{ duration: 1, type: "spring", stiffness: 60 }}
            style={{ transformOrigin: "100px 90px" }}
          >
            <path d="M 96 90 L 100 20 L 104 90 Z" fill="var(--color-amber)" />
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
}
