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

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
            Song(id=1,  title="Chain Heavy",             artist="Kanye West", duration=240, audio_url="/static/audio/chain_heavy.mp3"),
            Song(id=2,  title="Diamonds",                artist="Kanye West", duration=210, audio_url="/static/audio/diamonds.mp3"),
            Song(id=3,  title="Flashing Lights 2",       artist="Kanye West", duration=250, audio_url="/static/audio/flashing_lights_2.mp3"),
            Song(id=4,  title="Hard Horn Nightmare",     artist="Kanye West", duration=205, audio_url="/static/audio/hard_horn_nightmare.mp3"),
            Song(id=5,  title="Joy",                     artist="Kanye West", duration=230, audio_url="/static/audio/joy.mp3"),
            Song(id=6,  title="Mama's Boyfriend",        artist="Kanye West", duration=215, audio_url="/static/audio/mamas_boyfriend.mp3"),
            Song(id=7,  title="Never See Me Again",      artist="Kanye West", duration=260, audio_url="/static/audio/never_see_me_again.mp3"),
            Song(id=8,  title="Power",                   artist="Kanye West", duration=292, audio_url="/static/audio/power.mp3"),
            Song(id=9,  title="See Me Now",              artist="Kanye West", duration=310, audio_url="/static/audio/see_me_now.mp3"),
            Song(id=10, title="Shoot Up",                artist="Kanye West", duration=200, audio_url="/static/audio/shoot_up.mp3"),
            Song(id=11, title="So Appalled",             artist="Kanye West", duration=420, audio_url="/static/audio/so_appalled.mp3"),
            Song(id=12, title="Take One for the Team",  artist="Kanye West", duration=255, audio_url="/static/audio/take_one_for_the_team.mp3"),
            Song(id=13, title="Tragically Beautiful",    artist="Kanye West", duration=250, audio_url="/static/audio/tragically_beautiful.mp3"),
            Song(id=14, title="What It Is",              artist="Kanye West", duration=180, audio_url="/static/audio/what_it_is.mp3"),
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

        output = []
        for song_id, play_count in results:
            song = session.get(Song, song_id)
            if song:
                output.append({
                    "play_count": play_count,
                    "song": song
                })

        return output
    
@app.get("/users/{user_id}/recent")
async def get_recent_plays(user_id: int):
    with Session(engine) as session:
        statement = (
            select(PlayLog)
            .where(PlayLog.user_id == user_id)
            .order_by(PlayLog.played_at.desc())
        )

        rows = session.exec(statement).all()

        return [
            {
                "id": pl.id,
                "played_at": pl.played_at,
                "song": session.get(Song, pl.song_id)
            }
            for (pl,) in rows   # UNPACK HERE
        ]

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
    
@app.get("/songs")
async def get_songs():
    with Session(engine) as session:
        songs = session.query(Song).all()
        return songs

@app.get("/users/{user_id}/recommendations/baseline")
async def recommend_baseline(user_id: int):
    with Session(engine) as session:

        # Get the user's listening profile
        user_stmt = (
            select(
                PlayLog.song_id,
                func.count(PlayLog.id).label("play_count")
            )
            .where(PlayLog.user_id == user_id)
            .group_by(PlayLog.song_id)
        )

        user_profile_rows = session.exec(user_stmt).all()
        user_profile = {row[0]: row[1] for row in user_profile_rows}

        if not user_profile:
            return {"error": "User has no listening history"}

        user_songs = set(user_profile.keys())

        # Get all other users (SQLModel row-wrapped)
        other_rows = session.exec(
            select(User).where(User.id != user_id)
        ).all()

        similarities = []

        for row in other_rows:
            other = row[0]   # <-- FIX: extract User model

            stmt = (
                select(
                    PlayLog.song_id,
                    func.count(PlayLog.id)
                )
                .where(PlayLog.user_id == other.id)
                .group_by(PlayLog.song_id)
            )

            rows = session.exec(stmt).all()
            if not rows:
                continue

            other_profile = {r[0]: r[1] for r in rows}
            other_songs = set(other_profile.keys())

            overlap = len(user_songs & other_songs)

            if overlap > 0:
                similarities.append((other.id, overlap, other_profile))

        if not similarities:
            return {"error": "No similar users found"}

        similarities.sort(key=lambda x: x[1], reverse=True)
        top_similar = similarities[:3]

        recommendation_scores = {}

        for uid, overlap, profile in top_similar:
            for song_id, count in profile.items():
                if song_id not in user_songs:
                    recommendation_scores[song_id] = recommendation_scores.get(song_id, 0) + count

        sorted_recs = sorted(
            recommendation_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )

        final_recs = []
        for song_id, score in sorted_recs:
            song = session.get(Song, song_id)
            if song:
                final_recs.append({
                    "song": song,
                    "score": score
                })

        return final_recs

from fastapi.staticfiles import StaticFiles

app.mount("/static", StaticFiles(directory="static"), name="static")

create_db()
seed_data()