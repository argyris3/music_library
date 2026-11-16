import { Search, SquareLibrary, Radio, Mic, Plus, Trash2 } from 'lucide-react';
import vinylImage from '../assets2/vinyl.png';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ onCreatePlaylist, onDeletePlaylist, playlistStorageError, playlists }) => {
  const navigate = useNavigate();

  return (
    <div className="hidden lg:block w-[18%] h-full text-slate-300 border-r border-slate-500 cursor-pointer   ">
      <div onClick={() => navigate('/')} className="flex items-center justify-center gap-3 px-3 py-5 ">
        <img className="w-6 h-6  lg:w-10 lg:h-10 vinyl-record" src={vinylImage} alt="" aria-hidden="true" />
        <h1 className="hidden italic text-4xl font-medium lg:block">Vinylio</h1>
      </div>
      <div className="mt-9 border-t border-slate-500  ">
        <div className="mx-auto mt-3 flex w-max -translate-x-8 flex-col items-start justify-center gap-5 px-0 py-0 font-semibold">
          <div className="flex items-center  gap-2 text-2xl ">
            <span>
              <Search />
            </span>
            <Link to="/explore" className="">
              Explore
            </Link>
          </div>
          <Link to="/albums" className="flex items-center  gap-2 text-2xl ">
            <span>
              <SquareLibrary />
            </span>
            <h2>Albums</h2>
          </Link>
          <Link to="/artists" className="flex items-center gap-2 text-2xl hover:text-white">
            <span aria-hidden="true">
              <Mic />
            </span>
            <span>Artists</span>
          </Link>
          <div className="flex items-center  gap-2 text-2xl ">
            <span>
              <Radio />
            </span>
            <Link to="/podcasts">Podcasts</Link>
          </div>
        </div>
      </div>
      <div className="hidden mt-6 border-t border-slate-500 text-black text-xl lg:block">
        <div className="px-10 mt-6  ">
          <button
            type="button"
            onClick={onCreatePlaylist}
            className="bg-sky-300 px-3 py-3 rounded-3xl cursor-pointer flex items-center gap-1"
          >
            <Plus />
            create playlist
          </button>
        </div>
      </div>
      <div className="hidden mt-6 border-t border-slate-500 text-black text-xl lg:block">
        {playlists.map((playlist, index) => (
          <div key={playlist.id || `${playlist.name}-${index}`} className="mt-6 px-10">
            <div className="flex items-center gap-2 rounded-3xl bg-sky-300 px-2 py-2 text-slate-900">
              <Link
                to={`/playlists/${playlist.id}`}
                className="flex min-w-0 flex-1 items-center gap-2 hover:text-slate-700"
              >
                <img
                  src={playlist.cover || vinylImage}
                  alt=""
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                />
                <span className="truncate">{playlist.name}</span>
              </Link>
              <button
                type="button"
                aria-label={`Delete ${playlist.name}`}
                onClick={() => onDeletePlaylist(playlist.id)}
                className="ml-auto shrink-0 cursor-pointer rounded-full p-1 text-slate-800 hover:bg-sky-400"
              >
                <Trash2 aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
        {playlistStorageError && (
          <p role="alert" className="px-4 pt-3 text-sm text-red-300">
            {playlistStorageError}
          </p>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
