from fastapi import APIRouter
from . import user, processo, auth, portaria, doca, tipomovimentacao, veiculo, motorista

api_router = APIRouter()
api_router.include_router(user.router, prefix="/users", tags=["users"])
api_router.include_router(processo.router, prefix="/processos", tags=["processos"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(portaria.router, prefix="/portaria", tags=["portaria"])
api_router.include_router(doca.router, prefix="/docas", tags=["docas"])
api_router.include_router(tipomovimentacao.router, prefix="/tipos-movimentacao", tags=["tipos-movimentacao"])
api_router.include_router(veiculo.router, prefix="/veiculos", tags=["veiculos"])
api_router.include_router(motorista.router, prefix="/motorista", tags=["motorista"]) 