import { Search, SquareLibrary, Radio, Mic, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import vinylImage from '../assets2/vinyl.png';

function MobileSidebar({ onCreatePlaylist, onDeletePlaylist, playlistStorageError, playlists }) {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-700 bg-black/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 text-slate-300 backdrop-blur lg:hidden"
    >
      {playlistStorageError && (
        <p role="alert" className="mx-auto mb-2 max-w-lg px-2 text-xs text-red-300">
          {playlistStorageError}
        </p>
      )}
      {playlists.length > 0 && (
        <div className="mx-auto mb-2 flex max-w-lg gap-2 overflow-x-auto px-2">
          {playlists.map((playlist, index) => (
            <div
              key={playlist.id || `${playlist.name}-${index}`}
              className="flex shrink-0 items-center gap-2 rounded-full bg-sky-300 px-3 py-1 text-slate-900"
            >
              <Link
                to={`/playlists/${playlist.id}`}
                className="flex min-w-0 items-center gap-2 hover:text-slate-700"
              >
                <img src={playlist.cover || vinylImage} alt="" className="h-6 w-6 rounded-full object-cover" />
                <span className="max-w-32 truncate text-sm font-medium">{playlist.name}</span>
              </Link>
              <button
                type="button"
                aria-label={`Delete ${playlist.name}`}
                onClick={() => onDeletePlaylist(playlist.id)}
                className="ml-auto shrink-0 cursor-pointer rounded-full p-1 hover:bg-sky-400"
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="mx-auto flex w-full max-w-lg items-center justify-around gap-1 pb-2 font-semibold">
        <Link to="/explore" className="flex flex-col items-center gap-1 text-xs">
          <span>
            <Search className="h-5 w-5" />
          </span>
          <h2>Explore</h2>
        </Link>
        <Link to="/albums" className="flex flex-col items-center gap-1 text-xs hover:text-white">
          <span>
            <SquareLibrary className="h-5 w-5" />
          </span>
          <span>Albums</span>
        </Link>
        <Link to="/artists" className="flex flex-col items-center gap-1 text-xs hover:text-white">
          <span>
            <Mic className="h-5 w-5" />
          </span>
          <span>Artists</span>
        </Link>
        <Link to="/podcasts" className="flex flex-col items-center gap-1 text-xs">
          <span>
            <Radio className="h-5 w-5" />
          </span>
          <h2>Podcasts</h2>
        </Link>
        <button
          type="button"
          onClick={onCreatePlaylist}
          className="flex cursor-pointer flex-col items-center gap-1 text-xs hover:text-white"
        >
          <span>
            <Plus className="h-5 w-5" />
          </span>
          <span>Create</span>
        </button>
      </div>
    </nav>
  );
}
export default MobileSidebar;
