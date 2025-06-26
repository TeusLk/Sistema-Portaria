from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class TipoMovimentacao(Base):
    __tablename__ = "tipos_movimentacao"
    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String, nullable=False)
    data_inclusao = Column(DateTime, default=datetime.utcnow)
    data_alteracao = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    usuario_id = Column(Integer, ForeignKey("users.id"))
    usuario = relationship("User")
    portarias = relationship("Portaria", back_populates="tipo_movimentacao") 