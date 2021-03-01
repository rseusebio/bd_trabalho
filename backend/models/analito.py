from typing import List
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from index  import Base, Session, get_elem

created_analitos = set()

class Analito(Base):
    __tablename__ = "Analito"

    id_analito       = Column(String(100), primary_key=True)
    cd_unidade       = Column(String(100))
    valor_referencia = Column(String(100))

    exames = relationship("Exame")
    
    def __repr__(self):
        attr = (
                 "id_analito={0}," 
                 "cd_unidade={2}," 
                 "valor_referencia={3}"
        ).format( self.id_analito, 
                  self.cd_unidade, 
                  self.valor_referencia
                  )

        return "<Analito({})>".format(attr)
    
    @staticmethod
    def create_instance(arr: List[str]):
        model = {
            "id_analito":        get_elem(arr, 5), 
            "cd_unidade":        get_elem(arr, 7), 
            "valor_referencia":  get_elem(arr, 8)
        }

        a = Analito(**model)

        if a.id_analito in created_analitos:
            return

        session = Session()

        try:
            session.add(a)

            session.commit()

            created_analitos.add(a.id_analito)
        except Exception as err:
            print(str(err))

