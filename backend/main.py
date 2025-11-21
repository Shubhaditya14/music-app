from fastapi import FastAPI
from datetime import datetime
from pydantic import BaseModel
import pytz
from sqlmodel import SQLModel, create_engine
from sqlmodel import Session
from models import Song, User
from models import PlayLog
from sqlmodel import Session
from datetime import datetime
from sqlmodel import select, col
from sqlalchemy import func, select


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True)

app = FastAPI()

IST = pytz.timezone('Asia/Kolkata')

@app.get("/songs/{song_id}")
async def get_song(song_id: int):
    with Session(engine) as session:
        song = session.get(Song, song_id)
        if song:
            return song
        return {"error": "Song not found"}

class PlayEventRequest(BaseModel):
    user_id: int
    song_id: int
    duration: int

@app.post("/play")
async def log_play(event: PlayEventRequest):
    with Session(engine) as session:
        play_event = PlayLog(
            user_id=event.user_id,
            song_id=event.song_id,
            duration=event.duration
        )
        session.add(play_event)
        session.commit()
        session.refresh(play_event)
        return play_event

@app.get("/users")
async def get_users():
    with Session(engine) as session:
        return session.query(User).all()

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    with Session(engine) as session:
        user = session.get(User, user_id)
        if user:
            return user
        return {"error": "User not found"}


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

@app.get("/users/{user_id}/history")
async def get_history(user_id: int):
    with Session(engine) as session:
        history = session.query(PlayLog).filter(PlayLog.user_id == user_id).all()
        return history
    
@app.get("/users/{user_id}/top-songs")
async def get_top_songs(user_id: int):
    with Session(engine) as session:
        statement = (
            select(
                PlayLog.song_id,
                func.count(PlayLog.id).label("play_count")
            )
            .where(PlayLog.user_id == user_id)
            .group_by(PlayLog.song_id)
            .order_by(func.count(PlayLog.id).desc())
        )

        results = session.exec(statement).all()

        return [
            {"song_id": song_id, "play_count": play_count}
            for song_id, play_count in results
        ]
    
@app.get("/users/{user_id}/recent")
async def get_recent_plays(user_id: int):
    with Session(engine) as session:
        statement = (
            select(PlayLog)
            .where(PlayLog.user_id == user_id)
            .order_by(PlayLog.played_at.desc())
        )
        results = session.exec(statement).all()
        return results


@app.get("/songs/{song_id}/details/{user_id}")
async def get_song_details(song_id: int, user_id: int):
    with Session(engine) as session:

        # 1. Fetch song info
        song = session.get(Song, song_id)
        if not song:
            return {"error": "Song not found"}

        # 2. User's play count
        play_count_stmt = (
            select(func.count(PlayLog.id))
            .where(
                PlayLog.user_id == user_id,
                PlayLog.song_id == song_id
            )
        )
        user_count = session.exec(play_count_stmt).one()
        user_count = user_count[0]
 

        # 3. Most recent play timestamp
        recent_stmt = (
            select(PlayLog.played_at)
            .where(
                PlayLog.user_id == user_id,
                PlayLog.song_id == song_id
            )
            .order_by(PlayLog.played_at.desc())
        )

        recent_play = session.exec(recent_stmt).first()
        recent_play = recent_play[0] if recent_play else None


        return {
            "song": song,
            "user_play_count": user_count,
            "last_played": recent_play
        }
    


create_db()
seed_data()