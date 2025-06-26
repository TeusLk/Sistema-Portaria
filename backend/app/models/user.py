from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    user = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    senha = Column(String, nullable=False)
    dominio = Column(String(3), nullable=False)
    data_criacao = Column(DateTime, default=datetime.utcnow)
    status = Column(Boolean, default=True)
    # Relacionamentos
    tipos_movimentacao = relationship("TipoMovimentacao", back_populates="usuario")
    veiculos = relationship("Veiculo", back_populates="usuario")
    docas = relationship("Doca", back_populates="usuario") 