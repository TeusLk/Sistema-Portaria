from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserLogin, UserOut
from app.repositories.user_repository import UserRepository
from app.api.deps import get_db
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/login", response_model=UserOut)
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    user = repo.get_by_email(user_login.email)
    if not user or user.domain != user_login.domain:
        raise HTTPException(status_code=400, detail="Usuário ou domínio inválido")
    if not pwd_context.verify(user_login.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Senha inválida")
    return user