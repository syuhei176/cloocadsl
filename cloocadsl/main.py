# coding: utf-8
"""
"""

from flask import Flask, url_for, render_template, session, request, make_response, redirect
import sys
import os
import zipfile
import json
import md5
import MySQLdb
import config
sys.path.append(config.CLOOCA_MODULE)
from clooca.account import RegisterService
from clooca.account import LoginService
from clooca.account import UserService
import clooca.repository.tool
import clooca.sns.friend
app = Flask(__name__)

#トップページ

"""
id:1
すべてはここから始まる
"""
@app.route('/')
def index():
    if 'user' in session:
        return render_template('top_loggedin.html', user=session['user'])
    return render_template('top_not_loggedin.html')

"""
id:2
"""
@app.route('/home')
def home():
    if 'user' in session:
        return render_template('home.html')
    return redirect(url_for('index'))

"""
id:3
マーケット
"""
@app.route('/market')
def market():
    if 'user' in session:
        return render_template('market/market_top.html')
    return redirect(url_for('index'))

"""
プロジェクト
"""
@app.route('/project')
def project_top():
    if 'user' in session:
        return render_template('project/project_top.html')
    return redirect(url_for('index'))

"""
ツール
"""
@app.route('/mytool')
def mytool():
    if 'user' in session:
        return render_template('tool/tool_top.html')
    return redirect(url_for('index'))

"""
ツール(available|developping)
"""
@app.route('/mytool/<mode>')
def mytool_mode(mode):
    if 'user' in session:
        if mode == 'available':
            connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
            result = clooca.repository.tool.getMyReadableTools(connect, session['user'])
            connect.close()
            return render_template('tool/tool_top.html', tools=result)
        elif mode == 'developping':
            connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
            result = clooca.repository.tool.getMyWritableTools(connect, session['user'])
            connect.close()
            return render_template('tool/tool_top.html', tools=result)
    return redirect(url_for('index'))

"""
新規ツール作成
"""
@app.route('/tool/create-view')
def tool_create_view():
    if 'user' in session:
        return render_template('tool/create_tool.html')
    return redirect(url_for('index'))

"""
ツール情報のページ
"""
@app.route('/tool/info-view/<tool_key>')
def tool_info_view(tool_key):
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.repository.tool.getToolInfo(connect, session['user'], tool_key)
        connect.close()
        return render_template('tool/tool_page.html', tool=result)
    return redirect(url_for('index'))

"""
ログイン画面
"""
@app.route('/login')
def login():
    if 'user' in session:
        return redirect(url_for('index'))
    return render_template('login.html')

"""
ユーザ登録用url
"""
@app.route('/register-to', methods=['POST'])
def register_to():
    return json.dumps(RegisterService.Register(request.form['email']))

@app.route('/login-to', methods=['POST'])
def login_to():
    user = LoginService.Login(request.form['email'],request.form['password'])
    if not user == None and 'permanent' in request.form:
        session.permanent = True
    return json.dumps(user)

@app.route('/logout')
def logout():
    # remove the username from the session if its there
    session.pop('user', None)
    return redirect(url_for('index'))

"""
マイページ
"""
@app.route('/mypage')
def mypage():
    if 'user' in session:
        return render_template('mypage.html', user=session['user'])
    return redirect(url_for('login'))

"""
プロフィールページ
"""
@app.route('/profile/<id>')
def profile(id):
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.sns.friend.getUserProfile(connect, session['user'], id)
        connect.close()
        return render_template('profile.html', user=session['user'], profile=result)
    return redirect(url_for('login'))

@app.route('/update-userinfo', methods=['POST'])
def update_userinfo():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        if 'password' in request.form:
            result = UserService.changePassword(connect, session['user'], request.form['password'])
        else:
            result = UserService.updateUserInfo(connect, session['user'], request.form['fullname'])
        connect.close()
        return json.dumps(result)
    return 'false'

"""
editor
"""
@app.route('/edit/<project_key>')
def edit(project_key):
    if 'user' in session:
        return render_template('editor/editor.html')
    return redirect(url_for('login'))

"""
tool
"""
@app.route('/wb/<tool_key>')
def wb(tool_key):
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.repository.tool.load_from_ws(connect, session['user'], tool_key)
        connect.close()
        return render_template('workbench.html', tool=json.dumps(result))
    return redirect(url_for('login'))

@app.route('/tool/create', methods=['POST'])
def tool_create():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.repository.tool.create(connect, session['user'], request.form['tool_key'], request.form['tool_name'])
        connect.close()
        return json.dumps(result)
    return 'false'

@app.route('/tool/delete', methods=['POST'])
def tool_delete():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.repository.tool.delete(connect, session['user'], request.form['tool_key'])
        connect.close()
        return json.dumps(result)
    return 'false'

"""
SNS
"""


"""
id:50
"""
@app.route('/search/<token>')
def search_view(token):
    if 'user' in session:
        return render_template('/sns/search_result.html', user=session['user'], token=token)
    return render_template('login.html')

"""
id:50
"""
@app.route('/finditems/<filter>/<token>')
def finditems(filter, token):
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        if filter == 'all':
            result = clooca.sns.friend.findItem(connect, session['user'], token, 0, 5)
        elif filter == 'user':
            result = clooca.sns.friend.findItem(connect, session['user'], token, 0, 5)
        elif filter == 'group':
            result = []
        elif filter == 'project':
            result = []
        elif filter == 'tool':
            result = []
        connect.close()
        return render_template('/sns/search_result_inner.html', items=result)
    return render_template('login.html')

"""
id:51

"""
@app.route('/sns/reqs')
def friend_requests():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.sns.friend.getRequestedList(connect, session['user'], 5)
        connect.close()
        return render_template('/sns/friend_requests.html', items=result)
    return render_template('login.html')

"""
id:52
友達リクエスト申請
"""
@app.route('/sns/request', methods=['POST'])
def sns_request():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.sns.friend.requestFriend(connect, session['user'], request.form['requested_user_id'])
        connect.close()
        return json.dumps(result)
    return 'null'

"""
id:53
友達リクエスト承認
"""
@app.route('/sns/accept', methods=['POST'])
def sns_accept():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.sns.friend.acceptFriend(connect, session['user'], request.form['requesting_user_id'])
        connect.close()
        return json.dumps(result)
    return 'null'

with app.test_request_context():
    print url_for('index')

#sercret key
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

if not app.debug:
    import logging
    from logging import FileHandler
    file_handler = FileHandler(config.CLOOCA_ROOT + '/log.txt')
    file_handler.setLevel(logging.WARNING)
    app.logger.addHandler(file_handler)
    
if __name__ == '__main__':
    app.run(debug=True)