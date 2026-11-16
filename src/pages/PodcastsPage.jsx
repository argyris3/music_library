import { Pause, Play, Trash2 } from 'lucide-react';
import { useState } from 'react';
import useMusicLibrary from '../contexts/useMusicLibrary';
import usePlayer from '../contexts/usePlayer';

const HIDDEN_PODCASTS_STORAGE_KEY = 'music-library-hidden-podcasts';

const loadHiddenPodcastPaths = () => {
  try {
    const savedPaths = window.localStorage.getItem(HIDDEN_PODCASTS_STORAGE_KEY);
    if (!savedPaths) return { paths: [], error: '' };

    const parsedPaths = JSON.parse(savedPaths);
    if (!Array.isArray(parsedPaths) || !parsedPaths.every((path) => typeof path === 'string')) {
      throw new Error('Saved podcast removals have an invalid format.');
    }

    return { paths: parsedPaths, error: '' };
  } catch (error) {
    console.error('Could not load saved podcast removals.', error);
    return { paths: [], error: 'Saved podcast removals could not be loaded.' };
  }
};

const PodcastsPage = () => {
  const [hiddenPodcastState, setHiddenPodcastState] = useState(loadHiddenPodcastPaths);
  const { tracks } = useMusicLibrary();
  const { currentTrack, isPlaying, playTrack, togglePlayback } = usePlayer();
  const podcasts = tracks.filter(
    (track) => track.albumFolder === 'Podcasts' && !hiddenPodcastState.paths.includes(track.path),
  );

  const removePodcast = (path) => {
    const nextPaths = [...new Set([...hiddenPodcastState.paths, path])];
    try {
      window.localStorage.setItem(HIDDEN_PODCASTS_STORAGE_KEY, JSON.stringify(nextPaths));
      setHiddenPodcastState({ paths: nextPaths, error: '' });
    } catch (error) {
      console.error('Could not save podcast removals.', error);
      setHiddenPodcastState({
        paths: nextPaths,
        error: 'This episode was removed for this session but could not be saved.',
      });
    }
  };

  return (
    <div className="mt-8 px-5 pb-8 text-slate-200">
      <h1 className="mb-6 text-3xl font-semibold">Podcasts</h1>
      {hiddenPodcastState.error && (
        <p role="alert" className="mb-4 text-sm text-red-300">
          {hiddenPodcastState.error}
        </p>
      )}
      {podcasts.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {podcasts.map((episode) => (
            <li key={episode.path} className="flex max-w-2xl items-center gap-4 rounded-2xl border border-slate-700 p-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                <img src={episode.cover} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  aria-label={`${currentTrack?.path === episode.path && isPlaying ? 'Pause' : 'Play'} ${episode.title}`}
                  aria-pressed={currentTrack?.path === episode.path && isPlaying}
                  onClick={() =>
                    currentTrack?.path === episode.path ? togglePlayback() : playTrack(episode)
                  }
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 text-white transition hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
                >
                  {currentTrack?.path === episode.path && isPlaying ? (
                    <Pause aria-hidden="true" className="h-6 w-6" />
                  ) : (
                    <Play aria-hidden="true" className="h-6 w-6" />
                  )}
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-semibold">{episode.title}</h2>
                <p className="text-sm text-slate-400">Podcast</p>
              </div>
              <button
                type="button"
                aria-label={`Remove ${episode.title} from podcasts`}
                onClick={() => removePodcast(episode.path)}
                className="shrink-0 cursor-pointer rounded-full p-2 text-slate-300 hover:bg-red-900/70 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
              >
                <Trash2 aria-hidden="true" className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400">No podcasts available yet.</p>
      )}
    </div>
  );
};
export default PodcastsPage;
