const getTrackNumber = (track) => {
  if (track.trackNumber == null || track.trackNumber === '') return null;
  const trackNumber = Number(track.trackNumber);
  return Number.isFinite(trackNumber) ? trackNumber : null;
};

const getTracksForAlbum = (tracks, album) =>
  tracks
    .filter((track) =>
      track.albumId != null && album.id != null
        ? String(track.albumId) === String(album.id)
        : track.albumFolder === album.folder,
    )
    .sort((first, second) => {
      const firstNumber = getTrackNumber(first);
      const secondNumber = getTrackNumber(second);
      if (firstNumber === null) return secondNumber === null ? 0 : 1;
      if (secondNumber === null) return -1;
      return firstNumber - secondNumber;
    });

export default getTracksForAlbum;
