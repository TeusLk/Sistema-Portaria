from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base

class Motorista(Base):
    __tablename__ = "motoristas"
    id = Column(Integer, primary_key=True, index=True)
    cpf = Column(String, unique=True, nullable=False, index=True)
    nome = Column(String, nullable=False)
    cnh = Column(String, nullable=False)
    telefone = Column(String, nullable=True)
    portarias = relationship("Portaria", back_populates="motorista") 