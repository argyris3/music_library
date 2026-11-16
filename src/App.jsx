import { useState } from 'react';
import Albums from './components/Albums';
import Artists from './components/Artists';
import CreatePlaylistModal from './components/CreatePlaylistModal';
import MobileSidebar from './components/MobileSidebar';
import Navbar from './components/Navbar';
import Playlist from './components/Playlist';
import Player from './components/player';
import RecentlyPlayed from './components/RecentlyPlayed';
import Sidebar from './components/Sidebar';
import { Route, Routes, useLocation } from 'react-router-dom';
import ArtistsPage from './pages/ArtistsPage';
import AlbumsPage from './pages/AlbumsPage';
import AlbumsDetails from './pages/AlbumsDetails';
import PlaylistDetailsPage from './pages/PlaylistDetailsPage';
import PlayerProvider from './contexts/PlayerProvider';
import MusicLibraryProvider from './contexts/MusicLibraryProvider';
import useMusicLibrary from './contexts/useMusicLibrary';
import ExporePage from './pages/ExplorePage';
import PodcastsPage from './pages/PodcastsPage';

const PLAYLIST_STORAGE_KEY = 'music-library-playlists';

const isStoredPlaylist = (playlist) =>
  playlist &&
  typeof playlist.id === 'string' &&
  typeof playlist.name === 'string' &&
  typeof playlist.cover === 'string' &&
  (playlist.tracks === undefined || (Array.isArray(playlist.tracks) && playlist.tracks.every((path) => typeof path === 'string')));

const loadPlaylistState = () => {
  try {
    const storedPlaylists = window.localStorage.getItem(PLAYLIST_STORAGE_KEY);
    if (!storedPlaylists) return { playlists: [], storageError: '' };

    const parsedPlaylists = JSON.parse(storedPlaylists);
    if (!Array.isArray(parsedPlaylists) || !parsedPlaylists.every(isStoredPlaylist)) {
      throw new Error('Saved playlists have an invalid format.');
    }

    return {
      playlists: parsedPlaylists.map((playlist) => ({ ...playlist, tracks: playlist.tracks ?? [] })),
      storageError: '',
    };
  } catch (error) {
    console.error('Could not load saved playlists.', error);
    return { playlists: [], storageError: 'Saved playlists could not be loaded.' };
  }
};

const AppContent = () => {
  const { pathname } = useLocation();
  const { loading: libraryLoading, error: libraryError } = useMusicLibrary();
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [playlistState, setPlaylistState] = useState(loadPlaylistState);
  const { playlists, storageError } = playlistState;

  const savePlaylists = (nextPlaylists) => {
    try {
      window.localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(nextPlaylists));
      setPlaylistState({ playlists: nextPlaylists, storageError: '' });
    } catch (error) {
      console.error('Could not save playlists.', error);
      setPlaylistState({
        playlists: nextPlaylists,
        storageError: 'Playlist changes could not be saved in this browser.',
      });
    }
  };

  const handleCreatePlaylist = ({ name, cover }) => {
    savePlaylists([
      ...playlists,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name, cover, tracks: [] },
    ]);
  };

  const handleDeletePlaylist = (playlistId) => {
    savePlaylists(playlists.filter((playlist) => playlist.id !== playlistId));
  };

  const handleAddTrackToPlaylist = (playlistId, trackPath) => {
    const playlist = playlists.find((item) => item.id === playlistId);
    if (!playlist) {
      console.error(`Playlist "${playlistId}" was not found.`);
      setPlaylistState((current) => ({ ...current, storageError: 'The selected playlist could not be found.' }));
      return;
    }

    if (playlist.tracks.includes(trackPath)) return;
    savePlaylists(
      playlists.map((item) =>
        item.id === playlistId ? { ...item, tracks: [...item.tracks, trackPath] } : item,
      ),
    );
  };

  return (
    <div className="flex h-screen font-display">
      <Sidebar
        onCreatePlaylist={() => setIsPlaylistModalOpen(true)}
        onDeletePlaylist={handleDeletePlaylist}
        playlistStorageError={storageError}
        playlists={playlists}
      />
      <main
        className={`flex min-w-0 flex-1 flex-col overflow-y-auto ${
          pathname === '/' ? 'pb-40 lg:pb-32' : 'pb-48 lg:pb-32'
        }`}
      >
        {!pathname.startsWith('/albums-details') && <Navbar />}
        {libraryLoading ? (
          <p className="m-6 text-slate-300">Loading music library...</p>
        ) : libraryError ? (
          <p role="alert" className="m-6 text-rose-300">
            Could not load the music library: {libraryError}
          </p>
        ) : (
          <PlayerProvider>
            <>
              <div className="flex min-h-0 flex-1 flex-col">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <div className="flex flex-1 flex-col">
                        <section className="flex min-w-0 flex-col gap-y-8 lg:flex-row lg:gap-y-0">
                          <Playlist />
                          <RecentlyPlayed />
                        </section>
                        <section className="flex min-w-0 flex-col lg:flex-row">
                          <Albums />
                          <Artists />
                        </section>
                      </div>
                    }
                  />
                  <Route
                    path="/artists"
                    element={
                      <ArtistsPage playlists={playlists} onAddTrackToPlaylist={handleAddTrackToPlaylist} />
                    }
                  />
                  <Route path="/albums" element={<AlbumsPage />} />
                  <Route
                    path="/albums-details"
                    element={
                      <AlbumsDetails playlists={playlists} onAddTrackToPlaylist={handleAddTrackToPlaylist} />
                    }
                  />
                  <Route path="/explore" element={<ExporePage />} />
                  <Route path="/podcasts" element={<PodcastsPage />} />
                  <Route
                    path="/albums-details/:albumId"
                    element={
                      <AlbumsDetails playlists={playlists} onAddTrackToPlaylist={handleAddTrackToPlaylist} />
                    }
                  />
                  <Route
                    path="/artists/:artistId"
                    element={
                      <ArtistsPage playlists={playlists} onAddTrackToPlaylist={handleAddTrackToPlaylist} />
                    }
                  />
                  <Route path="/playlists/:playlistId" element={<PlaylistDetailsPage playlists={playlists} />} />
                </Routes>
              </div>
              <Player isHome={pathname === '/'} />
            </>
          </PlayerProvider>
        )}
      </main>
      <MobileSidebar
        onCreatePlaylist={() => setIsPlaylistModalOpen(true)}
        onDeletePlaylist={handleDeletePlaylist}
        playlistStorageError={storageError}
        playlists={playlists}
      />
      <CreatePlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        onCreate={handleCreatePlaylist}
      />
    </div>
  );
};

const App = () => (
  <MusicLibraryProvider>
    <AppContent />
  </MusicLibraryProvider>
);

export default App;
