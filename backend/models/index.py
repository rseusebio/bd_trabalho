from typing import List
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Boolean, create_engine, PrimaryKeyConstraint
from sqlalchemy.orm import sessionmaker
import mysql
import pymysql
import sys 
from unidecode import unidecode

Base = declarative_base()
Session = sessionmaker()

def get_elem(arr, index: int):

    if index >= len(arr):
        return None
    
    if not arr[index]:
        return None

    return unidecode(str(arr[index])).strip().lower()

def connect_to_database(user: str, pwd: str, db: str):

    engine = create_engine("mysql+pymysql://{0}:{1}@localhost/{2}".format(user, pwd, db), pool_size=20, max_overflow=0)

    Session.configure(bind=engine)

    Base.metadata.create_all(engine)