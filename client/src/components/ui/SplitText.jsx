import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function SplitText({ text, className, as: Tag = 'h2', delay = 0, stagger = 0.04 }) {
  const words = useMemo(() => text.split(' '), [text]);

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 20, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={className}
      style={{ perspective: '500px' }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block mr-[0.25em]">
          <motion.span variants={child} className="inline-block" style={{ transformStyle: 'preserve-3d' }}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
}
