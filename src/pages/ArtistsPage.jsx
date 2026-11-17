import { useState } from 'react';
import { Mic, Play } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import groupAlbumsByArtist from '../utils/groupAlbumsByArtist';
import getTracksForAlbum from '../utils/getTracksForAlbum';
import useMusicLibrary from '../contexts/useMusicLibrary';
import usePlayer from '../contexts/usePlayer';

const ArtistsPage = ({ playlists, onAddTrackToPlaylist }) => {
  const [playlistTrackPath, setPlaylistTrackPath] = useState(null);
  const { albums, tracks } = useMusicLibrary();
  const { playAlbum, playTrack } = usePlayer();
  const { artistId } = useParams();
  const artistGroups = groupAlbumsByArtist(albums);
  const selectedArtist = artistGroups.find((group) => group.albums.some((album) => String(album.id) === artistId));
  const displayedArtists = selectedArtist ? [selectedArtist] : artistGroups;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <div className="mt-3 flex flex-1 px-4">
        <div className="flex w-[30%] flex-col border-r border-mist-400">
          <div className="flex items-center gap-4 pb-3 pl-5">
            <Mic className="h-6 w-6 text-slate-200" aria-hidden="true" />
            <Link to="/artists" className="text-3xl italic text-slate-300 hover:text-white">
              Artists
            </Link>
          </div>
          <div className="mx-2 border-b border-mist-400" aria-hidden="true" />

          <div className="mt-5 flex w-full flex-col gap-3 pb-3 pr-2 text-3xl">
            {artistGroups.map((item) => (
              <Link
                key={item.id}
                to={`/artists/${item.id}`}
                aria-current={selectedArtist?.id === item.id ? 'page' : undefined}
                className={`flex w-full min-w-0 items-center gap-3 border-b border-mist-400 px-3 py-2 text-left text-slate-300 hover:bg-slate-800/60 ${
                  selectedArtist?.id === item.id ? 'bg-slate-800/60' : ''
                }`}
              >
                <img src={item.artistCover} alt="" className="h-7 w-7 shrink-0 rounded-full" />
                <span className="truncate text-md">{item.artist}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-2 w-[70%] px-10 pb-64 lg:pb-32">
          <h1 className="mb-2 pl-5 text-3xl font-semibold text-slate-300">{selectedArtist?.artist ?? 'All Artists'}</h1>
          <div className="mx-2 w-full border-b border-mist-400" aria-hidden="true" />
          <div className="mt-6 flex flex-col gap-8">
            {displayedArtists.map((artist) => (
              <section key={artist.id} className="flex flex-col gap-6">
                {!selectedArtist && <h2 className="text-2xl font-semibold text-slate-300">{artist.artist}</h2>}
                {artist.albums.map((album) => (
                  <div key={album.id} className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
                    <img
                      src={album.cover}
                      className="aspect-square w-full max-w-64 rounded-3xl object-cover"
                      alt={`${album.album} album cover`}
                    />
                    <div className="flex min-w-0 flex-col gap-1 text-slate-300">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="min-w-0 truncate text-3xl font-bold">{album.album}</h3>
                        <button
                          type="button"
                          aria-label={`Play ${album.album}`}
                          onClick={() => playAlbum(album)}
                          className="shrink-0 cursor-pointer rounded-full p-2 text-slate-300 transition hover:bg-slate-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
                        >
                          <Play aria-hidden="true" className="h-5 w-5" />
                        </button>
                      </div>
                      {album.genre && album.year && (
                        <p>
                          {album.genre} · {album.year}
                        </p>
                      )}
                      <div className="mt-3 border-b border-mist-400" aria-hidden="true" />
                      <ol className="mt-4 font-medium text-slate-300">
                        {getTracksForAlbum(tracks, album)
                          .map((track, index) => (
                            <li
                              key={track.path}
                              className="group flex items-center gap-2 border-b border-mist-400 py-3"
                            >
                              <span className="w-5 shrink-0 text-slate-400">{index + 1}</span>
                              <button
                                type="button"
                                aria-label={`Play ${track.title}`}
                                onClick={() => playTrack(track)}
                                className="cursor-pointer rounded p-1 text-slate-400 opacity-0 transition hover:text-white focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                              >
                                <Play aria-hidden="true" className="h-4 w-4" />
                              </button>
                              <span>{track.title}</span>
                              <div className="relative ml-auto">
                                <button
                                  type="button"
                                  aria-label={`More options for ${track.title}`}
                                  aria-expanded={playlistTrackPath === track.path}
                                  onClick={() =>
                                    setPlaylistTrackPath((path) => (path === track.path ? null : track.path))
                                  }
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
                                      <p className="whitespace-nowrap px-3 py-2 text-slate-800">
                                        Create a playlist first.
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </li>
                          ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ArtistsPage;
