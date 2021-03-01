from typing import List
from sqlalchemy import Column, Integer, String, ForeignKey
from index  import Base, Session, get_elem
from atendimento import Atendimento

created_atendimento = set()

class Exame(Base):
    __tablename__ = "Exame"

    id_exame         = Column(Integer, primary_key=True)
    de_exame         = Column(String(200))
    dt_coleta        = Column(String(200))
    de_resultado     = Column(String(1000))
    de_origem        = Column(String(200))

    id_analito       = Column(String(100), ForeignKey("Analito.id_analito"))
    id_atendimento   = Column(String(200), ForeignKey("Atendimento.id_atendimento"))
    
    def __repr__(self):
        attr = (
                 "id_exame={0}," 
                 "de_exame={2}," 
                 "dt_coleta={3}," 
                 "de_resultado={4}," 
                 "de_origem={5}"
        ).format( self.id_exame, 
                  self.de_exame, 
                  self.dt_coleta, 
                  self.de_resultado, 
                  self.de_origem )

        return "<Exame({})>".format(attr)
    
    @staticmethod
    def create_instance(arr: List[str], count: int):
        model = {
            "id_exame":         count,
            "de_exame":         get_elem(arr, 4), 
            "dt_coleta":        get_elem(arr, 2), 
            "de_origem":        get_elem(arr, 3), 
            "de_resultado":     get_elem(arr, 6), 

            "id_analito":       get_elem(arr, 5), 
            "id_atendimento":   get_elem(arr, 1)
        }

        e = Exame(**model)

        session = Session()

        if model["id_atendimento"] not in created_atendimento:
        
            query = session.query(Atendimento).filter(Atendimento.id_atendimento == model["id_atendimento"])
            a = query.one_or_none()

            if not a:

                print("new atendimento: {}".format(model["id_atendimento"]))
                a = Atendimento(id_atendimento=model["id_atendimento"], 
                                id_paciente=get_elem(arr, 0))
                
                session.add(a)
                session.commit()

            created_atendimento.add(model["id_atendimento"])
        
        try:
            session.add(e)

            session.commit()
        except Exception as err:
            print(str(err))

