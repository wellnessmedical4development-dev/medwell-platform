import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RippleButton({ children, className, onClick, href, ...props }) {
  const [ripples, setRipples] = useState([]);

  const handleClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 1000);
    if (!href) onClick?.(e);
  }, [onClick, href]);

  const Tag = href ? 'a' : 'button';

  return (
    <Tag href={href} target={href ? '_blank' : undefined} rel={href ? 'noopener noreferrer' : undefined} className={`relative overflow-hidden ${className || ''}`} onClick={handleClick} {...props}>
      {children}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            initial={{ scale: 0, opacity: 0.4, x: r.x, y: r.y }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute pointer-events-none w-[20px] h-[20px] rounded-full bg-white/30 -translate-x-1/2 -translate-y-1/2"
            style={{ left: 0, top: 0 }}
          />
        ))}
      </AnimatePresence>
    </Tag>
  );
}
