import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const playlistId = "pl.u-gxblk30u5P5EL2A";
const playlistUrl = `https://music.apple.com/jp/playlist/${playlistId}`;

type AppleTrack = {
  artistName?: string;
  artwork?: { dictionary?: { url?: string } };
  contentDescriptor?: {
    identifiers?: { storeAdamID?: string };
    url?: string;
  };
  subtitleLinks?: Array<{ title?: string }>;
  title?: string;
};

type PlaylistTrack = {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  url: string | null;
};

function readTrackItems(payload: unknown): AppleTrack[] {
  if (!payload || typeof payload !== "object") return [];
  const root = payload as {
    data?: Array<{
      data?: {
        sections?: Array<{ id?: string; items?: unknown[] }>;
      };
    }>;
  };
  const sections = root.data?.[0]?.data?.sections ?? [];
  const trackSection = sections.find((section) => section.id?.startsWith("track-list -"));
  return Array.isArray(trackSection?.items) ? trackSection.items as AppleTrack[] : [];
}

function formatArtwork(template?: string) {
  if (!template) return "";
  return template
    .replace("{w}", "600")
    .replace("{h}", "600")
    .replace("{f}", "jpg");
}

function parsePlaylist(html: string): PlaylistTrack[] {
  const match = html.match(
    /<script[^>]+id=["']serialized-server-data["'][^>]*>([\s\S]*?)<\/script>/i,
  );
  if (!match?.[1]) return [];

  const payload = JSON.parse(match[1]) as unknown;
  return readTrackItems(payload).flatMap((track) => {
    const id = track.contentDescriptor?.identifiers?.storeAdamID?.trim() ?? "";
    const title = track.title?.trim() ?? "";
    const artist = (track.artistName ?? track.subtitleLinks?.[0]?.title)?.trim() ?? "";
    const artwork = formatArtwork(track.artwork?.dictionary?.url);
    if (!id || !title || !artist || !artwork) return [];
    return [{
      id,
      title,
      artist,
      artwork,
      url: track.contentDescriptor?.url ?? null,
    }];
  });
}

export async function GET() {
  try {
    const response = await fetch(playlistUrl, {
      cache: "no-store",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "ja-JP,ja;q=0.9,en;q=0.8",
        "User-Agent": "Mozilla/5.0 (compatible; SokiMoe-Playlist/1.0)",
      },
    });
    if (!response.ok) throw new Error(`Apple Music returned ${response.status}`);

    const tracks = parsePlaylist(await response.text());
    if (tracks.length === 0) throw new Error("Apple Music playlist was empty");

    return NextResponse.json(
      { ok: true, playlistUrl, tracks },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } },
    );
  } catch (error) {
    console.error("[music-playlist] Unable to refresh Apple Music playlist", error);
    return NextResponse.json(
      { ok: false, playlistUrl, tracks: [] },
      {
        status: 502,
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
      },
    );
  }
}
