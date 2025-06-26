from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.motorista import MotoristaOut
from app.models.motorista import Motorista
from app.api.deps import get_db

router = APIRouter()

@router.get("/{cpf}", response_model=MotoristaOut)
def buscar_motorista_por_cpf(cpf: str, db: Session = Depends(get_db)):
    motorista = db.query(Motorista).filter(Motorista.cpf == cpf).first()
    if not motorista:
        raise HTTPException(status_code=404, detail="Motorista não encontrado")
    return motorista 