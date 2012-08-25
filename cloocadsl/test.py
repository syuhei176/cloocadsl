# coding: utf-8
import os
import main
import unittest
import tempfile
import config
import MySQLdb
from clooca.util import Util
import md5
import datetime

"""
"""
class cloocaTestCase(unittest.TestCase):
    
    def init_db(self):
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        cur = connect.cursor()
        d = datetime.datetime.today()
        password = 'password'
        cur.execute('INSERT INTO account_info (email,password,registration_date,fullname) VALUES(%s,%s,%s,%s);',(Util.myencode('syuhei@clooca.com'), md5.new(password).hexdigest(), d.strftime("%Y-%m-%d"), '部谷'))
        self.user_id1 = cur.lastrowid
        cur.execute('INSERT INTO account_info (email,password,registration_date,fullname) VALUES(%s,%s,%s,%s);',(Util.myencode('test1@clooca.com'), md5.new(password).hexdigest(), d.strftime("%Y-%m-%d"), '山下'))
        self.user_id2 = cur.lastrowid
        cur.execute('INSERT INTO account_info (email,password,registration_date,fullname) VALUES(%s,%s,%s,%s);',(Util.myencode('test2@clooca.com'), md5.new(password).hexdigest(), d.strftime("%Y-%m-%d"), '山口'))
        cur.execute('INSERT INTO account_info (email,password,registration_date,fullname) VALUES(%s,%s,%s,%s);',(Util.myencode('test3@clooca.com'), md5.new(password).hexdigest(), d.strftime("%Y-%m-%d"), '山中'))
        cur.execute('INSERT INTO account_info (email,password,registration_date,fullname) VALUES(%s,%s,%s,%s);',(Util.myencode('test4@clooca.com'), md5.new(password).hexdigest(), d.strftime("%Y-%m-%d"), '山岡'))
        cur.execute('INSERT INTO account_info (email,password,registration_date,fullname) VALUES(%s,%s,%s,%s);',(Util.myencode('test5@clooca.com'), md5.new(password).hexdigest(), d.strftime("%Y-%m-%d"), '山本'))
        cur.execute('INSERT INTO account_info (email,password,registration_date,fullname) VALUES(%s,%s,%s,%s);',(Util.myencode('test6@clooca.com'), md5.new(password).hexdigest(), d.strftime("%Y-%m-%d"), '山根'))
        connect.commit()
        cur.close()
        connect.close()
        
    def setUp(self):
        self.db_fd, main.app.config['DATABASE'] = tempfile.mkstemp()
        main.app.config['TESTING'] = True
        self.app = main.app.test_client()
        self.init_db()

    def tearDown(self):
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        cur = connect.cursor()
        cur.execute('TRUNCATE TABLE account_info;')
        cur.execute('TRUNCATE TABLE account_relationship;')
        cur.execute('TRUNCATE TABLE tool_info;')
        cur.execute('TRUNCATE TABLE user_has_tool;')
        connect.commit()
        cur.close()
        connect.close()
        os.close(self.db_fd)
        os.unlink(main.app.config['DATABASE'])
    
    #ログイン
    def test_loginview(self):
        rv = self.app.get('/login', follow_redirects=True)
        assert 'login' in rv.data
        rv = self.login('syuhei@clooca.com', 'password')
        assert 'syuhei' in rv.data
        self.logout()
        #assert 'index' in rv.data

    #検索
    def test_search(self):
        rv = self.login('syuhei@clooca.com', 'password')
        assert 'syuhei' in rv.data
        rv = self.app.get('/finditems/user/山', follow_redirects=False)
        assert '山下' in rv.data
        assert '山本' in rv.data
        rv = self.app.get('/finditems/group/山', follow_redirects=False)
        assert not '山下' in rv.data
        self.logout()
        
    #リクエスト
    def test_friend(self):
        rv = self.login('syuhei@clooca.com', 'password')
        rv = self.app.post('/sns/request', data=dict(requested_user_id=self.user_id2))
        self.logout()
        rv = self.login('test1@clooca.com', 'password')
        rv = self.app.get('/sns/reqs')
        assert '部谷' in rv.data
        rv = self.app.post('/sns/accept', data=dict(requesting_user_id=self.user_id1))
        assert 'true' in rv.data
        rv = self.app.get('/sns/friends')
        assert '部谷' in rv.data
        self.logout()
    
    #ホーム
    def test_home(self):
        rv = self.login('syuhei@clooca.com', 'password')
        assert 'syuhei' in rv.data
        rv = self.app.get('/home')
        #assert 'home' in rv.data
        self.logout()

    #ユーザメッセージ
    def test_userfeed(self):
        rv = self.login('syuhei@clooca.com', 'password')
        assert 'syuhei' in rv.data
        self.logout()
    
    #ツールメッセージ
    def test_toolmes(self):
        rv = self.login('syuhei@clooca.com', 'password')
        assert 'syuhei' in rv.data
        self.logout()

    #ユーザ情報変更
    def test_userinfo(self):
        rv = self.login('syuhei@clooca.com', 'password')
        assert 'syuhei' in rv.data
        self.logout()

    #グループ作成
    def test_group(self):
        rv = self.login('syuhei@clooca.com', 'password')
        assert 'syuhei' in rv.data
        rv = self.app.post('/group/create', data=dict(
                                                 group_key='test',
                                                 group_name='テスト'
                                                 ))
        self.logout()

    #API設定
    def test_api(self):
        rv = self.login('syuhei@clooca.com', 'password')
        assert 'syuhei' in rv.data
        self.logout()
    
    #ツール
    def test_tool(self):
        rv = self.login('syuhei@clooca.com', 'password')
        assert 'syuhei' in rv.data
        rv = self.app.post('/tool/create', data=dict(
                                                 tool_key='test',
                                                 tool_name='テスト'
                                                 ))
        assert 'true' in rv.data
        self.logout()
    
    """
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
    """
    
    """
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
    """
        
    def login(self, email, password):
        return self.app.post('/login-to', data=dict(
                                                 email=email,
                                                 password=password
                                                 ), follow_redirects=True)

    def logout(self):
        return self.app.get('/logout', follow_redirects=True)

if __name__ == '__main__':
    unittest.main()