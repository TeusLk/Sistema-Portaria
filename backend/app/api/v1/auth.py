from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.user import UserLogin, UserOut, UserCreate
from app.repositories.user_repository import UserRepository
from app.api.deps import get_db
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/login", response_model=UserOut)
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    user = repo.get_by_email(user_login.email)
    if not user or user.dominio != user_login.dominio:
        raise HTTPException(status_code=400, detail="Usuário ou domínio inválido")
    if not pwd_context.verify(user_login.senha, user.senha):
        raise HTTPException(status_code=400, detail="Senha inválida")
    return user

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_create: UserCreate, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    if repo.get_by_email(user_create.email):
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    user = repo.create(user_create)
    return user