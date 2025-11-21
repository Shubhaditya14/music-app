from fastapi import FastAPI
from datetime import datetime
from pydantic import BaseModel

app = FastAPI()

@app.get("/songs/{song_id}")
async def get_songs(song_id : int):
    songs = [
        {
            "id" : 1,
            "title" : "Test Song",
            "artist" : "idk",
            "duration" : 210,
            "audio_url": "https://example.com/audio1.mp3"
        },
        {
            "id": 2,
            "title": "Another Song",
            "artist": "Someone",
            "duration": 180,
            "audio_url": "https://example.com/audio2.mp3"
        }
    ]
    for song in songs:
        if song["id"] == song_id:
            return song
    
    return {"error": "Song not found"}

@app.post("/play")
async def log_play(song_id: int):
    event = {
        "song_id" : song_id,
        "played_at": datetime.utcnow().isoformat()
    }
    print("PLAY EVENT: ", event)

    return {"status": "ok", "event":event}

