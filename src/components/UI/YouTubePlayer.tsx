import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './YouTubePlayer.module.css';

/* ---- Minimal typings for the YouTube IFrame Player API ---- */
interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  setVolume(volume: number): void;
  getPlayerState(): number;
  destroy(): void;
}

interface YTNamespace {
  Player: new (el: HTMLElement, options: object) => YTPlayer;
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const STATE_PLAYING = 1;
const STATE_BUFFERING = 3;

let apiPromise: Promise<YTNamespace> | null = null;

function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve(window.YT!);
      };
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.appendChild(script);
    });
  }
  return apiPromise;
}

/** Only one video on the page plays at a time. */
let currentPlayer: YTPlayer | null = null;

/** Videos wait for the visitor's first scroll, so nothing starts the moment the site opens. */
function useHasScrolled(): boolean {
  const [scrolled, setScrolled] = useState(() => window.scrollY > 0);
  useEffect(() => {
    if (scrolled) return;
    const onScroll = () => setScrolled(true);
    window.addEventListener('scroll', onScroll, { passive: true, once: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrolled]);
  return scrolled;
}

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  /** Extra condition for playing, e.g. "this carousel card is the active one". */
  active?: boolean;
  /** Shown over the poster before the video starts. */
  caption?: string;
  className?: string;
}

/**
 * YouTube video that starts playing, with sound, once the visitor scrolls it into view
 * and pauses when it leaves. Browsers refuse sound until the visitor has tapped or clicked
 * the page; in that case it plays muted with a "Tap for sound" button instead.
 * With prefers-reduced-motion it waits for a click.
 */
export default function YouTubePlayer({
  videoId,
  title,
  active = true,
  caption,
  className = '',
}: YouTubePlayerProps) {
  const reducedMotion = useReducedMotion();
  const hasScrolled = useHasScrolled();
  const wrapRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const readyRef = useRef(false);
  const shouldPlayRef = useRef(false);
  const [inView, setInView] = useState(false);
  const [clickedPlay, setClickedPlay] = useState(false);
  const [started, setStarted] = useState(false);
  const [needsSound, setNeedsSound] = useState(false);

  const shouldPlay = clickedPlay || (active && inView && hasScrolled && !reducedMotion);
  // The player is created the first time the video should play and kept afterwards
  if (shouldPlay && !started) setStarted(true);

  useEffect(() => {
    shouldPlayRef.current = shouldPlay;
  }, [shouldPlay]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    // Short dwell so videos the page merely scrolls past (e.g. a menu jump) don't start
    let timer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(timer);
        if (entry.isIntersecting) timer = window.setTimeout(() => setInView(true), 400);
        else setInView(false);
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Try with sound first; if the browser blocks it, keep the video moving muted.
  const play = useCallback(() => {
    const player = playerRef.current;
    if (!player || !readyRef.current) return;
    if (currentPlayer && currentPlayer !== player) currentPlayer.pauseVideo();
    currentPlayer = player;

    player.unMute();
    player.setVolume(100);
    player.playVideo();

    window.setTimeout(() => {
      if (playerRef.current !== player || !shouldPlayRef.current) return;
      const state = player.getPlayerState();
      if (state !== STATE_PLAYING && state !== STATE_BUFFERING) {
        player.mute();
        player.playVideo();
      }
      setNeedsSound(player.isMuted());
    }, 1200);
  }, []);

  useEffect(() => {
    if (!started) return;

    let cancelled = false;
    loadYouTubeApi().then((YT) => {
      if (cancelled || !mountRef.current) return;
      const host = document.createElement('div');
      mountRef.current.appendChild(host);
      playerRef.current = new YT.Player(host, {
        videoId,
        host: 'https://www.youtube-nocookie.com',
        width: '100%',
        height: '100%',
        playerVars: { playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: () => {
            readyRef.current = true;
            if (shouldPlayRef.current) play();
          },
          onAutoplayBlocked: () => {
            playerRef.current?.mute();
            playerRef.current?.playVideo();
            setNeedsSound(true);
          },
          onStateChange: (e: { data: number }) => {
            const player = playerRef.current;
            if (!player) return;
            if (e.data === STATE_PLAYING) {
              if (currentPlayer && currentPlayer !== player) currentPlayer.pauseVideo();
              currentPlayer = player;
            }
            setNeedsSound(player.isMuted());
          },
        },
      });
    });

    return () => {
      cancelled = true;
    };
  }, [started, videoId, play]);

  // Scrolling in and out plays and pauses an existing player.
  useEffect(() => {
    if (!readyRef.current) return;
    if (shouldPlay) play();
    else playerRef.current?.pauseVideo();
  }, [shouldPlay, play]);

  useEffect(() => {
    return () => {
      const player = playerRef.current;
      if (currentPlayer === player) currentPlayer = null;
      player?.destroy();
      playerRef.current = null;
    };
  }, []);

  const turnSoundOn = () => {
    const player = playerRef.current;
    if (!player) return;
    player.unMute();
    player.setVolume(100);
    player.playVideo();
    setNeedsSound(false);
  };

  return (
    <div ref={wrapRef} className={`${styles.player} ${className}`}>
      <img
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        className={styles.poster}
        loading="lazy"
      />

      <div ref={mountRef} className={styles.mount} />

      {!started && (
        <button
          className={styles.playOverlay}
          onClick={() => setClickedPlay(true)}
          aria-label={`Play ${title}`}
        >
          <span className={styles.posterShade} />
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <circle cx="32" cy="32" r="31" stroke="currentColor" strokeWidth="1" opacity="0.6" />
            <path d="M26 22l16 10-16 10z" fill="currentColor" />
          </svg>
          {caption && <span className={styles.caption}>{caption}</span>}
        </button>
      )}

      {started && needsSound && (
        <button className={styles.soundButton} onClick={turnSoundOn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
            <path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Tap for sound
        </button>
      )}
    </div>
  );
}
