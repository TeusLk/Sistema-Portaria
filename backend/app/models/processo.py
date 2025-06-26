from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class Portaria(Base):
    __tablename__ = "portarias"
    id = Column(Integer, primary_key=True, index=True)
    data_hora = Column(DateTime, default=datetime.utcnow)
    romaneio = Column(Integer, nullable=True)
    tipo_movimentacao_id = Column(Integer, ForeignKey("tipos_movimentacao.id"))
    motorista_id = Column(Integer, ForeignKey("motoristas.id"))
    placa_cavalo = Column(String, nullable=True)
    placa_carreta = Column(String, nullable=True)
    veiculo_id = Column(Integer, ForeignKey("veiculos.id"))
    telefone_motorista = Column(String, nullable=True)
    validacao = Column(Boolean, default=False)
    acionar = Column(String, nullable=True)
    em_doca = Column(Boolean, default=False)
    conclusao = Column(Boolean, default=False)
    saida = Column(Boolean, default=False)
    user_inclusao_id = Column(Integer, ForeignKey("users.id"))
    user_alteracao_id = Column(Integer, ForeignKey("users.id"))
    doca_id = Column(Integer, ForeignKey("docas.id"), nullable=True)

    # Relacionamentos
    tipo_movimentacao = relationship("TipoMovimentacao", back_populates="portarias")
    motorista = relationship("Motorista", back_populates="portarias")
    veiculo = relationship("Veiculo", back_populates="portarias")
    doca = relationship("Doca", back_populates="portarias") 