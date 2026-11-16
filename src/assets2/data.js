import cover1 from '../assets/data/Substance/cover.jpg';
import cover2 from '../assets/data/Inside/cover.jpg';
import cover3 from '../assets/data/Mirror/cover.jpg';
import cover4 from '../assets/data/Unleashed/cover.jpg';
import cover5 from '../assets/data/LostianGirl/cover.jpg';
import cover6 from '../assets/data/ Mogwai Young Team/albumart.jpg';
import joy from '../assets/data/joy.jpg';
import massive from '../assets/data/massive.jpg';
import thievery from '../assets/data/thievery.jpg';
import eloy from '../assets/data/eloy.jpg';

const musicData = [
  {
    id: 0,
    folder: 'Substance',
    artist: 'Joy Division',
    album: 'Substance',
    artistCover: joy,
    cover: cover1,
  },
  {
    id: 1,
    folder: 'Inside',
    artist: 'Eloy',
    album: 'Inside',
    artistCover: eloy,
    cover: cover2,
  },
  {
    id: 2,
    folder: 'Mirror',
    artist: 'Thievery Corporation',
    album: 'The mirror conspiracy',
    artistCover: thievery,
    cover: cover3,
  },
  {
    id: 3,
    folder: 'Unleashed',
    artist: 'Massive Attack',
    album: 'Unleashed',
    artistCover: massive,
    cover: cover4,
  },
  {
    id: 4,
    folder: 'LostianGirl',
    artist: 'Protomartyr',
    album: 'Hotel Usona',
    genre: 'Post-Rock',
    year: 2026,
    artistCover: cover5,
    cover: cover5,
  },
  {
    id: 5,
    folder: 'Mogwai Young Team',
    artist: 'Mogwai',
    album: 'Young Team',
    genre: 'Post-Rock',
    year: 1997,
    artistCover: cover6,
    cover: cover6,
  },
];

const audioFiles = Object.keys(import.meta.glob('../assets/data/**/*.{mp3,flac}'));
const imageFiles = Object.entries(
  import.meta.glob('../assets/data/**/*.{jpg,jpeg,png,webp}', {
    eager: true,
    import: 'default',
  }),
);
const knownFolders = new Set(musicData.map((item) => item.folder));
const discoveredFolders = [
  ...new Set(
    audioFiles
      .map((path) => path.split('/').at(-2).trim())
      .filter((folder) => !knownFolders.has(folder)),
  ),
].sort((a, b) => a.localeCompare(b));

const discoveredAlbums = discoveredFolders.map((folder, index) => {
  const albumMatch = folder.match(/^(.+?)\s*-\s*(.+)$/);
  const folderImages = imageFiles.filter(([path]) => path.split('/').at(-2).trim() === folder);
  const cover =
    folderImages.find(([path]) => /\/cover\.(jpg|jpeg|png|webp)$/i.test(path))?.[1] ??
    folderImages.find(([path]) => /\/albumart\.(jpg|jpeg|png|webp)$/i.test(path))?.[1] ??
    folderImages.find(([path]) => /\/folder\.(jpg|jpeg|png|webp)$/i.test(path))?.[1] ??
    folderImages[0]?.[1];

  return {
    id: musicData.length + index,
    folder,
    artist: albumMatch ? albumMatch[1].trim() : folder,
    album: albumMatch ? albumMatch[2].trim() : folder,
    artistCover: cover,
    cover,
  };
});

const allMusicData = [...musicData, ...discoveredAlbums];

export const groupAlbumsByArtist = (albums) => {
  const groups = new Map();

  albums.forEach((album) => {
    const key = album.artist.trim().toLocaleLowerCase();
    if (!groups.has(key)) {
      groups.set(key, {
        id: album.id,
        artist: album.artist,
        artistCover: album.artistCover,
        albums: [],
      });
    }
    groups.get(key).albums.push(album);
  });

  return [...groups.values()];
};

export default allMusicData;
