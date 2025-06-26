from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PortariaBase(BaseModel):
    data_hora: Optional[datetime] = None
    romaneio: Optional[int] = None
    tipo_movimentacao_id: int
    motorista_id: int
    placa_cavalo: Optional[str] = None
    placa_carreta: Optional[str] = None
    veiculo_id: int
    telefone_motorista: Optional[str] = None
    validacao: Optional[bool] = False
    acionar: Optional[str] = None
    em_doca: Optional[bool] = False
    conclusao: Optional[bool] = False
    saida: Optional[bool] = False
    user_inclusao_id: int
    user_alteracao_id: Optional[int] = None
    doca_id: Optional[int] = None

class PortariaCreate(PortariaBase):
    pass

class PortariaOut(PortariaBase):
    id: int
    class Config:
        from_attributes = True 