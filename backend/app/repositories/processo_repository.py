from sqlalchemy.orm import Session
from app.models.processo import Portaria
from app.schemas.processo import ProcessoCreate

class ProcessoRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, processo: ProcessoCreate):
        db_processo = Portaria(**processo.dict())
        self.db.add(db_processo)
        self.db.commit()
        self.db.refresh(db_processo)
        return db_processo

    def get_by_id(self, id: int):
        return self.db.query(Portaria).filter(Portaria.id == id).first()

    def list(self):
        return self.db.query(Portaria).all() 