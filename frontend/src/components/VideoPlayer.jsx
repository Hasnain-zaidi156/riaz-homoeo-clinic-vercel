/* VideoPlayer — video play/pause controls (koi autoplay nahi).
   User manually Play dabaye tab hi video start hoti hai.
   Visible Play/Pause button har video par hai.
   Desktop aur mobile dono par kaam karta hai. */
import { useRef, useState, useCallback, useEffect } from 'react';
import { Play, VolumeUp, VolumeMute, Expand } from './Icons';

export default function VideoPlayer({ src, alt, poster, className = '', onLoad }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const muted = !isMuted;
    v.muted = muted;
    setIsMuted(muted);
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!isFullscreen) {
      if (v.requestFullscreen) v.requestFullscreen();
      else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      setIsFullscreen(false);
    }
  }, [isFullscreen]);

  const handleLoadedMetadata = useCallback(() => {
    const v = videoRef.current;
    if (v) { setDuration(v.duration); setLoaded(true); }
    if (onLoad) onLoad();
  }, [onLoad]);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (v) setCurrentTime(v.currentTime);
  }, []);

  const handleEnded = useCallback(() => setIsPlaying(false), []);

  const handlePlay = useCallback(() => setIsPlaying(true), []);
  const handlePause = useCallback(() => setIsPlaying(false), []);

  const formatTime = useCallback((seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, []);

  // Exit fullscreen handler
  useEffect(() => {
    const onExit = () => {
      if (document.fullscreenElement === null && document.webkitFullscreenElement === null) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onExit);
    document.addEventListener('webkitfullscreenchange', onExit);
    return () => {
      document.removeEventListener('fullscreenchange', onExit);
      document.removeEventListener('webkitfullscreenchange', onExit);
    };
  }, []);

  // Mouse move to show/hide controls (desktop)
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    const t = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`video-player-wrapper ${className}`} style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '100%' }}>
      <div className="video-player-container" style={{ position: 'relative', width: '100%', background: '#000', borderRadius: '10px', overflow: 'hidden', aspectRatio: '16 / 9' }}>
        <video
          ref={videoRef}
          src={src}
          poster={poster || ''}
          preload="metadata"
          playsInline
          webkit-playsinline
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onClick={togglePlay}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setShowControls(true)}
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#000' }}
        />
        {loaded && (
          <div className="video-controls-overlay" style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', opacity: isPlaying || !showControls ? 0 : 1,
            transition: 'opacity 0.3s ease', zIndex: 10
          }} onClick={togglePlay}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
              <Play size={28} />
            </div>
          </div>
        )}
      </div>

      {/* Controls bar */}
      {showControls && (
        <div className="video-controls-bar" style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '10px',
          zIndex: 20, borderRadius: '0 0 10px 10px'
        }}>
          <button
            type="button"
            className="video-control-btn"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            style={{
              background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: isPlaying ? '#000' : '#333'
            }}
          >
            {isPlaying ? <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="7" width={4} height={10} /><rect x="14" y="7" width={4} height={10} /></svg> : <Play size={20} />}
          </button>

          <div className="video-progress" style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.3)', borderRadius: 2, cursor: 'pointer', position: 'relative' }} onClick={e => {
            const v = videoRef.current;
            if (!v) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            v.currentTime = pct * v.duration;
          }}>
            <div className="video-progress-fill" style={{ height: '100%', background: '#fff', borderRadius: 2, width: duration ? (currentTime / duration) * 100 : 0 }} />
          </div>

          <span className="video-time" style={{ color: '#fff', fontSize: '0.8rem', fontFamily: 'monospace', minWidth: '70px' }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <button
            type="button"
            className="video-control-btn"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            style={{
              background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#333'
            }}
          >
            {isMuted ? <VolumeMute size={16} /> : <VolumeUp size={16} />}
          </button>

          <button
            type="button"
            className="video-control-btn"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            style={{
              background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#333'
            }}
          >
            <Expand size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
