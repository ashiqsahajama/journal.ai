from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import user, journal_entry, goal
from app.routes import user

Base.metadata.create_all(bind=engine)

app = FastAPI()


# Allow CORS (temporary allow-all for dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In dev we can set this to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)

@app.get("/ping")
def ping():
    return {"msg": "pong"}