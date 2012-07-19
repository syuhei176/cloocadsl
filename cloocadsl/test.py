# coding: utf-8
import os
import clooca
import unittest
import tempfile
import config

"""
"""
class cloocaTestCase(unittest.TestCase):
    
    def init_db(self):
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        cur = connect.cursor()
        password = 'universe'
        cur.execute('INSERT INTO account_info (email,password,registration_date,fullname) VALUES(%s,%s,%s,%s);',(Util.myencode('test1@clooca.com'), md5.new(password).hexdigest(), d.strftime("%Y-%m-%d"), '山下'))
        cur.execute('INSERT INTO account_info (email,password,registration_date,fullname) VALUES(%s,%s,%s,%s);',(Util.myencode('test2@clooca.com'), md5.new(password).hexdigest(), d.strftime("%Y-%m-%d"), '山口'))
        cur.execute('INSERT INTO account_info (email,password,registration_date,fullname) VALUES(%s,%s,%s,%s);',(Util.myencode('test3@clooca.com'), md5.new(password).hexdigest(), d.strftime("%Y-%m-%d"), '山中'))
        cur.execute('INSERT INTO account_info (email,password,registration_date,fullname) VALUES(%s,%s,%s,%s);',(Util.myencode('test4@clooca.com'), md5.new(password).hexdigest(), d.strftime("%Y-%m-%d"), '山岡'))
        cur.execute('INSERT INTO account_info (email,password,registration_date,fullname) VALUES(%s,%s,%s,%s);',(Util.myencode('test5@clooca.com'), md5.new(password).hexdigest(), d.strftime("%Y-%m-%d"), '山本'))
        cur.execute('INSERT INTO account_info (email,password,registration_date,fullname) VALUES(%s,%s,%s,%s);',(Util.myencode('test6@clooca.com'), md5.new(password).hexdigest(), d.strftime("%Y-%m-%d"), '山根'))
        connect.commit()
        cur.close()
        connect.close()
        
    def setUp(self):
        self.db_fd, clooca.app.config['DATABASE'] = tempfile.mkstemp()
        clooca.app.config['TESTING'] = True
        self.app = clooca.app.test_client()
        self.init_db()

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(clooca.app.config['DATABASE'])
        
    def test_loginview(self):
        rv = self.app.get('/', follow_redirects=True)
        assert 'login' in rv.data
        rv = self.login('clooca', 'kyushu')
        assert 'clooca' in rv.data
        self.logout()
        #assert 'index' in rv.data
        
    def test_dashboard(self):
        rv = self.login('clooca', 'kyushu')
        assert 'clooca' in rv.data
        rv = self.app.get('/mygroups', follow_redirects=True)
        assert 'slenium' in rv.data
        rv = self.app.get('/dashboard/3', follow_redirects=True)
        assert 'slenium' in rv.data
        self.logout()
        rv = self.login('test', 'universe')
        assert 'test' in rv.data
        rv = self.app.get('/mygroups', follow_redirects=True)
        assert not 'slenium' in rv.data
        rv = self.app.get('/dashboard/3', follow_redirects=True)
        assert '権限がありません' in rv.data
        self.logout()

    '''
    test_user1がtest_group1にてtest_metamodel1をメタモデルとしたプロジェクトを作成できる。
    test_user1がtest_group1にてプロジェクトを削除できる
    test_user2がtest_metamodel1をメタモデルとしたプロジェクトを作成できない。
    '''
    def test_projectservice(self):
        rv = self.login('test_user1', 'unittest')
        assert 'test_user1' in rv.data
        rv = self.app.get('/mygroups', follow_redirects=True)
        assert 'test_group1' in rv.data
        rv = self.app.get('/dashboard/5', follow_redirects=True)
        assert 'test_group1' in rv.data
        rv = self.app.post('/createp', data=dict(
                                             group_id=5,
                                             name='test_project_tmp',
                                             xml='',
                                             metamodel_id=11,
                                             ), follow_redirects=True)
        assert 'true' in rv.data

        
    def login(self, username, password):
        return self.app.post('/login-to', data=dict(
                                                 username=username,
                                                 password=password
                                                 ), follow_redirects=True)

    def logout(self):
        return self.app.get('/logout', follow_redirects=True)

if __name__ == '__main__':
    unittest.main()