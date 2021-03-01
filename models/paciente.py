from typing import List
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from index  import Base, Session, get_elem 

class Paciente(Base):

    __tablename__ = "Paciente"

    id_paciente    = Column(String(100), primary_key=True)
    sexo           = Column(String(100))
    ano_nascimento = Column(Integer)
    municipio      = Column(String(100)) 
    uf             = Column(String(20))

    atendimentos = relationship("Atendimento")
    

    def __repr__(self):
        
        attributes = (
                 "id_paciente={0}," 
                 "sexo={1}," 
                 "ano_nascimento={2}," 
                 "uf={4}," 
                 "municipio={5}"
        ).format( self.id_paciente, self.sexo, str(self.ano_nascimento), self.uf, self.municipio )

        return "<Paciente({})>".format( attributes )
    
    @staticmethod
    def create_instance(arr: List[str]):

        model = {
            "id_paciente":      get_elem(arr, 0), 
            "sexo":             get_elem(arr, 1), 
            "ano_nascimento":   get_elem(arr, 2), 
            "uf":               get_elem(arr, 4), 
            "municipio":        get_elem(arr, 5),
        }

        if model["ano_nascimento"]:
            if model["ano_nascimento"] == "aaaa" or model["ano_nascimento"] == "yyyy":
                model["ano_nascimento"] = None
            else:
                model["ano_nascimento"] = int(model["ano_nascimento"])
        
        if model["uf"]:
            if model["uf"] == "uu":
                model["uf"] = None 
        
        if model["municipio"]:
            if model["municipio"] == "mmmm":
                model["municipio"] = None

        p = Paciente( **model )
        
        session = Session()

        try:
            session.add(p)
            session.commit()
        except Exception as err:
            print(str(err))

