from paciente import Paciente
from clinica import Clinica
from atendimento import Atendimento
from exame import Exame
from analito import Analito
from index import Session, connect_to_database
import sys

def insert_file_content(file_path: str, sep: str = "|", model: str = "") -> bool:
    f = open(file_path, "r")

    # jump first line
    line = f.readline()

    line = f.readline()

    count = 1

    while line:
        arr = line.split(sep)

        if model == "exame":
            Exame.create_instance(arr, count)

        elif model == "paciente":
            Paciente.create_instance(arr)
        
        elif model == "clinica":
            Clinica.create_instance(arr)

        elif model == "atendimento":
            Atendimento.create_instance(arr)

        elif model == "analito":
            Analito.create_instance(arr)

        else:
            raise Exception( "Invalid Model: {0}".format( model ) )

        count += 1

        if count % 100 == 0:
            print( "{0} {1} instances inserted".format( count, model ) )
        
        line = f.readline()

    return count

def run(model:str):
    db_config = {
        "user": "root", 
        "pwd": "R$&mysql95", 
        "db": "hospital"
    }

    connect_to_database(**db_config)

    insertion_config = {
        "file_path":"/home/rseusebio/Codes/Databases/trabalho_final/HSL_Janeiro2021/HSL_Exames_3.csv",
        "sep": "|", 
        "model": model
    }

    insert_file_content(**insertion_config)

if __name__ == "__main__":
    run("exame")
