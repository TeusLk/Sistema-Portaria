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
        hashed_password = pwd_context.hash(user.password)
        db_user = User(
            email=user.email,
            hashed_password=hashed_password,
            domain=user.domain
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user 