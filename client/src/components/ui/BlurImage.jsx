import { useState } from 'react';
import { motion } from 'framer-motion';

function getWebpSrc(src) {
  if (!src || src.startsWith('http')) return null;
  const ext = src.split('.').pop().toLowerCase();
  if (ext === 'png' || ext === 'gif') return null;
  const dot = src.lastIndexOf('.');
  if (dot === -1) return null;
  return src.slice(0, dot) + '.webp';
}

export default function BlurImage({ src, alt, className, priority, ...props }) {
  const [loaded, setLoaded] = useState(false);
  const webpSrc = getWebpSrc(src);
  const loadingAttr = priority ? 'eager' : 'lazy';

  return (
    <div className={`relative overflow-hidden ${className || ''}`} {...props}>
      <div className={`absolute inset-0 bg-gradient-to-r from-ivory-200/60 via-ivory-100/80 to-ivory-200/60 dark:from-dark-800/60 dark:via-dark-700/80 dark:to-dark-800/60 bg-[length:200%_100%] ${loaded ? 'opacity-0' : 'animate-shimmer opacity-100'} transition-opacity duration-500`} />
      <picture>
        {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
        <motion.img
          src={src}
          alt={alt}
          loading={loadingAttr}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full ${loaded ? 'opacity-100 blur-0' : 'opacity-30 blur-2xl'} transition-all duration-700`}
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          initial={{ scale: 1.1 }}
          animate={loaded ? { scale: 1 } : {}}
          transition={{ duration: 0.7 }}
        />
      </picture>
    </div>
  );
}