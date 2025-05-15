from sqlalchemy import Column, Integer, String, DateTime, Boolean
from app.core.database import Base

class Processo(Base):
    __tablename__ = "processos"
    id = Column(Integer, primary_key=True, index=True)
    motorista = Column(String, nullable=False)
    cpf_motorista = Column(String, nullable=True)
    placa = Column(String, nullable=False)
    placa_carreta = Column(String, nullable=True)
    veiculo = Column(String, nullable=True)
    tipo_mov = Column(String, nullable=False)
    status = Column(String, default="novo")
    data_hora = Column(String, nullable=False)
    doca = Column(String, nullable=True)
    validado = Column(Boolean, default=False)
    em_doca = Column(Boolean, default=False)
    concluido = Column(Boolean, default=False)
    saida = Column(Boolean, default=False) 