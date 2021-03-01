from typing import List
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Boolean, create_engine, PrimaryKeyConstraint
from sqlalchemy.orm import sessionmaker
import mysql
import pymysql
import sys 

Base    = declarative_base()
Session = sessionmaker()

class Paciente( Base ):

    __tablename__ = "Paciente"

    id_paciente    = Column( String( 100 ), primary_key=True )
    sexo           = Column( String( 100 ) )
    ano_nascimento = Column( String( 100 ) ) 
    pais           = Column( String( 40 ) )
    uf             = Column( String( 20 ) )
    municipio      = Column( String( 100 ) )
    cep_reduzido   = Column( String( 100 ) )

    def __repr__(self):
        
        attributes = (
                 "id_paciente={0}," 
                 "sexo={1}," 
                 "ano={2}," 
                 "pais={3}," 
                 "uf={4}," 
                 "municipio={5}," 
                 "cep={6}"
        ).format( self.id_paciente, self.sexo, self.ano_nascimento, self.pais, self.uf, self.municipio, self.cep_reduzido )

        return "<Paciente({})>".format( attributes )

class Exame( Base ):

    __tablename__ = "Exame"

    id                  = Column( Integer, primary_key=True )
    id_paciente         = Column( String( 100 ) )
    id_atendimento      = Column( String( 100 ) )
    dt_coleta           = Column( String( 100 ) )
    origem              = Column( String( 100 ) )
    descricao           = Column( String( 100 ) )
    analito             = Column( String( 100 ) )
    resultado           = Column( String( 1000 ) )
    unidade             = Column( String( 100 ) )
    valor_referencia    = Column( String( 100 ) )

    def __repr__(self):
        
        attributes = (
                 "id_paciente={0}," 
                 "id_atendimento={1}," 
                 "dt_coleta={2}," 
                 "origem={3}," 
                 "descricao={4}," 
                 "analito={5}," 
                 "resultado={6},"
                 "unidade={7},"
                 "valor_referencia={8}"
        ).format( self.id_paciente, 
                  self.id_atendimento, 
                  self.dt_coleta, 
                  self.origem, 
                  self.descricao, 
                  self.analito, 
                  self.resultado, 
                  self.unidade, 
                  self.valor_referencia )

        return "<Exame({})>".format( attributes )

class Desfecho( Base ):

    __tablename__= "Desfecho"

    id_paciente      = Column( String( 200 ) )
    id_atendimento   = Column( String( 200 ), primary_key=True )
    dt_atendimento   = Column( String( 200 ) )
    tipo_atendimento = Column( String( 500 ) )
    id_clinica       = Column( String( 200 ) )
    clinica          = Column( String( 500 ) )
    dt_desfecho      = Column( String( 100 ) )
    desfecho         = Column( String( 1000 ) )

    def __repr__(self):
        
        attributes = (
                 "id_paciente={0}," 
                 "id_atendimento={1}," 
                 "dt_atendimento={2}," 
                 "tipo_atendimento={3}," 
                 "id_clinica={4}," 
                 "clinica={5}," 
                 "dt_desfecho={6},"
                 "desfecho={7}"
        ).format( self.id_paciente, 
                  self.id_atendimento, 
                  self.dt_atendimento, 
                  self.tipo_atendimento, 
                  self.id_clinica,
                  self.clinica,
                  self.dt_desfecho,
                  self.desfecho )

        return "<Desfecho({})>".format( attributes )


def connect_to_database( user: str, pwd: str, db: str ):

    engine = create_engine( "mysql+pymysql://{0}:{1}@localhost/{2}".format( user, pwd, db) )

    Session.configure( bind=engine )

    Base.metadata.create_all( engine )



def create_patient_model( arr: List[ str ] ) -> dict :

    model = {
        "id_paciente":      get_elem( arr, 0 ), 
        "sexo":             get_elem( arr, 1 ), 
        "ano_nascimento":   get_elem( arr, 2 ), 
        "pais":             get_elem( arr, 3 ), 
        "uf":               get_elem( arr, 4 ), 
        "municipio":        get_elem( arr, 5 ), 
        "cep_reduzido":     get_elem( arr, 6 ) 
    }

    p = Paciente( **model )

    session = Session()

    try:

        session.add( p )

        session.commit( )
    
    except Exception as err:

        print( err )

        return model
    

created_exams = set()

def create_exam_model( arr: List[ str ], count: int ) -> dict:

    session = Session()

    model = {
        "id":               count,
        "id_paciente":      get_elem( arr, 0 ), 
        "id_atendimento":   get_elem( arr, 1 ), 
        "dt_coleta":        get_elem( arr, 2 ), 
        "origem":           get_elem( arr, 3 ), 
        "descricao":        get_elem( arr, 4 ), 
        "analito":          get_elem( arr, 5 ), 
        "resultado":        get_elem( arr, 6 ), 
        "unidade":          get_elem( arr, 7 ), 
        "valor_referencia": get_elem( arr, 8 ), 
    }

    e = Exame(**model)

    try:

        # query = session.query( Exame ).filter( Exame.id_paciente       == model[ "id_paciente" ],
        #                                        Exame.id_atendimento    == model[ "id_atendimento" ],
        #                                        Exame.dt_coleta         == model[ "dt_coleta" ],
        #                                        Exame.origem            == model[ "origem" ],
        #                                        Exame.descricao         == model[ "descricao" ],
        #                                        Exame.analito           == model[ "analito" ],
        #                                        Exame.resultado         == model[ "resultado" ],
        #                                        Exame.unidade           == model[ "unidade" ],
        #                                        Exame.valor_referencia  == model[ "valor_referencia" ] )
        # exame = query.first()

        # if exame != None:

        #     print( "Already in {0}".format( exame ) ) 

        #     return

        if str(e) in created_exams:
            print( "Already in {0}".format( e ) ) 
            return

        session.add( e )

        created_exams.add( str(e) )

        session.commit()

    except Exception as err:

        print( "create_exames: {0}".format( len( created_exams ) ) )

        print( err )

        return model


def create_outcome_model( arr: List[ str ] ) -> dict:

    session = Session()

    model = {
        "id_paciente":      get_elem( arr, 0 ), 
        "id_atendimento":   get_elem( arr, 1 ), 
        "dt_atendimento":   get_elem( arr, 2 ), 
        "tipo_atendimento": get_elem( arr, 3 ), 
        "id_clinica":       get_elem( arr, 4 ), 
        "clinica":          get_elem( arr, 5 ), 
        "dt_desfecho":      get_elem( arr, 6 ), 
        "desfecho":         get_elem( arr, 7 ), 
    }

    d = Desfecho( **model )

    try:
        session.add(d)

        session.commit()

    except Exception as err:

        print( err )
        
        return model


def parse_csv_file( file_path: str, separator: str = "|", model: str = "" ) -> bool:

    f = open( file_path, "r" )

    # jump first line
    line = f.readline()
    line = f.readline()

    count = 1

    while line != None and line != "":

        arr = line.split( separator )

        if model == "exam":

            create_exam_model( arr, count )

        elif model == "patient":

            create_patient_model( arr )

        elif model == "outcome":

            create_outcome_model( arr )
        
        else:
            raise Exception( "Invalid Model: {0}".format( model ) )

        count += 1

        if count % 100 == 0:

            print( "{0} {1} inserted".format( count, model ) )
        
        line = f.readline()

    return count


if __name__ == "__main__":

    if len(sys.argv) != 5:

        raise Exception( "Invalid arguments: {0}".format( sys.argv ) )

    print( "Received Arguments: {0}".format( sys.argv ) )

    connect_to_database( sys.argv[1], sys.argv[2], sys.argv[3] )

    patient_config = {
        "file_path":"/home/rseusebio/Codes/Databases/trabalho_final/HSL_Janeiro2021/HSL_Pacientes_3.csv",
        "separator": "|", 
        "model": "patient"
    }

    exam_config = {
        "file_path":"/home/rseusebio/Codes/Databases/trabalho_final/HSL_Janeiro2021/HSL_Exames_3.csv",
        "separator": "|", 
        "model": "exam"
    }
    
    outcome_config = {
        "file_path":"/home/rseusebio/Codes/Databases/trabalho_final/HSL_Janeiro2021/HSL_Desfechos_3.csv",
        "separator": "|", 
        "model": "outcome"
    }

    lines = 0

    if sys.argv[4] == "p":

        lines = parse_csv_file( **patient_config )

    elif sys.argv[4] == "e":

        lines = parse_csv_file( **exam_config )
    
    elif sys.argv[4] == "o":

        lines = parse_csv_file( **outcome_config )
    
    else: 

        raise Exception( "Invalid model: {0}".format( sys.argv[4] ) )

    print( "Finsished parsing model {0}. Total Lines: {1}".format( sys.argv[4], lines ) )

