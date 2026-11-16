import { ApiDatabaseDb } from 'ta_data_mas/packages/apiDatabase-js/src/db/index.ts';

const projectUrl = 'https://web-four-rust-92.vercel.app/api/projects/musiclibrary-cc2d7c';
const apiKey = import.meta.env.VITE_MUSIC_API;

if (!apiKey) {
  throw new Error('MUSIC_API is not configured.');
}

export const musicApi = new ApiDatabaseDb(projectUrl, apiKey);