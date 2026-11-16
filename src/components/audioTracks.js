import musicData from '../assets2/data';
import podcastCover from '../assets2/podcast.jpg';

const tracks = Object.entries(
  import.meta.glob('../assets/data/**/*.{mp3,flac,mp4}', {
    eager: true,
    import: 'default',
    query: '?url',
  }),
)
  .map(([path, url]) => ({
    path,
    url,
    title: path
      .split('/')
      .pop()
      .replace(/\.(mp3|flac|mp4)$/i, '')
      .replace(/^.* - \d+ - /, '')
      .replace(/^\d+\s*-\s*/, '')
      .replace(/^\d+\.\s*/, ''),
    albumFolder: path.split('/').at(-2).trim(),
  }))
  .map((track) => {
    const album = musicData.find((item) => item.folder === track.albumFolder);
    return {
      ...track,
      albumId: album?.id,
      album: album?.album ?? track.albumFolder,
      cover: album?.cover ?? (track.albumFolder === 'Podcasts' ? podcastCover : undefined),
    };
  })
  .sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true }));

export default tracks;
