const groupAlbumsByArtist = (albums) => {
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

export default groupAlbumsByArtist;
