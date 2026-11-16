import { useEffect, useState } from 'react';
import staticAlbums from '../assets2/data';
import staticTracks from '../components/audioTracks';
import MusicLibraryContext from './musicLibraryContext';
const dataSource = (import.meta.env.VITE_DATA_SOURCE || 'static').trim().toLowerCase();

const getRows = (result, tableName) => {
  if (result.error) throw new Error(`Could not load ${tableName}: ${result.error}`);
  if (!Array.isArray(result.data)) throw new Error(`The ${tableName} API response was not a list.`);
  return result.data;
};

const loadExternalLibrary = async () => {
  const { musicApi } = await import('../../libraryApi/api.js');
  const [artistResult, albumResult, trackResult] = await Promise.all([
    musicApi.from('artists').select('*'),
    musicApi.from('albums').select('*'),
    musicApi.from('tracks').select('*'),
  ]);
  const artistRows = getRows(artistResult, 'artists');
  const albumRows = getRows(albumResult, 'albums');
  const trackRows = getRows(trackResult, 'tracks');
  const artistsById = new Map(artistRows.map((artist) => [String(artist.id), artist]));

  const albums = albumRows.map((row) => {
    const artistRecord = artistsById.get(String(row.artist_id));
    const artist = row.artist ?? row.artist_name ?? artistRecord?.name;
    const album = row.title ?? row.album;
    if (row.id === undefined || typeof artist !== 'string' || typeof album !== 'string') {
      throw new Error('An album record is missing its id, artist, or title.');
    }

    return {
      ...row,
      id: row.id,
      folder: row.folder || String(row.id),
      artist,
      album,
      artistCover: row.artist_cover_url ?? row.artistCover ?? artistRecord?.artist_cover_url ?? artistRecord?.cover_url,
      cover: row.cover_url ?? row.cover,
    };
  });
  const albumsById = new Map(albums.map((album) => [String(album.id), album]));

  const tracks = trackRows.map((row, index) => {
    const album = albumsById.get(String(row.album_id ?? row.albumId));
    const title = row.title ?? row.name;
    const url = row.audio_url ?? row.url;
    if (!album || typeof title !== 'string' || typeof url !== 'string' || !url) {
      throw new Error(`Track record ${row.id ?? index} is missing its album, title, or audio URL.`);
    }

    return {
      ...row,
      path: String(row.id ?? row.path ?? `${album.id}-${row.track_number ?? index}`),
      url,
      title,
      album: album.album,
      albumFolder: album.folder,
      cover: album.cover ?? album.artistCover,
      trackNumber: row.track_number,
    };
  });

  return { albums, tracks };
};

const getInitialState = () => {
  if (dataSource === 'static') {
    return { albums: staticAlbums, tracks: staticTracks, loading: false, error: '' };
  }
  if (dataSource === 'external') {
    return { albums: [], tracks: [], loading: true, error: '' };
  }
  return {
    albums: [],
    tracks: [],
    loading: false,
    error: `Unknown VITE_DATA_SOURCE "${dataSource}". Use "static" or "external".`,
  };
};

const MusicLibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState(getInitialState);

  useEffect(() => {
    if (dataSource !== 'external') return undefined;

    let active = true;
    loadExternalLibrary()
      .then((externalLibrary) => {
        if (active) setLibrary({ ...externalLibrary, loading: false, error: '' });
      })
      .catch((error) => {
        console.error('Could not load the external music library.', error);
        if (active) {
          setLibrary({
            albums: [],
            tracks: [],
            loading: false,
            error: error instanceof Error ? error.message : 'Could not load the external music library.',
          });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return <MusicLibraryContext.Provider value={library}>{children}</MusicLibraryContext.Provider>;
};

export default MusicLibraryProvider;
