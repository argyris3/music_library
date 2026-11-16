import { Play } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import vinylImage from '../assets2/vinyl.png';
import useMusicLibrary from '../contexts/useMusicLibrary';
import usePlayer from '../contexts/usePlayer';

const PlaylistDetailsPage = ({ playlists }) => {
  const { playlistId } = useParams();
  const { tracks } = useMusicLibrary();
  const { playTrack } = usePlayer();
  const playlist = playlists.find((item) => item.id === playlistId);
  const playlistTracks = playlist
    ? playlist.tracks.map((path) => tracks.find((track) => track.path === path)).filter(Boolean)
    : [];

  if (!playlist) {
    return (
      <section className="mt-8 px-5 text-slate-200">
        <h1 className="text-3xl font-semibold">Playlist not found</h1>
        <Link to="/" className="mt-4 inline-block text-sky-300 hover:text-white">
          Return to library
        </Link>
      </section>
    );
  }

  return (
    <div className="mt-8 flex min-h-full flex-1 flex-col px-5 text-slate-200">
      <section className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <img
          src={playlist.cover || vinylImage}
          alt={`${playlist.name} cover`}
          className="h-48 w-48 rounded-3xl object-cover"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold">{playlist.name}</h1>
          <p className="mt-2 text-slate-400">{playlistTracks.length} songs</p>
        </div>
      </section>
      {playlistTracks.length > 0 ? (
        <ol className="mt-8 text-slate-300">
          {playlistTracks.map((track, index) => (
            <li key={track.path} className="flex items-center gap-3 border-b border-mist-400 py-3">
              <span className="w-6 shrink-0 text-slate-400">{index + 1}</span>
              <button
                type="button"
                aria-label={`Play ${track.title}`}
                onClick={() => playTrack(track)}
                className="cursor-pointer rounded p-1 text-slate-400 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
              >
                <Play aria-hidden="true" className="h-5 w-5" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate">{track.title}</p>
                <p className="truncate text-sm text-slate-400">
                  {track.album} · {track.albumFolder}
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-8 text-slate-400">This playlist is empty. Add songs from an album or artist page.</p>
      )}
    </div>
  );
};

export default PlaylistDetailsPage;
