from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserOut
from app.services.user_service import UserService
from app.repositories.user_repository import UserRepository
from app.api.deps import get_db

router = APIRouter()

def get_user_service(db: Session = Depends(get_db)):
    repo = UserRepository(db)
    return UserService(repo)

@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def criar_usuario(
    user: UserCreate,
    service: UserService = Depends(get_user_service)
):
    return service.create_user(user)

@router.get("/by-email/{email}", response_model=UserOut)
def buscar_usuario(email: str, service: UserService = Depends(get_user_service)):
    return service.get_user_by_email(email) 