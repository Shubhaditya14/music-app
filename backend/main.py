from fastapi import FastAPI
from datetime import datetime
from pydantic import BaseModel
import pytz
from sqlmodel import SQLModel, create_engine
from sqlmodel import Session
from models import Song, User


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True)

app = FastAPI()

IST = pytz.timezone('Asia/Kolkata')

@app.get("/songs")
async def get_songs():
    with Session(engine) as session:
        songs = session.query(Song).all()
        return songs

class PlayEvent(BaseModel):
    user_id: int
    song_id: int
    duration: int

@app.post("/play")
async def log_play(event : PlayEvent):
    play_event = {
        "user_id": event.user_id,
        "song_id": event.song_id,
        "duration": event.duration,
        "played_at": datetime.now(IST).isoformat()
    }
    print("PLAY EVENT: ", event)

    return {"status": "ok", "event":event}

class User(BaseModel):
    id: int
    name: str

@app.get("/users")
async def get_users():
    users = [
        {"id": 1, "name": "Alice"},
        {"id": 2, "name": "Bob"}
    ]
    return {"users": users}

def create_db():
    SQLModel.metadata.create_all(engine)


def seed_data():
    with Session(engine) as session:
        song_count = session.query(Song).count()
        if song_count > 0:
            return  # Already seeded

        songs = [
            Song(id=1, title="Test Song", artist="Unknown Artist", duration=210, audio_url="https://example.com/audio1.mp3"),
            Song(id=2, title="Another Song", artist="Someone", duration=180, audio_url="https://example.com/audio2.mp3")
        ]

        users = [
            User(id=1, name="Alice"),
            User(id=2, name="Bob")
        ]

        for s in songs:
            session.add(s)
        for u in users:
            session.add(u)

        session.commit()

create_db()
seed_data()