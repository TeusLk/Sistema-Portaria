from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.schemas.portaria import PortariaCreate, PortariaOut
from app.models.processo import Portaria
from app.models.motorista import Motorista
from app.schemas.motorista import MotoristaCreate
from app.repositories.motorista_repository import MotoristaRepository
from app.api.deps import get_db

router = APIRouter()

@router.get("/total", response_model=list[PortariaOut])
def get_total(db: Session = Depends(get_db)):
    return db.query(Portaria).filter(Portaria.saida == False).all()

@router.get("/validados", response_model=list[PortariaOut])
def get_validados(db: Session = Depends(get_db)):
    return db.query(Portaria).filter(Portaria.saida == False, Portaria.validacao == True).all()

@router.get("/em-doca", response_model=list[PortariaOut])
def get_em_doca(db: Session = Depends(get_db)):
    return db.query(Portaria).filter(Portaria.saida == False, Portaria.em_doca == True).all()

@router.get("/concluidos", response_model=list[PortariaOut])
def get_concluidos(db: Session = Depends(get_db)):
    return db.query(Portaria).filter(Portaria.saida == False, Portaria.conclusao == True).all()

@router.post("/", response_model=PortariaOut, status_code=status.HTTP_201_CREATED)
def criar_portaria(portaria: PortariaCreate, db: Session = Depends(get_db)):
    # Lógica de motorista
    motorista_repo = MotoristaRepository(db)
    motorista = motorista_repo.get_by_cpf(getattr(portaria, 'cpf_motorista', None))
    if motorista:
        # Preenche automaticamente os dados do motorista
        nome = motorista.nome
        cnh = motorista.cnh
        telefone = motorista.telefone
        # Atualiza se nome/cnh/telefone forem diferentes do informado
        if (getattr(portaria, 'nome_motorista', nome) != nome or getattr(portaria, 'cnh_motorista', cnh) != cnh or getattr(portaria, 'telefone_motorista', telefone) != telefone):
            data = MotoristaCreate(
                cpf=motorista.cpf,
                nome=getattr(portaria, 'nome_motorista', nome),
                cnh=getattr(portaria, 'cnh_motorista', cnh),
                telefone=getattr(portaria, 'telefone_motorista', telefone)
            )
            motorista_repo.update(motorista, data)
        motorista_id = motorista.id
    else:
        # Cria novo motorista
        data = MotoristaCreate(
            cpf=getattr(portaria, 'cpf_motorista', None),
            nome=getattr(portaria, 'nome_motorista', None),
            cnh=getattr(portaria, 'cnh_motorista', None),
            telefone=getattr(portaria, 'telefone_motorista', None)
        )
        new_motorista = Motorista(**data.model_dump())
        db.add(new_motorista)
        db.commit()
        db.refresh(new_motorista)
        motorista_id = new_motorista.id
        nome = new_motorista.nome
        cnh = new_motorista.cnh
        telefone = new_motorista.telefone
    # Cria portaria com os dados do motorista preenchidos
    portaria_data = portaria.model_dump()
    portaria_data['motorista_id'] = motorista_id
    portaria_data['nome_motorista'] = nome
    portaria_data['cnh_motorista'] = cnh
    portaria_data['telefone_motorista'] = telefone
    db_portaria = Portaria(**portaria_data)
    db.add(db_portaria)
    db.commit()
    db.refresh(db_portaria)
    return db_portaria 