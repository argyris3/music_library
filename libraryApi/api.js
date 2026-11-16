import { ApiDatabaseDb } from 'ta_data_mas/packages/apiDatabase-js/src/db/index.ts';

const projectUrl = (import.meta.env.VITE_MUSIC_API_URL || '/api/projects/musiclibrary-cc2d7c')
  .trim()
  .replace(/\/+$/, '');
const apiKey = import.meta.env.VITE_MUSIC_API?.trim();

if (!projectUrl) throw new Error('VITE_MUSIC_API_URL is not configured.');
if (!apiKey) throw new Error('VITE_MUSIC_API is not configured.');

export const musicApi = new ApiDatabaseDb(projectUrl, apiKey);