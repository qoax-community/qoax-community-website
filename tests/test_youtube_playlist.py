import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch


spec = importlib.util.spec_from_file_location("playlist", Path(__file__).resolve().parents[1] / "scripts/refresh-youtube-playlist.py")
playlist = importlib.util.module_from_spec(spec)
spec.loader.exec_module(playlist)
KEY = "PLNQyuRkW5vUw"


def feed(entries, key=KEY):
    items = "".join(
        f"<entry><yt:videoId>{video}</yt:videoId><title>{title}</title><published>{date}</published></entry>"
        for video, title, date in entries
    )
    return f'<feed xmlns="http://www.w3.org/2005/Atom" xmlns:yt="http://www.youtube.com/xml/schemas/2015"><yt:playlistId>{key}</yt:playlistId><title>Broadcasts</title>{items}</feed>'.encode()


class PlaylistTests(unittest.TestCase):
    def test_new_upload_is_sorted_first_and_removed_video_disappears(self):
        previous = playlist.parse_feed(feed([("oldVideo001", "Old", "2026-11-01T00:00:00Z")]), KEY)
        source = feed([
            ("recentVid01", "Recent &amp; public", "2026-11-24T00:00:00Z"),
            ("newVideo001", "Newest", "2026-11-26T00:00:00Z"),
            ("newVideo001", "Newest", "2026-11-26T00:00:00Z"),
        ])
        result = playlist.refresh(previous, fetch=lambda url: source)
        self.assertEqual([video["id"] for video in result["videos"]], ["newVideo001", "recentVid01"])
        self.assertEqual(result["videos"][1]["title"], "Recent & public")
        self.assertEqual(result["videos"][0]["thumbnail"], "/streams/thumbs/newVideo001.jpg")

    def test_wrong_playlist_and_invalid_dates_do_not_replace_good_data(self):
        with self.assertRaises(ValueError):
            playlist.parse_feed(feed([], key="another-playlist"), KEY)
        with self.assertRaises(ValueError):
            playlist.parse_feed(feed([("newVideo001", "Title", "not-a-date")]), KEY)

    def test_genuine_empty_playlist_is_supported(self):
        self.assertEqual(playlist.parse_feed(feed([]), KEY)["videos"], [])

    def test_refresh_failure_retains_last_published_videos(self):
        saved = playlist.parse_feed(feed([("oldVideo001", "Existing", "2026-11-01T00:00:00Z")]), KEY)
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            snapshot = root / "public/data/youtube-playlist.json"
            snapshot.parent.mkdir(parents=True)
            snapshot.write_text(json.dumps(saved))
            thumbnail = root / "public/streams/thumbs/oldVideo001.jpg"
            thumbnail.parent.mkdir(parents=True)
            thumbnail.write_bytes(b"\xff\xd8\xff")
            output = root / "github-output"
            with patch.object(playlist, "ROOT", root), patch.object(playlist, "SNAPSHOT", snapshot), patch.object(playlist, "refresh", side_effect=OSError("offline")), patch("sys.argv", ["sync"]), patch.dict("os.environ", {"GITHUB_OUTPUT": str(output)}):
                playlist.main()
            self.assertEqual(json.loads(snapshot.read_text()), saved)
            self.assertEqual(output.read_text(), "changed=false\n")


if __name__ == "__main__":
    unittest.main()
