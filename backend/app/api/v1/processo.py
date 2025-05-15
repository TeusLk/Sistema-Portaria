from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.schemas.processo import ProcessoCreate, ProcessoOut
from app.services.processo_service import ProcessoService
from app.repositories.processo_repository import ProcessoRepository
from app.api.deps import get_db

router = APIRouter()

def get_processo_service(db: Session = Depends(get_db)):
    repo = ProcessoRepository(db)
    return ProcessoService(repo)

@router.post("/", response_model=ProcessoOut, status_code=status.HTTP_201_CREATED)
def criar_processo(
    processo: ProcessoCreate,
    service: ProcessoService = Depends(get_processo_service)
):
    return service.criar_processo(processo)

@router.get("/", response_model=list[ProcessoOut])
def listar_processos(service: ProcessoService = Depends(get_processo_service)):
    return service.listar_processos()

@router.get("/{id}", response_model=ProcessoOut)
def buscar_processo(id: int, service: ProcessoService = Depends(get_processo_service)):
    return service.buscar_processo(id) 