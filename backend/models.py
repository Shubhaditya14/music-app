from sqlmodel import SQLModel, Field 
from datetime import datetime, timezone

class PlayLog(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int
    song_id: int
    duration: int
    played_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    
class Song(SQLModel, table=True):
    id: int = Field(primary_key=True)
    title: str
    artist: str
    duration: int
    audio_url: str

class User(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str
