
import { Link } from 'react-router-dom';
import useMusicLibrary from '../contexts/useMusicLibrary';

const AlbumsPage = () => {
  const { albums } = useMusicLibrary();

  return (
    <div className="mt-5 w-full px-4 pb-64 text-slate-300 lg:pb-32">
      <h1 className="mb-5 text-3xl font-medium italic">Albums</h1>
      <div className="flex flex-wrap gap-1">
        {albums.map((item) => (
          <Link
            key={item.id}
            to={`/albums-details/${item.id}`}
            className="flex w-60 shrink-0 flex-col gap-1 hover:text-white"
          >
            <img
              src={item.cover}
              alt={`${item.album} cover`}
              className="h-50 w-50 rounded-3xl object-cover"
            />
            <h2 className="truncate text-lg">{item.album}</h2>
            <p className="truncate text-sm text-sky-400">{item.artist}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default AlbumsPage;