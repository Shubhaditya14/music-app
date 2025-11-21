from sqlmodel import SQLModel, Field 

class Song(SQLModel, table=True):
    id: int = Field(primary_key=True)
    title: str
    artist: str
    duration: int
    audio_url: str

class User(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str
    