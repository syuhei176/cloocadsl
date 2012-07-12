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
        return render_template('top_loggedin.html', email=session['user']['email'])
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
            return render_template('tool/tool_top.html')
        elif mode == 'developping':
            return render_template('tool/tool_top.html')
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

@app.route('/mypage')
def mypage():
    if 'user' in session:
        return render_template('mypage.html', user=session['user'])
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

@app.route('/edit/<project_key>')
def edit(project_key):
    if 'user' in session:
        return render_template('editor/editor.html')
    return redirect(url_for('login'))

@app.route('/wb/<tool_key>')
def wb(tool_key):
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.repository.tool.load_from_ws(connect, session['user'], tool_key)
        connect.close()
        return render_template('workbench.html', tool=json.dumps(result))
    return redirect(url_for('login'))

"""
SNS
"""

"""
id:50
"""
@app.route('/finditems/<token>')
def finditems(token):
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.sns.friend.findItem(connect, session['user'], token, 5)
        connect.close()
        return render_template('search_result.html', items=result)
    return render_template('login.html')

"""
id:51

"""
@app.route('/requestedfriends')
def requestedfriends():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.sns.friend.getRequestedList(connect, session['user'], 5)
        connect.close()
        return render_template('search_result.html', items=result)
    return render_template('login.html')


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