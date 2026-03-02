from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from .database import Base, engine
from .routers import auth, designs

Base.metadata.create_all(bind=engine)

# Migrate existing databases by adding new columns if they don't exist yet
_new_columns = [
    "pattern_type TEXT NOT NULL DEFAULT 'pixel_art'",
    "width INTEGER NOT NULL DEFAULT 32",
    "height INTEGER NOT NULL DEFAULT 32",
    "canvas_data TEXT",
]
with engine.connect() as _conn:
    for _col in _new_columns:
        try:
            _conn.execute(text(f"ALTER TABLE designs ADD COLUMN {_col}"))
            _conn.commit()
        except Exception:
            pass

app = FastAPI(title="Pipa Pixel Patterns")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(designs.router)
