const getTracksForAlbum = (tracks, album) =>
  tracks.filter((track) =>
    track.albumId != null && album.id != null
      ? String(track.albumId) === String(album.id)
      : track.albumFolder === album.folder,
  );

export default getTracksForAlbum;
