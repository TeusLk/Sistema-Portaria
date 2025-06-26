from app.core.database import SessionLocal
from app.models.doca import Doca
from app.models.tipomovimentacao import TipoMovimentacao
from app.models.veiculo import Veiculo
from app.models.motorista import Motorista
from app.models.user import User
from passlib.context import CryptContext
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def main():
    db = SessionLocal()
    # Usuário admin
    if not db.query(User).filter_by(email="admin@teste.com").first():
        admin = User(
            user="Admin",
            email="admin@teste.com",
            senha=pwd_context.hash("admin123"),
            dominio="ADM",
            status=True,
            data_criacao=datetime.utcnow()
        )
        db.add(admin)
    # Docas
    for i in range(1, 6):
        nome = f"DOCA {str(i).zfill(2)}"
        if not db.query(Doca).filter_by(nome=nome).first():
            db.add(Doca(nome=nome, usuario_id=1))
    # Tipos de movimentação
    tipos = ["ENTREGA", "COLETA", "VAZIO", "DESCARGA MANIFESTO"]
    for tipo in tipos:
        if not db.query(TipoMovimentacao).filter_by(tipo=tipo).first():
            db.add(TipoMovimentacao(tipo=tipo, usuario_id=1))
    # Veículos
    veiculos = ["Caminhão 3/4", "Carreta", "Van"]
    for tipo in veiculos:
        if not db.query(Veiculo).filter_by(tipo=tipo).first():
            db.add(Veiculo(tipo=tipo, usuario_id=1))
    # Motoristas
    motoristas = [
        {"cpf": "11122233344", "nome": "João Silva", "cnh": "12345678900", "telefone": "(11) 98765-4321"},
        {"cpf": "22233344455", "nome": "Maria Oliveira", "cnh": "23456789011", "telefone": "(21) 98765-4321"},
        {"cpf": "33344455566", "nome": "Carlos Santos", "cnh": "34567890122", "telefone": "(31) 98765-4321"},
    ]
    for m in motoristas:
        if not db.query(Motorista).filter_by(cpf=m["cpf"]).first():
            db.add(Motorista(**m))
    db.commit()
    db.close()

if __name__ == "__main__":
    main() 