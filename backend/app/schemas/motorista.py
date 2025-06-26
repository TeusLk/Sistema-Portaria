from pydantic import BaseModel
from typing import Optional

class MotoristaBase(BaseModel):
    cpf: str
    nome: str
    cnh: str
    telefone: Optional[str] = None

class MotoristaCreate(MotoristaBase):
    pass

class MotoristaOut(MotoristaBase):
    id: int
    class Config:
        from_attributes = True 