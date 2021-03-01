from typing import List
from sqlalchemy import Column, Integer, String, ForeignKey
from index  import Base, Session, get_elem

class Atendimento(Base):
    __tablename__ = "Atendimento"

    id_atendimento   = Column(String(200), primary_key=True)
    dt_atendimento   = Column(String(200))
    tipo_atendimento = Column(String(500))
    dt_desfecho      = Column(String(100))
    desfecho         = Column(String(1000))

    id_clinica       = Column(Integer, ForeignKey("Clinica.id_clinica"))
    id_paciente      = Column(String(100), ForeignKey("Paciente.id_paciente"))
    
    def __repr__(self):
        attr = (
                 "id_atendimento={0}," 
                 "dt_atendimento={1}," 
                 "tipo_atendimento={2}," 
                 "dt_desfecho={3},"
                 "desfecho={4}"
        ).format( self.id_atendimento, 
                  self.dt_atendimento, 
                  self.tipo_atendimento, 
                  self.dt_desfecho,
                  self.desfecho )

        return "<Atendimento({})>".format(attr)
    
    @staticmethod
    def create_instance(arr: List[str]):
        model = {
            "id_atendimento":   get_elem(arr, 1), 
            "dt_atendimento":   get_elem(arr, 2), 
            "tipo_atendimento": get_elem(arr, 3), 
            "dt_desfecho":      get_elem(arr, 6), 
            "desfecho":         get_elem(arr, 7),

            "id_clinica":       get_elem( arr, 4 ),
            "id_paciente":      get_elem( arr, 0 ),
        }

        a = Atendimento(**model)

        session = Session()

        try:
            session.add(a)

            session.commit()
        except Exception as err:
            print(str(err))

