import useMusicLibrary from '../contexts/useMusicLibrary';
import { Link } from "react-router-dom";

const Albums = () => {
  const { albums } = useMusicLibrary();

  return (
    <div className="w-full min-w-0 px-4 lg:w-[60%] lg:px-0 mb-5">
      <h2 className="text-end text-2xl italic text-slate-200">Albums</h2>
      <div className="mt-3 flex cursor-pointer items-center gap-3 overflow-x-auto pb-2 pl-2">
        {albums.map((item) => (
          <Link
            key={item.id}
            to={`/albums-details/${item.id}`}
            className="flex w-36 shrink-0 flex-col text-slate-300 hover:text-white sm:w-40"
          >
            <img src={item.cover} alt={`${item.album} cover`} className="aspect-square w-full rounded-3xl object-cover" />
            <h2 className="truncate text-center text-lg">{item.artist}</h2>
            <p className="truncate text-md">{item.album}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Albums;
