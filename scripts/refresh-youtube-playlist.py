"""Refresh the public playlist snapshot and locally hosted thumbnails, without an API key."""

import argparse
import json
import os
from datetime import datetime
from pathlib import Path
import re
import sys
from urllib.request import Request, urlopen
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parent.parent
SNAPSHOT = ROOT / "public/data/youtube-playlist.json"
NS = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015"}
SITE = "https://qo.ax"
MAX_VIDEOS = 15


def download(url, limit=2_000_000):
    request = Request(url, headers={"User-Agent": "Qoax-playlist-sync/1.0 (+https://qo.ax)"})
    with urlopen(request, timeout=20) as response:
        content = response.read(limit + 1)
        if len(content) > limit:
            raise ValueError("Response exceeds size limit")
        return content


def video_date(value):
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if parsed.tzinfo is None:
        raise ValueError("Video publication date has no timezone")
    return parsed


def validate_snapshot(value, playlist_id):
    if value.get("playlistId") != playlist_id or not isinstance(value.get("title"), str):
        raise ValueError("Snapshot belongs to a different playlist")
    videos = value.get("videos")
    if not isinstance(videos, list) or len(videos) > MAX_VIDEOS:
        raise ValueError("Invalid playlist video list")
    seen = set()
    for video in videos:
        key = video.get("id", "")
        if not re.fullmatch(r"[A-Za-z0-9_-]{11}", key) or key in seen:
            raise ValueError("Invalid or repeated video ID")
        seen.add(key)
        if not isinstance(video.get("title"), str) or not video["title"].strip():
            raise ValueError("Missing video title")
        video_date(video.get("published", ""))
        if video.get("thumbnail") != f"/streams/thumbs/{key}.jpg":
            raise ValueError("Invalid local thumbnail path")
    return value


def parse_feed(content, playlist_id):
    root = ElementTree.fromstring(content)
    if root.tag != f"{{{NS['a']}}}feed" or root.findtext("yt:playlistId", namespaces=NS) != playlist_id:
        raise ValueError("Unexpected YouTube playlist feed")
    title = root.findtext("a:title", namespaces=NS)
    if not title:
        raise ValueError("Playlist title is missing")
    videos = {}
    for entry in root.findall("a:entry", NS):
        key = entry.findtext("yt:videoId", namespaces=NS)
        if not key:
            continue
        published = entry.findtext("a:published", namespaces=NS)
        video_date(published or "")
        videos[key] = {
            "id": key,
            "title": entry.findtext("a:title", namespaces=NS),
            "published": published,
            "thumbnail": f"/streams/thumbs/{key}.jpg",
        }
    ordered = sorted(videos.values(), key=lambda video: video_date(video["published"]), reverse=True)
    return validate_snapshot({"playlistId": playlist_id, "title": title, "videos": ordered[:MAX_VIDEOS]}, playlist_id)


def refresh(previous, fetch=download):
    key = previous["playlistId"]
    if not re.fullmatch(r"[A-Za-z0-9_-]+", key):
        raise ValueError("Invalid playlist ID")
    return parse_feed(fetch(f"https://www.youtube.com/feeds/videos.xml?playlist_id={key}"), key)


def write_snapshot(value):
    SNAPSHOT.parent.mkdir(parents=True, exist_ok=True)
    temp = SNAPSHOT.with_suffix(".tmp")
    temp.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
    temp.replace(SNAPSHOT)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--restore-live", action="store_true", help="Use the current live snapshot as fallback and change baseline")
    args = parser.parse_args()
    seed = json.loads(SNAPSHOT.read_text())
    previous = validate_snapshot(seed, seed["playlistId"])
    if args.restore_live:
        try:
            previous = validate_snapshot(json.loads(download(f"{SITE}/data/youtube-playlist.json")), seed["playlistId"])
        except Exception as error:
            print(f"Live snapshot unavailable; retaining repository snapshot: {error}", file=sys.stderr)
    try:
        current = refresh(previous)
    except Exception as error:
        print(f"YouTube refresh failed; retaining last successful snapshot: {error}", file=sys.stderr)
        current = previous

    # Complete every thumbnail before publishing the new metadata. A failed
    # image download fails this deployment and leaves the existing site intact.
    for video in current["videos"]:
        target = ROOT / "public" / video["thumbnail"].lstrip("/")
        if target.is_file():
            continue
        try:
            image = download(f"https://i.ytimg.com/vi/{video['id']}/hqdefault.jpg", 1_000_000)
        except Exception:
            image = download(f"{SITE}{video['thumbnail']}", 1_000_000)
        if not image.startswith(b"\xff\xd8\xff"):
            raise ValueError("Thumbnail is not a JPEG")
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(image)
    write_snapshot(current)
    changed = current != previous
    if os.environ.get("GITHUB_OUTPUT"):
        with open(os.environ["GITHUB_OUTPUT"], "a") as output:
            output.write(f"changed={str(changed).lower()}\n")
    print(f"Playlist: {current['title']}. Videos: {len(current['videos'])}. Changed: {changed}.")


if __name__ == "__main__":
    main()
