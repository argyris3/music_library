import { useContext } from 'react';
import MusicLibraryContext from './musicLibraryContext';

const useMusicLibrary = () => {
  const library = useContext(MusicLibraryContext);
  if (!library) throw new Error('useMusicLibrary must be used within a MusicLibraryProvider');
  return library;
};

export default useMusicLibrary;
