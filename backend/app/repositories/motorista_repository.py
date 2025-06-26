from sqlalchemy.orm import Session
from app.models.motorista import Motorista
from app.schemas.motorista import MotoristaCreate

class MotoristaRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_cpf(self, cpf: str):
        return self.db.query(Motorista).filter(Motorista.cpf == cpf).first()

    def update(self, motorista: Motorista, data: MotoristaCreate):
        motorista.nome = data.nome
        motorista.cnh = data.cnh
        motorista.telefone = data.telefone
        self.db.commit()
        self.db.refresh(motorista)
        return motorista 