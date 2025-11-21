const BASE_URL = "http://127.0.0.1:8000";

export async function fetchSongs() {
  const res = await fetch(`${BASE_URL}/songs`);
  if (!res.ok) throw new Error("Failed to fetch songs");
  return res.json();
}
