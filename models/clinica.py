from typing import List
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from index  import Base, Session, get_elem

created_clinics = set()

class Clinica(Base):
    __tablename__ = "Clinica"

    id_clinica    = Column(Integer, primary_key=True)
    de_clinica    = Column(String(500))

    atendimentos  = relationship("Atendimento")

    def __repr__(self):
        attr = "id_clinica={0},de_clinica={1}".format(self.id_clinica, self.de_clinica)

        return "<Clinica({})>".format(attr)
    
    @staticmethod
    def create_instance(arr: List[str]):
        model = {
            "id_clinica":      get_elem(arr, 4), 
            "de_clinica":      get_elem(arr, 5)
        }

        c = Clinica(**model)

        if str(c) in created_clinics:
            print("already created:'{}'".format(str(c)))
            return 

        session = Session()

        try:
            session.add(c)

            session.commit()

            created_clinics.add(str(c))
        except Exception as err:
            print(str(err))

