from pydantic import BaseModel
from typing import Optional

class MensagensPadraoBase(BaseModel):
    mensagem_inicial: Optional[str] = None
    acionamento_motorista: Optional[str] = None
    estorno: Optional[str] = None
    troca_doca: Optional[str] = None
    conclusao: Optional[str] = None
    desocupar_doca: Optional[str] = None
    finalizar_processo: Optional[str] = None
    retorno_finalizados: Optional[str] = None
    finalizar_insucesso: Optional[str] = None
    confirmacao_motorista: Optional[str] = None

class MensagensPadraoCreate(MensagensPadraoBase):
    pass

class MensagensPadraoOut(MensagensPadraoBase):
    id: int
    class Config:
        from_attributes = True 