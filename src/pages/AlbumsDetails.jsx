import { useState } from 'react';
import { Play, Shuffle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import NowPlayingIndicator from '../components/NowPlayingIndicator';
import useMusicLibrary from '../contexts/useMusicLibrary';
import usePlayer from '../contexts/usePlayer';
import getTracksForAlbum from '../utils/getTracksForAlbum';

const AlbumsDetails = ({ playlists, onAddTrackToPlaylist }) => {
  const [playlistTrackPath, setPlaylistTrackPath] = useState(null);
  const { albums, tracks } = useMusicLibrary();
  const { currentTrack, isPlaying, playAlbum, playTrack } = usePlayer();
  const { albumId } = useParams();
  const selectedAlbum = albums.find((item) => String(item.id) === albumId);
  const album = selectedAlbum ?? albums.find((item) => String(item.id) === '2') ?? albums[0];
  if (!album) return <p className="mt-8 px-5 text-slate-400">Album not found.</p>;

  const albumTracks = getTracksForAlbum(tracks, album);

  return (
    <div className="mt-8 flex min-h-full flex-1 flex-col">
      <section className="flex flex-col items-center gap-8 rounded-3xl bg-gradient-to-br from-black via-sky-950 to-amber-200 p-6 sm:flex-row sm:items-start sm:p-8">
        <img src={album.cover} className="h-60 w-60 rounded-3xl object-cover" alt={`${album.album} cover`} />
        <div className="flex min-w-0 flex-col gap-2 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-slate-300">{album.album}</h1>
          <h2 className="text-2xl font-medium text-sky-500">{album.artist}</h2>
          {album.genre && album.year && (
            <p className="text-slate-400">
              {album.genre} · {album.year}
            </p>
          )}
          <div className="mt-6 flex items-center justify-center gap-5 sm:justify-start">
            <button
              type="button"
              aria-label={`Shuffle ${album.album}`}
              onClick={() => playAlbum(album, true)}
              className="rounded-full bg-gray-600 px-2 py-2 text-slate-300 cursor-pointer"
            >
              <Shuffle aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => playAlbum(album)}
              className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-black cursor-pointer"
            >
              <Play aria-hidden="true" />
              <span className="text-xl font-semibold">Play</span>
            </button>
          </div>
        </div>
      </section>

      <ol className="mt-8 min-w-0 px-3 pb-64 text-slate-300 lg:pb-32">
        {albumTracks.map((track, index) => (
          <li key={track.path} className="group flex min-w-0 items-center gap-2 border-b border-mist-400 py-3">
            <span className="w-6 shrink-0 text-slate-400">{index + 1}</span>
            {isPlaying && currentTrack?.path === track.path ? (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center">
                <NowPlayingIndicator />
              </span>
            ) : (
              <button
                type="button"
                aria-label={`Play ${track.title}`}
                onClick={() => playTrack(track)}
                className="shrink-0 cursor-pointer p-1 text-slate-400 opacity-0 transition hover:text-white focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
              >
                <Play aria-hidden="true" className="h-5 w-5" />
              </button>
            )}
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="min-w-0 break-words">{track.title}</span>
            </div>
            <div className="relative ml-auto shrink-0">
              <button
                type="button"
                aria-label={`More options for ${track.title}`}
                aria-expanded={playlistTrackPath === track.path}
                onClick={() => setPlaylistTrackPath((path) => (path === track.path ? null : track.path))}
                className="cursor-pointer px-2 py-2 text-end text-xl"
              >
                ...
              </button>
              {playlistTrackPath === track.path && (
                <div className="absolute right-0 top-full z-10 min-w-48 rounded-2xl bg-sky-200 p-1 shadow-xl">
                  {playlists.length > 0 ? (
                    playlists.map((playlist) => (
                      <button
                        key={playlist.id}
                        type="button"
                        onClick={() => {
                          onAddTrackToPlaylist(playlist.id, track.path);
                          setPlaylistTrackPath(null);
                        }}
                        className="block w-full cursor-pointer whitespace-nowrap rounded-xl px-3 py-2 text-left text-slate-800 hover:bg-sky-300"
                      >
                        Add to {playlist.name}
                      </button>
                    ))
                  ) : (
                    <p className="whitespace-nowrap px-3 py-2 text-slate-800">Create a playlist first.</p>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
export default AlbumsDetails;
