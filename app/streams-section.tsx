import { Btn, SecHead } from "./editorial";
import { PlaylistVideos } from "./playlist-videos";
import { STREAM_PLAYLIST_URL, streamPlaylist } from "./streams-data";
import ed from "./editorial.module.css";

export function StreamsSection() {
  return (
    <section className={ed.sec} aria-labelledby="streams-title" id="streams">
      <div className={ed.wrap}>
        <SecHead
          id="streams-title"
          title="Streams and recordings"
          copy="Hackathons and game jams, from opening talks to final presentations."
          action={<Btn href={STREAM_PLAYLIST_URL} variant="ghost" small>Watch on YouTube</Btn>}
        />
        <PlaylistVideos playlistId={streamPlaylist.playlistId} videos={streamPlaylist.videos} />
      </div>
    </section>
  );
}
