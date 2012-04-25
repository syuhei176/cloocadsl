import os
import clooca
import unittest
import tempfile

class cloocaTestCase(unittest.TestCase):

    def setUp(self):
        self.db_fd, clooca.app.config['DATABASE'] = tempfile.mkstemp()
        clooca.app.config['TESTING'] = True
        self.app = clooca.app.test_client()
#        clooca.init_db()

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(clooca.app.config['DATABASE'])
        
    def test_loginview(self):
        rv = self.app.get('/', follow_redirects=True)
        assert 'login' in rv.data
        rv = self.login('clooca', 'kyushu')
        assert 'clooca' in rv.data
        self.logout()
#        assert 'index' in rv.data
        
    def login(self, username, password):
        return self.app.post('/login-to', data=dict(
                                                 username=username,
                                                 password=password
                                                 ), follow_redirects=True)

    def logout(self):
        return self.app.get('/logout', follow_redirects=True)

if __name__ == '__main__':
    unittest.main()