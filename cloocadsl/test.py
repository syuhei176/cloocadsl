# coding: utf-8
import os
import clooca
import unittest
import tempfile

"""
test_admin1
test_admin2
test_user1
test_user2
test_group1 member(test_admin1, test_admin2, test_user1)
test_group2 member(test_admin2, test_user2)
test_metamodel1 belong test_admin1　公開
test_metamodel2 belong test_admin1　非公開
test_project1 belong test_user1
test_project2 belong test_user2

テストケース
test_user1がtest_group1にてtest_metamodel1をメタモデルとしたプロジェクトを作成できる。
test_user1がtest_group1にてプロジェクトを削除できる
test_user2がtest_metamodel1をメタモデルとしたプロジェクトを作成できない。
test_user2がtest_project1を開けないし、削除できない
test_user1がtest_group1にてtest_metamodel2をメタモデルとしたプロジェクトを作成できない。
test_admin1がtest_group1にてtest_metamodel2をメタモデルとしたプロジェクトを作成できる。
"""
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