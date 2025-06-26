from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DocaBase(BaseModel):
    nome: str
    data_inclusao: Optional[datetime] = None
    data_alteracao: Optional[datetime] = None
    usuario_id: int

class DocaCreate(DocaBase):
    pass

class DocaOut(DocaBase):
    id: int
    class Config:
        from_attributes = True 