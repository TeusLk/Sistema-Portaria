from sqlalchemy import Column, Integer, String
from app.core.database import Base

class MensagensPadrao(Base):
    __tablename__ = "mensagens_padrao"
    id = Column(Integer, primary_key=True, index=True)
    mensagem_inicial = Column(String, nullable=True)
    acionamento_motorista = Column(String, nullable=True)
    estorno = Column(String, nullable=True)
    troca_doca = Column(String, nullable=True)
    conclusao = Column(String, nullable=True)
    desocupar_doca = Column(String, nullable=True)
    finalizar_processo = Column(String, nullable=True)
    retorno_finalizados = Column(String, nullable=True)
    finalizar_insucesso = Column(String, nullable=True)
    confirmacao_motorista = Column(String, nullable=True) 