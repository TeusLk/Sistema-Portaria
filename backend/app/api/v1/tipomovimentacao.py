from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.tipomovimentacao import TipoMovimentacaoOut
from app.models.tipomovimentacao import TipoMovimentacao
from app.api.deps import get_db

router = APIRouter()

@router.get("/", response_model=list[TipoMovimentacaoOut])
def listar_tipos_movimentacao(db: Session = Depends(get_db)):
    return db.query(TipoMovimentacao).all() 