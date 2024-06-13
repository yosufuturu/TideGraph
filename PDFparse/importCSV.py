import sqlite3
import csv

dbname = ''
read_csv = ['2023_low.csv']
FIELD_NAME = ['date','time', 'code', 'tide']

con = sqlite3.connect('../db/test.db')
cur = con.cursor()


def getTablesList():
    cur.execute("select * from sqlite_master where type='table'")
    for row in cur.fetchall():
        print(row)



def importLowTideData(file):
    create_lowtide_tb = 'create table if not exists lowtide(date text, time text, code text, tide integer)'
    cur.execute(create_lowtide_tb)
    cur.execute('.mode csv')
    cur.execute('.import ./'+ file + ' lowtide')
    


importLowTideData('2023_low.csv')