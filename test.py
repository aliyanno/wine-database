import unittest
import os

from server import app
import database


class ApiTest(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['DATABASE']
        self.app = app.test_client()


class DatabaseTest(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True

        self.test_wine = {
            'name': 'Test Wine!',
            'producer': 'Oily Vineyards',
            'vintage': '1942',
            'varietal': 'Blue Wine',
            'country': 'Iceland',
            'region_list': [
                'Reykjavik',
                'Detroit'
            ]
        }

    def tearDown(self):
        # Remove files in the test DB directory
        filenames = os.listdir('./testdb/')
        for f in filenames:
            os.remove('./testdb/' + f)

        
    def test_insert_wine_gives_good_id(self):
        """ Inserting a wine should return a valid ID"""
        id = database.insert_wine(self.test_wine)
        self.assertIsNotNone(id, "the id returned shouldnt be none")
        self.assertIsInstance(id, int, "the id should be an integer")

    def test_insert_wine_actually_inserts_it(self):
        """ Inserting a wine should give an ID that you can use to look it up again"""
        id = database.insert_wine(self.test_wine)
        wine2 = database.get_wine(id)
        self.assertEqual(self.test_wine, wine2, " the wine should equal the wine entered")

    def test_filenames_never_overwrite(self):
        # generate a file
        first_id = database._get_id_counter_val()
        first_filename = database._filename_for_id(first_id)
        database._increment_id_counter()
        # make a new name: it shouldn't clobber on top of the already-existing wine
        second_id = database._get_id_counter_val()
        second_filename = database._filename_for_id(second_id)
        self.assertNotEqual(first_filename, second_filename, "filenames generated shouldn't overwrite existing files")

    def test_empty_id_counter_file_gives_id_0(self):
        """ When no ID counter file has been made, we should get '0' as the next ID to use """
        id = database._get_id_counter_val()
        self.assertEqual(id, 0)

    def test_garbage_counter_file_returns_0(self):
        fname = database._get_id_counter_filename()
        f = open(fname, 'w')
        f.close()  # its now an empty file
        
        id = database._get_id_counter_val()
        self.assertEqual(id, 0)



if __name__ == '__main__':
    unittest.main()
        

        
        
