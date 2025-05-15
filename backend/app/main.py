from fastapi import FastAPI
from app.api.v1 import user_router, processo_router
from app.core.database import Base, engine
from app.api.v1.auth import router as auth_router

app = FastAPI(title="Portaria API")

# Inclui as rotas
app.include_router(user_router, prefix="/api/v1/users", tags=["users"])
app.include_router(processo_router, prefix="/api/v1/processos", tags=["processos"])
app.include_router(auth_router, prefix="/api/v1", tags=["auth"])

# Cria as tabelas do banco ao iniciar
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine) 