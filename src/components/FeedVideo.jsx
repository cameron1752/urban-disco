import { useRef, useEffect, useState } from 'react';
import CardMedia from '@mui/material/CardMedia';

export default function FeedVideo({ video, index, isNext, onVisible }) {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          onVisible(index); // tell the parent "I'm the current one"
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index, onVisible]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (isVisible) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [isVisible]);

  return (
    <CardMedia
      ref={videoRef}
      component="video"
      image={video.videoUrl}
      controls
      loop
      muted
      playsInline
      preload={isVisible || isNext ? "auto" : "none"}
      sx={{ width: "100%", height: "100vh", display: "block", objectFit: "cover" }}
    />
  );
}