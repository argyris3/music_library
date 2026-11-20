import { useState } from 'react';
import { Link } from 'react-router-dom';
import blues from '../assets2/blues.jpg';
import classicRock from '../assets2/classicRock.jpg';
import electronic from '../assets2/electronic.jpg';
import entexno from '../assets2/entexno.jpg';
import hardRock from '../assets2/hardRock.jpg';
import jazz from '../assets2/jazz.jpg';
import useMusicLibrary from '../contexts/useMusicLibrary';
import postRock from '../assets2/postRock.jpg';
import soundtrack from '../assets2/soundtrack.jpg';

const genres = [
  {
    name: 'Classic Rock',
    image: classicRock,
    artists: ['Eloy', 'Dire Straits', 'Jethro Tull', 'Pink Floyd', 'Trypes', 'The Beatles', 'Radiohead'],
  },
  { name: 'Hard Rock', image: hardRock, artists: [] },
  {
    name: 'Post Rock',
    image: postRock,
    artists: [
      'Mogwai',
      'Godspeed',
      'Godspeed You! Black Emperor',
      'Godspeed You Black Emperor',
      'Mono',
      'Slint',
      'Protomartyr',
      'Joy Division',
      'If these trees could talk',
    ],
    artistKeywords: ['Godspeed'],
  },
  {
    name: 'Jazz',
    image: jazz,
    artists: [
      'Billie Holiday',
      'Keith Jarret',
      'Anouar Brahem',
      'Vijay Iyer',
      'John Coltrane',
      'John Abercrombie',
      'Miles Davis',
      'Chick Corea',
    ],
  },
  { name: 'Electronic', image: electronic, artists: ['Deep Dish', 'Thievery Corporation', 'Massive Attack'] },
  {
    name: 'Εντεχνο',
    image: entexno,
    artists: ['Thanasis Papakonstantinou', 'Thanos Mikroutsikos'],
  },
  { name: 'Blues', image: blues, artists: ['Billie Holiday'] },
  {
    name: 'Soundtracks',
    image: soundtrack,
    artists: ['Massive Attack'],
    folders: ['from dusk till down  ost'],
  },
];

const ExplorePage = () => {
  const { albums } = useMusicLibrary();
  const [selectedGenre, setSelectedGenre] = useState(null);
  const normalizeGenre = (genre) => genre?.toLowerCase().replace(/[\s-]/g, '');
  const selectedAlbums = selectedGenre
    ? albums.filter(
        (album) =>
          (album.genre && normalizeGenre(album.genre) === normalizeGenre(selectedGenre.name)) ||
          selectedGenre.artists?.includes(album.artist) ||
          selectedGenre.artistKeywords?.some((keyword) =>
            album.artist?.toLowerCase().includes(keyword.toLowerCase()),
          ) ||
          selectedGenre.folders?.includes(album.folder),
      )
    : [];

  return (
    <div className="mt-10 px-5 pb-64 lg:pb-32">
      <div className="flex flex-wrap gap-5">
        {genres.map((genre) => (
          <button
            key={genre.name}
            type="button"
            aria-pressed={selectedGenre?.name === genre.name}
            onClick={() => setSelectedGenre(genre)}
            className={`group relative h-40 w-60 cursor-pointer overflow-hidden rounded-3xl text-left transition ${
              selectedGenre?.name === genre.name ? 'ring-2 ring-sky-400' : ''
            }`}
          >
            <img
              src={genre.image}
              alt=""
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-0 ml-3 flex items-end bg-gradient-to-t from-black/75 to-transparent p-4 text-2xl font-medium capitalize text-slate-100">
              {genre.name}
            </span>
          </button>
        ))}
      </div>

      {selectedGenre && (
        <section className="mt-10 text-slate-200" aria-live="polite">
          <h1 className="mb-5 text-3xl font-semibold">{selectedGenre.name} albums</h1>
          {selectedAlbums.length > 0 ? (
            <div className="flex flex-wrap gap-5">
              {selectedAlbums.map((album) => (
                <Link
                  key={album.id}
                  to={`/albums-details/${album.id}`}
                  className="w-40 text-slate-300 transition hover:text-white"
                >
                  <img
                    src={album.cover}
                    alt={`${album.album} cover`}
                    className="aspect-square w-full rounded-3xl object-cover"
                  />
                  <h2 className="mt-2 truncate text-lg">{album.album}</h2>
                  <p className="truncate text-sm text-slate-400">{album.artist}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No albums in this genre yet.</p>
          )}
        </section>
      )}
    </div>
  );
};

export default ExplorePage;
