from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import api_router
from app.core.database import Base, engine

app = FastAPI(title="Portaria API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique o domínio do front-end
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui todas as rotas da API v1
app.include_router(api_router, prefix="/api/v1")

# Cria as tabelas do banco ao iniciar
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine) 