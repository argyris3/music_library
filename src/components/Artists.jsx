import groupAlbumsByArtist from '../utils/groupAlbumsByArtist';
import useMusicLibrary from '../contexts/useMusicLibrary';
import { Link } from 'react-router-dom';

const Artists = () => {
  const { albums } = useMusicLibrary();
  const displayedArtists = groupAlbumsByArtist(albums).slice(-4);

  return (
    <div className="w-full min-w-0 px-4 lg:w-[40%] lg:px-0">
      <h2 className="pr-2 text-end text-2xl italic text-slate-200">Artists</h2>
      <div className="ml-4 mt-3 grid grid-cols-1 items-center gap-4 pl-3 sm:grid-cols-2 cursor-pointer">
        {displayedArtists.map((item) => (
          <Link
            key={item.id}
            to={`/artists/${item.id}`}
            className="flex min-w-0 items-center gap-3 text-slate-300 hover:text-white"
          >
            <img src={item.artistCover} alt="" className="h-14 w-14 shrink-0 rounded-full sm:h-20 sm:w-20" />
            <h3 className="truncate text-md">{item.artist}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Artists;
