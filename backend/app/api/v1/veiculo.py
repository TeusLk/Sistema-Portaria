from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.veiculo import VeiculoOut
from app.models.veiculo import Veiculo
from app.api.deps import get_db

router = APIRouter()

@router.get("/", response_model=list[VeiculoOut])
def listar_veiculos(db: Session = Depends(get_db)):
    return db.query(Veiculo).all() 