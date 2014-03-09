"""
This is a really simple flat-file database to store JSON blobs.

No validation is done whatsoever.
"""
import os

from server import app
import json


def get_wine(id):
    wine_filename = _filename_for_id(id)
    wine_file = open(wine_filename, 'r')
    wine = json.load(wine_file)
    return wine

def delete_wine(id):
    wine_filename = _filename_for_id(id)
    os.remove(wine_filename)
    return None

def insert_wine(wine):
    """
    Take a dictionary object which represents a wine, and write it
    into a file. The filename will have an ID, this function will
    return that ID so that the wine can be looked up again later
    """
    new_wine_id = _get_id_counter_val() + 1
    wine['id'] = new_wine_id
    new_wine_filename = _filename_for_id(new_wine_id)

    new_wine_file = open(new_wine_filename, 'w')
    json.dump(wine, new_wine_file)
    new_wine_file.close()

    _increment_id_counter()

    return new_wine_id


def update_wine(id, wine):
    """
    Just rewrites the wine at given ID with new data from given wine object
    """
    wine['id'] = id
    wine_filename = _filename_for_id(id)
    wine_file = open(wine_filename, 'w')
    json.dump(wine, wine_file)
    wine_file.close()
    return id


def list_wines():
    directory = _get_db_directory()
    wines = []
    for wine_filename in os.listdir(directory):
        if wine_filename.endswith('.json'):
            f = open(directory + wine_filename, 'r')
            wine = json.load(f)
            wines.append(wine)
            f.close()
    wines.sort(key=lambda x: int(x['id']))
    return wines


def _get_db_directory():
    if app.config['TESTING']:
        db_dir = './testdb/'
    else:
        db_dir = './db/'

    if not os.path.exists(db_dir):
        os.makedirs(db_dir)
    return db_dir


def _filename_for_id(id):
    return _get_db_directory() + 'wine_%s.json' % str(id)


def _get_id_counter_filename():
    return _get_db_directory() + 'id_counter'


def _increment_id_counter():
    cur_id = _get_id_counter_val()
    counter_file = open(_get_id_counter_filename(), 'w')
    counter_file.write(str(cur_id + 1))
    counter_file.close()


def _get_id_counter_val():
    try:
        counter_file = open(_get_id_counter_filename(), 'r')
    except IOError:
        # Set to 0
        counter_file = open(_get_id_counter_filename(), 'w')
        counter_file.write('0\n')
        counter_file.close()
        counter_file = open(_get_id_counter_filename(), 'r')

    cur_counter_raw_val = counter_file.readline().strip()
    counter_file.close()
    
    try:
        return int(cur_counter_raw_val)
    except ValueError:
        return 0
