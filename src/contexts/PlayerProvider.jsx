import { useCallback, useRef, useState } from 'react';
import PlayerContext from './playerContext';
import useMusicLibrary from './useMusicLibrary';

const PlayerProvider = ({ children }) => {
  const { tracks } = useMusicLibrary();
  const [queue, setQueue] = useState(tracks);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [playbackKey, setPlaybackKey] = useState(0);
  const [queueError, setQueueError] = useState('');
  const requestId = useRef(0);

  const playAlbum = useCallback((folder, shuffle = false) => {
    const albumQueue = tracks.filter((track) => track.albumFolder === folder);
    if (albumQueue.length === 0) {
      setQueueError('This album has no playable tracks.');
      setIsPlaying(false);
      return;
    }

    const startIndex = shuffle ? Math.floor(Math.random() * albumQueue.length) : 0;
    setQueue(albumQueue);
    setTrackIndex(startIndex);
    setIsShuffle(shuffle);
    setIsPlaying(true);
    setQueueError('');
    requestId.current += 1;
    setPlaybackKey(requestId.current);
  }, [tracks]);

  const playTrack = useCallback((track) => {
    const albumQueue = tracks.filter((item) => item.albumFolder === track.albumFolder);
    const startIndex = albumQueue.findIndex((item) => item.path === track.path);
    if (startIndex === -1) {
      setQueueError('This track is not available.');
      setIsPlaying(false);
      return;
    }

    setQueue(albumQueue);
    setTrackIndex(startIndex);
    setIsShuffle(false);
    setIsPlaying(true);
    setQueueError('');
    requestId.current += 1;
    setPlaybackKey(requestId.current);
  }, [tracks]);

  const playNext = useCallback(() => {
    if (queue.length < 2) return;
    setTrackIndex((index) => {
      if (isShuffle) {
        let nextIndex = index;
        while (nextIndex === index) {
          nextIndex = Math.floor(Math.random() * queue.length);
        }
        return nextIndex;
      }
      return (index + 1) % queue.length;
    });
    setIsPlaying(true);
  }, [isShuffle, queue.length]);

  const playPrevious = useCallback(() => {
    if (queue.length < 2) return;
    setTrackIndex((index) => (index - 1 + queue.length) % queue.length);
    setIsPlaying(true);
  }, [queue.length]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((shuffle) => !shuffle);
  }, []);

  const togglePlayback = useCallback(() => {
    setIsPlaying((playing) => !playing);
  }, []);

  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const currentTrack = queue[trackIndex];

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isShuffle,
        playbackKey,
        queueError,
        playAlbum,
        playTrack,
        playNext,
        playPrevious,
        stopPlayback,
        togglePlayback,
        toggleShuffle,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
