from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str):
        return self.db.query(User).filter(User.email == email).first()

    def create(self, user: UserCreate):
        hashed_password = pwd_context.hash(user.senha)
        db_user = User(
            user=user.user,
            email=user.email,
            senha=hashed_password,
            dominio=user.dominio,
            status=user.status,
            data_criacao=user.data_criacao
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user 