const BASE_URL = "http://127.0.0.1:8000";

export async function fetchRecentPlays(user_id: number) {
  const res = await fetch(`${BASE_URL}/users/${user_id}/recent`);

  if (!res.ok) throw new Error("Failed to fetch recent plays");

  return res.json();
}

export async function fetchTopSongs(user_id: number) {
  const res = await fetch(`${BASE_URL}/users/${user_id}/top-songs`);
  if (!res.ok) throw new Error("Failed to fetch top songs");
  return res.json();
}

export async function fetchSongs() {
  const res = await fetch(`${BASE_URL}/songs`);
  const songs = await res.json();
  return songs.map((s: any) => ({
    ...s,
    audio_url: `http://127.0.0.1:8000${s.audio_url}`,
  }));
}

export async function logPlay(user_id: number, song_id: number, duration: number) {
  const res = await fetch(`${BASE_URL}/play`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, song_id, duration }),
  });

  if (!res.ok) throw new Error("Failed to log play");
  return res.json();
}

export async function fetchRecommendations(user_id: number) {
  const res = await fetch(`${BASE_URL}/users/${user_id}/recommendations/baseline`);
  if (!res.ok) throw new Error("Failed to fetch recommendations");
  return res.json();
}
