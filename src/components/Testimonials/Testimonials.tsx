import { useRef, useState, useEffect, useCallback } from 'react';
import { useSectionProgress } from '../../hooks/useSectionProgress';
import { useIsMobile } from '../../hooks/useMediaQuery';
import styles from './Testimonials.module.css';

interface TestimonialItem {
  id: number;
  label: string;
  placeholder?: boolean;
  videoId?: string;
  title?: string;
  thumbnail?: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    label: 'Alan Robertson',
    videoId: 'Puqfd2CCK6Y',
    title: 'Experience Story — Alan Robertson',
    thumbnail: 'https://img.youtube.com/vi/Puqfd2CCK6Y/maxresdefault.jpg',
  },
  { id: 2, label: 'Testimonial 02', placeholder: true },
  { id: 3, label: 'Testimonial 03', placeholder: true },
  { id: 4, label: 'Testimonial 04', placeholder: true },
  { id: 5, label: 'Testimonial 05', placeholder: true },
];

export default function Testimonials() {
  const { ref, progress } = useSectionProgress();
  const isMobile = useIsMobile();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const opacity = Math.min(progress * 3, 1);
  const translateY = (1 - Math.min(progress * 2.5, 1)) * 30;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!trackRef.current) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.pageX,
      scrollLeft: trackRef.current.scrollLeft,
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    const dx = e.pageX - dragStart.current.x;
    trackRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => {
      const cards = track.querySelectorAll(`[data-card]`);
      const trackRect = track.getBoundingClientRect();
      const centerX = trackRect.left + trackRect.width / 2;

      let closest = 0;
      let closestDist = Infinity;

      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const dist = Math.abs(cardCenter - centerX);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });

      setActiveIndex(closest);
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => track.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={styles.section}
      id="testimonials"
      aria-label="Testimonials"
    >
      <div
        className={styles.header}
        style={{ opacity, transform: `translateY(${translateY}px)` }}
      >
        <span className="section-marker">02 / Experiences</span>
        <h2 className={styles.headline}>
          Every journey is<br /><em>deeply personal.</em>
        </h2>
      </div>

      <div className={styles.carousel}>
        <div
          ref={trackRef}
          className={`${styles.track} ${isDragging ? styles.dragging : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          role="region"
          aria-label="Testimonial videos"
          aria-roledescription="carousel"
        >
          <div className={styles.spacer} />
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.id}
              data-card
              className={`${styles.card} ${i === activeIndex ? styles.cardActive : ''}`}
              role="group"
              aria-roledescription="slide"
              aria-label={t.label}
              style={{
                opacity: opacity * (i === activeIndex ? 1 : 0.5),
              }}
            >
              <div className={styles.cardInner}>
                {t.videoId && playingVideo === t.videoId ? (
                  <div className={styles.cardVideoContainer}>
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${t.videoId}?autoplay=1&rel=0`}
                      title={t.title || t.label}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className={styles.cardIframe}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlayingVideo(null);
                      }}
                      className={styles.cardCloseVideo}
                      aria-label="Close video"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={styles.cardPoster}>
                      {t.thumbnail && (
                        <img
                          src={t.thumbnail}
                          alt={t.label}
                          className={styles.cardThumbnail}
                        />
                      )}
                      <div className={styles.cardGradient} />
                      {t.placeholder ? (
                        <>
                          <span className={styles.cardLabel}>[ {t.label} — Placeholder ]</span>
                          <span className={styles.cardSub}>Replace with testimonial video</span>
                        </>
                      ) : (
                        <div className={styles.cardInfo}>
                          <span className={styles.cardPerson}>{t.label}</span>
                          <span className={styles.cardSub}>Client Testimonial</span>
                        </div>
                      )}
                    </div>
                    {i === activeIndex && (
                      <button
                        className={styles.cardPlay}
                        aria-label={`Play ${t.label}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (t.videoId) {
                            setPlayingVideo(t.videoId);
                          }
                        }}
                      >
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                          <circle cx="24" cy="24" r="23" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                          <path d="M20 17l12 7-12 7z" fill="currentColor" />
                        </svg>
                      </button>
                    )}
                  </>
                )}
              </div>
              <div className={styles.cardMeta}>
                <span className={styles.cardNumber}>{String(t.id).padStart(2, '0')}</span>
                <span className={styles.cardTitle}>{t.title || 'Experience Story'}</span>
              </div>
            </div>
          ))}
          <div className={styles.spacer} />
        </div>

        {!isMobile && (
          <div className={styles.indicators}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
                onClick={() => {
                  const track = trackRef.current;
                  if (!track) return;
                  const cards = track.querySelectorAll('[data-card]');
                  cards[i]?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}