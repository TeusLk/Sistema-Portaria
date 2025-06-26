from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VeiculoBase(BaseModel):
    tipo: str
    data_inclusao: Optional[datetime] = None
    data_alteracao: Optional[datetime] = None
    usuario_id: int

class VeiculoCreate(VeiculoBase):
    pass

class VeiculoOut(VeiculoBase):
    id: int
    class Config:
        from_attributes = True 