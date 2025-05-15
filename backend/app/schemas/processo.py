from pydantic import BaseModel
from typing import Optional

class ProcessoBase(BaseModel):
    motorista: str
    cpf_motorista: Optional[str] = None
    placa: str
    placa_carreta: Optional[str] = None
    veiculo: Optional[str] = None
    tipo_mov: str
    data_hora: str
    doca: Optional[str] = None

class ProcessoCreate(ProcessoBase):
    pass

class ProcessoOut(ProcessoBase):
    id: int
    status: str
    validado: bool
    em_doca: bool
    concluido: bool
    saida: bool

    class Config:
        from_attributes = True 