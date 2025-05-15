from app.repositories.processo_repository import ProcessoRepository
from app.schemas.processo import ProcessoCreate

class ProcessoService:
    def __init__(self, repo: ProcessoRepository):
        self.repo = repo

    def criar_processo(self, processo: ProcessoCreate):
        return self.repo.create(processo)

    def buscar_processo(self, id: int):
        return self.repo.get_by_id(id)

    def listar_processos(self):
        return self.repo.list() 