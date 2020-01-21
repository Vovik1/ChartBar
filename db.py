import os
import csv
import glob
import sqlite3


conn = sqlite3.connect('data.sqlite')
cur = conn.cursor()

cur.execute('''CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY, entity TEXT, value FLOAT, string TEXT) ''')

basedir = os.path.abspath(os.path.dirname(__file__)) + '/data/'

files = glob.glob(basedir + '*.csv')


def handle_encoding(filename):
    with open(filename, 'rb') as f:
        byte = f.read(1)
        encoding = byte.decode()
        while byte != b'\n':
            byte = f.read(1)
            encoding += byte.decode()
    return encoding[encoding.find('=') + 1:-1]


def read_file(file, encoding='utf-8'):
    with open(file, newline='', encoding=encoding) as csv_file:
        encoding_type = csv_file.readline()
        reader = csv.reader(csv_file, delimiter=',')
        for row in reader:
            entity, value, *_, string = row
            cur.execute('''INSERT INTO data (entity, value, string)
                            VALUES (?, ?, ?)''', (entity, value[:value.find('.') + 3], string))
            conn.commit()


for file in files:
    try:
        read_file(file)
    except UnicodeDecodeError:
        try:
            read_file(file, encoding=handle_encoding(file))
        except UnicodeDecodeError:
            with open(file, 'rb') as f:
                read_file(file, encoding='cp437')

cur.close()


