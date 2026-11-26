import { useEffect, useRef, useState } from 'react';
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Shuffle,
  Volume2,
  VolumeX,
} from 'lucide-react';
import NowPlayingIndicator from './NowPlayingIndicator';
import usePlayer from '../contexts/usePlayer';

const formatTime = (time) => {
  if (!Number.isFinite(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const Player = ({ isHome = false }) => {
  const {
    currentTrack,
    isPlaying,
    isShuffle,
    playbackKey,
    queueError,
    playNext,
    playPrevious,
    stopPlayback,
    togglePlayback,
    toggleShuffle,
  } = usePlayer();
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const previousVolumeRef = useRef(0.7);
  const [playbackError, setPlaybackError] = useState('');
  const previousTrackRef = useRef(currentTrack);
  const previousPlaybackKeyRef = useRef(playbackKey);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const shouldResetTrack =
      previousTrackRef.current !== currentTrack ||
      previousPlaybackKeyRef.current !== playbackKey;

    if (shouldResetTrack) {
      previousTrackRef.current = currentTrack;
      previousPlaybackKeyRef.current = playbackKey;
      audio.pause();
      audio.currentTime = 0;
      setCurrentTime(0);
      setDuration(0);
      setPlaybackError('');
      audio.load();
    }

    if (isPlaying) {
      audio.play().catch(() => {
        stopPlayback();
        setPlaybackError('This track could not be played.');
      });
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying, playbackKey, stopPlayback]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleTogglePlayback = () => {
    setPlaybackError('');
    togglePlayback();
  };

  const seekTo = (event) => {
    const time = Number(event.target.value);
    if (audioRef.current) audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const updateVolume = (event) => {
    const nextVolume = Number(event.target.value);
    if (nextVolume > 0) previousVolumeRef.current = nextVolume;
    setVolume(nextVolume);
    if (audioRef.current) audioRef.current.volume = nextVolume;
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(previousVolumeRef.current);
    } else {
      previousVolumeRef.current = volume;
      setVolume(0);
    }
  };

  if (!currentTrack) return null;

  return (
    <section
      aria-label="Music player"
      className={`${isHome
        ? 'fixed inset-x-0 bottom-20 z-40 mx-4 w-auto rounded-3xl border border-slate-300 bg-black/30 p-2 text-slate-300 shadow-xl lg:bottom-4 lg:left-[30%] lg:right-[12%] lg:mx-6 lg:px-4 lg:py-3'
        : 'fixed inset-x-0 bottom-20 z-40 mx-4 rounded-3xl border border-slate-300 bg-black/30 p-2 text-slate-300 shadow-xl lg:bottom-4 lg:left-[30%] lg:right-[12%] lg:mx-6 lg:px-4 lg:py-3'
      }`}
    >
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onEnded={playNext}
      />

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
        <div className="flex min-w-0 items-center gap-2 lg:gap-3">
          <img
            src={currentTrack.cover}
            alt={`${currentTrack.album} album cover`}
            className="h-8 w-8 shrink-0 rounded-lg object-cover lg:h-10 lg:w-10 lg:rounded-xl"
          />
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-1">
              <p className="min-w-0 truncate text-sm font-semibold text-slate-200 lg:text-base">
                {currentTrack.title}
              </p>
              {isPlaying && <NowPlayingIndicator />}
            </div>
            <p className="truncate text-xs text-slate-400 lg:text-sm">{currentTrack.album}</p>
          </div>
        </div>

        <div className="contents lg:flex lg:flex-col lg:items-center lg:gap-1">
          <div className="flex items-center gap-2 lg:gap-5">
            <button
              type="button"
              aria-label={isShuffle ? 'Disable shuffle' : 'Enable shuffle'}
              aria-pressed={isShuffle}
              onClick={toggleShuffle}
              className={`cursor-pointer ${isShuffle ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-100'}`}
            >
              <Shuffle aria-hidden="true" className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>
            <button
              type="button"
              aria-label="Previous track"
              onClick={playPrevious}
              className="cursor-pointer text-slate-300 hover:text-white"
            >
              <SkipBack aria-hidden="true" className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>
            <button
              type="button"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={handleTogglePlayback}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-200 text-slate-900 transition hover:bg-white lg:h-9 lg:w-9"
            >
              {isPlaying ? (
                <Pause aria-hidden="true" className="h-4 w-4 lg:h-5 lg:w-5" />
              ) : (
                <Play aria-hidden="true" className="ml-0.5 h-4 w-4 lg:h-5 lg:w-5" />
              )}
            </button>
            <button
              type="button"
              aria-label="Next track"
              onClick={playNext}
              className="cursor-pointer text-slate-300 hover:text-white"
            >
              <SkipForward aria-hidden="true" className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>
          </div>
          <div className="col-span-2 flex w-full max-w-sm items-center gap-2 justify-self-center text-xs text-slate-500 lg:col-span-1">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              aria-label="Track progress"
              min="0"
              max={duration || 0}
              value={Math.min(currentTime, duration || 0)}
              onChange={seekTo}
              className="h-1 min-w-0 flex-1 cursor-pointer accent-slate-300"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="hidden items-center justify-center gap-2 lg:flex lg:justify-self-end">
          <button
            type="button"
            aria-label={volume === 0 ? 'Unmute' : 'Mute'}
            aria-pressed={volume === 0}
            onClick={toggleMute}
            className="cursor-pointer text-slate-400 hover:text-slate-100"
          >
            {volume === 0 ? (
              <VolumeX aria-hidden="true" className="h-5 w-5 shrink-0" />
            ) : (
              <Volume2 aria-hidden="true" className="h-5 w-5 shrink-0" />
            )}
          </button>
          <input
            type="range"
            aria-label="Volume"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={updateVolume}
            className="h-1 w-24 cursor-pointer accent-slate-300"
          />
        </div>
      </div>
      {playbackError && (
        <p role="status" className="mt-3 text-center text-sm text-rose-300">
          {playbackError}
        </p>
      )}
      {queueError && (
        <p role="status" className="mt-3 text-center text-sm text-rose-300">
          {queueError}
        </p>
      )}
    </section>
  );
};

export default Player;
