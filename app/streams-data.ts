import playlist from "../public/data/youtube-playlist.json";

export const STREAM_PLAYLIST_URL = `https://www.youtube.com/playlist?list=${playlist.playlistId}`;
export const streamPlaylist = playlist;
