const imageFiles = Object.entries(
  import.meta.glob('../assets/data/**/*.{jpg,jpeg,png,webp}', {
    eager: true,
    import: 'default',
  }),
);
const findImage = (assetPath) => imageFiles.find(([path]) => path.endsWith(assetPath))?.[1];

const musicData = [
  {
    id: 0,
    folder: 'Substance',
    artist: 'Joy Division',
    album: 'Substance',
    artistCover: findImage('data/joy.jpg'),
    cover: findImage('data/Substance/cover.jpg'),
  },
  {
    id: 1,
    folder: 'Inside',
    artist: 'Eloy',
    album: 'Inside',
    artistCover: findImage('data/eloy.jpg'),
    cover: findImage('data/Inside/cover.jpg'),
  },
  {
    id: 2,
    folder: 'Mirror',
    artist: 'Thievery Corporation',
    album: 'The mirror conspiracy',
    artistCover: findImage('data/thievery.jpg'),
    cover: findImage('data/Mirror/cover.jpg'),
  },
  {
    id: 3,
    folder: 'Unleashed',
    artist: 'Massive Attack',
    album: 'Unleashed',
    artistCover: findImage('data/massive.jpg'),
    cover: findImage('data/Unleashed/cover.jpg'),
  },
  {
    id: 4,
    folder: 'LostianGirl',
    artist: 'Protomartyr',
    album: 'Hotel Usona',
    genre: 'Post-Rock',
    year: 2026,
    artistCover: findImage('data/LostianGirl/cover.jpg'),
    cover: findImage('data/LostianGirl/cover.jpg'),
  },
  {
    id: 5,
    folder: 'Mogwai Young Team',
    artist: 'Mogwai',
    album: 'Young Team',
    genre: 'Post-Rock',
    year: 1997,
    artistCover: findImage('data/ Mogwai Young Team/albumart.jpg'),
    cover: findImage('data/ Mogwai Young Team/albumart.jpg'),
  },
];

const audioFiles = Object.keys(import.meta.glob('../assets/data/**/*.{mp3,flac}'));
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
