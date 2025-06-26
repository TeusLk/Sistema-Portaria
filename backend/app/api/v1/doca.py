from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.doca import DocaOut
from app.models.doca import Doca
from app.api.deps import get_db

router = APIRouter()

@router.get("/", response_model=list[DocaOut])
def listar_docas(db: Session = Depends(get_db)):
    return db.query(Doca).all() 