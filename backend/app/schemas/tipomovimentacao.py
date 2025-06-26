from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TipoMovimentacaoBase(BaseModel):
    tipo: str
    data_inclusao: Optional[datetime] = None
    data_alteracao: Optional[datetime] = None
    usuario_id: int

class TipoMovimentacaoCreate(TipoMovimentacaoBase):
    pass

class TipoMovimentacaoOut(TipoMovimentacaoBase):
    id: int
    class Config:
        from_attributes = True 