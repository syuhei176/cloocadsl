# coding: utf-8

# Copyright (C) 2012 Technical Rockstars inc. <syuhei176@gmail.com>
#
# clooca
#
#
__author__ = "Hiya Syuhei <syuhei176@gmail.com>"
__status__ = "demo"
__version__ = "0.1"
__date__    = "19 07 2012"


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
import clooca.repository.project
import clooca.sns.friend
import clooca.sns.message
import clooca.workbench.wb
app = Flask(__name__)

from functools import wraps

def MySQLConnection(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        global connect
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = f(*args, **kwargs)
        connect.close()
        return result
    return decorated


"""
トップページ、ホーム等
"""
@app.route('/')
@MySQLConnection
def index():
    """
    トップ画面、ホーム画面
    """
    if 'user' in session:
        tools = clooca.repository.tool.getMyReadableTools(connect, session['user'])
        return render_template('top_loggedin.html', param1='', user=session['user'], tools=tools)
    return render_template('top_not_loggedin.html')

@app.route('/demo')
def demo():
    return render_template('/test/demo.html')

@app.route('/tutorial')
def tutorial():
    return render_template('/test/tutorial.html')

@app.route('/document')
def document():
    return render_template('/test/document.html')


@app.route('/tool/info-view/<tool_key>')
@MySQLConnection
def tool_info_view(tool_key):
    """
    ツール情報のページ
    """
    if 'user' in session:
        result = clooca.repository.tool.getToolInfo(connect, session['user'], tool_key)
        messages = clooca.sns.message.toolFeed(connect, session['user'], tool_key, 5)
        commits = clooca.sns.message.toolCommit(connect, session['user'], tool_key, 5)
        return render_template('/tool/tool_page.html', user=session['user'], mode='toolinfo', tool=result, messages=messages, commits=commits)
    return redirect(url_for('index'))

@app.route('/home')
@MySQLConnection
def home():
    if 'user' in session:
        feeds = clooca.sns.message.homeFeed(connect, session['user'], 5)
        return render_template('home.html', feeds=feeds)
    return redirect(url_for('index'))

@app.route('/market')
def market():
    if 'user' in session:
        return render_template('market/market_top.html')
    return redirect(url_for('index'))

@app.route('/myprojects/<toolkey>')
@MySQLConnection
def project_myprojects(toolkey):
    """
    toolkeyのマイプロジェクトを表示
    """
    if 'user' in session:
        toolinfo = clooca.repository.tool.getToolInfo(connect, session['user'], toolkey)
        projects = clooca.repository.project.getMyWritableProjects(connect, session['user'], toolkey)
        return render_template('/project/project_top.html', toolinfo=toolinfo, projects=projects)
    return redirect(url_for('index'))

@app.route('/proj/create-view/<toolkey>')
@MySQLConnection
def proj_create_view(toolkey):
    """
    新規プロジェクト作成
    """
    if 'user' in session:
        toolinfo = clooca.repository.tool.getToolInfo(connect, session['user'], toolkey)
        tooltags = clooca.repository.tool.tags(connect, session['user'], toolkey)
        return render_template('/project/create_project.html', toolinfo=toolinfo, tooltags=tooltags)
    return redirect(url_for('index'))

@app.route('/project-page/<project_id>')
@MySQLConnection
def project_page(project_id):
    if 'user' in session:
        result = clooca.repository.project.getProjectInfo(connect, session['user'], project_id)
        return render_template('project/project_info.html', projinfo = result)
    return redirect(url_for('index'))

"""
ツール情報表示
"""
@app.route('/mytool')
def mytool():
    if 'user' in session:
        return render_template('tool/tool_top.html')
    return redirect(url_for('index'))

@app.route('/mytool/<mode>')
@MySQLConnection
def mytool_mode(mode):
    """
    ツール(available|developping)
    """
    if 'user' in session:
        if mode == 'available':
            result = clooca.repository.tool.getMyReadableTools(connect, session['user'], 10)
            return render_template('tool/tool_top.html', tools=result)
        elif mode == 'developping':
            result = clooca.repository.tool.getMyWritableTools(connect, session['user'])
            return render_template('tool/tool_top.html', tools=result)
    return redirect(url_for('index'))

@app.route('/tool/create-view')
def tool_create_view():
    """
    新規ツール作成
    """
    if 'user' in session:
        return render_template('/tool/create_tool.html')
    return redirect(url_for('index'))


@app.route('/login')
def login():
    """
    ログイン画面表示
    """
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
@MySQLConnection
def profile(id):
    if 'user' in session:
        result = clooca.sns.friend.getUserProfile(connect, session['user'], id)
        return render_template('profile.html', user=session['user'], profile=result)
    return redirect(url_for('login'))

@app.route('/update-userinfo', methods=['POST'])
@MySQLConnection
def update_userinfo():
    if 'user' in session:
        if 'password' in request.form:
            result = UserService.changePassword(connect, session['user'], request.form['password'])
        else:
            result = UserService.updateUserInfo(connect, session['user'], request.form['fullname'])
        return json.dumps(result)
    return 'false'

"""
project
"""
@app.route('/project/create', methods=['POST'])
@MySQLConnection
def project_create():
    if 'user' in session:
        result = clooca.repository.project.create(connect, session['user'], request.form['name'], request.form['toolkey'], request.form['toolver'])
        return json.dumps(result)
    return 'false'


"""
editor
"""
@app.route('/edit/<project_id>')
@MySQLConnection
def edit(project_id):
    if 'user' in session:
        result = clooca.repository.project.load_from_ws(connect, session['user'], project_id)
        projinfo = clooca.repository.project.getProjectInfo(connect, session['user'], project_id)
        tool = clooca.repository.tool.getTaggedTool(connect, session['user'], projinfo['toolkey'], projinfo['tool_tag_id'])
        return render_template('test/editor.html', proj=json.dumps(projinfo), tool=json.dumps(tool),model=result)
    return redirect(url_for('login'))

@app.route('/ed-api/save', methods=['POST'])
@MySQLConnection
def ed_save():
    if 'user' in session:
        result = clooca.repository.project.save_to_ws(connect, session['user'], request.form['project_id'], request.form['model'])
        return json.dumps(result)
    return redirect(url_for('login'))


"""
tool
"""
@app.route('/tool/create', methods=['POST'])
def tool_create():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.repository.tool.create(connect, session['user'], request.form['tool_key'], request.form['tool_name'], request.form['vis'])
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
@app.route('/search/<token>')
def search_view(token):
    if 'user' in session:
        return render_template('/sns/search_result.html', user=session['user'], token=token)
    return render_template('login.html')

@app.route('/finditems/<filter>/<token>')
def finditems(filter, token):
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        if filter == 'all':
            result1 = clooca.repository.tool.getPublicTools(connect, session['user'], 5, token=token)
            result2 = clooca.sns.friend.findItem(connect, session['user'], token, 0, 5)
            result = result1 + result2
        elif filter == 'user':
            result = clooca.sns.friend.findItem(connect, session['user'], token, 0, 5)
        elif filter == 'group':
            result = []
        elif filter == 'project':
            result = []
        elif filter == 'tool':
            result = clooca.repository.tool.getPublicTools(connect, session['user'], 5, token=token)
        connect.close()
        return render_template('/sns/search_result_inner.html', items=result)
    return render_template('login.html')

@app.route('/sns/reqs')
def friend_requests():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.sns.friend.getRequestedList(connect, session['user'], 5)
        connect.close()
        return render_template('/sns/friend_requests.html', items=result)
    return render_template('login.html')

@app.route('/sns/friends')
def friends():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.sns.friend.getFriendList(connect, session['user'], 5)
        connect.close()
        return render_template('/sns/friend_requests.html', items=result)
    return render_template('login.html')

@app.route('/sns/request', methods=['POST'])
def sns_request():
    """
    友達リクエスト申請
    """
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.sns.friend.requestFriend(connect, session['user'], request.form['requested_user_id'])
        connect.close()
        return json.dumps(result)
    return 'null'

@app.route('/sns/accept', methods=['POST'])
def sns_accept():
    """
    友達リクエスト承認
    """
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.sns.friend.acceptFriend(connect, session['user'], request.form['requesting_user_id'])
        connect.close()
        return json.dumps(result)
    return 'null'

@app.route('/sns/myfeed', methods=['GET'])
def sns_myfeed():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.sns.message.myFeed(connect, session['user'], 5)
        connect.close()
        return json.dumps(result)
    return 'null'

"""
test
"""
@app.route('/test/editor')
def test_editor():
    return render_template('/test/editor.html')

@app.route('/test/wb')
def test_wb():
    return render_template('/test/wb.html')

"""
wb
"""
@app.route('/wb/<tool_key>')
@MySQLConnection
def wb(tool_key):
    if 'user' in session:
        result = clooca.repository.tool.load_from_ws(connect, session['user'], tool_key)
        return render_template('test/wb.html', toolinfo=result)
    return redirect(url_for('login'))

@app.route('/wb-api/get-metastructure', methods=['POST'])
def wb_get_metastructure():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.sns.friend.acceptFriend(connect, session['user'], request.form['requesting_user_id'])
        connect.close()
        return json.dumps(result)
    return 'null'

@app.route('/wb-api/save', methods=['POST'])
def wb_save():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.repository.tool.save_to_ws(connect, session['user'], request.form['toolkey'], metamodel=request.form['content'])
        connect.close()
        return json.dumps(result)
    return 'null'

@app.route('/wb-api/save-notation', methods=['POST'])
def wb_save_notation():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.repository.tool.save_to_ws(connect, session['user'], request.form['toolkey'], notation=request.form['content'])
        connect.close()
        return json.dumps(result)
    return 'null'

"""
wb/template
"""

@app.route('/wb-api/templates/<toolkey>', methods=['GET'])
def wb_template(toolkey):
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.workbench.wb.get_templates(connect, session['user'], toolkey)
        connect.close()
        return json.dumps(result)
    return 'null'

@app.route('/wb-api/create-template', methods=['POST'])
def wb_create_template():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.workbench.wb.create_template(connect, session['user'], request.form['toolkey'], request.form['name'], request.form['package_uri'])
        connect.close()
        return json.dumps(result)
    return 'null'

@app.route('/wb-api/save-template', methods=['POST'])
def wb_save_template():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.workbench.wb.save_template(connect, session['user'], request.form['toolkey'], request.form['name'], request.form['package_uri'], request.form['content'])
        connect.close()
        return json.dumps(result)
    return 'null'

@app.route('/wb-api/commit', methods=['POST'])
def wb_commit():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.repository.tool.commit(connect, session['user'], request.form['toolkey'], request.form['comment'])
        connect.close()
        return json.dumps(result)
    return 'null'

@app.route('/wb-api/update', methods=['POST'])
def wb_update():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        clooca_resp = clooca.repository.tool.update(connect, session['user'], request.form['toolkey'])
        connect.close()
        return clooca_resp.dumps()
    return 'null'

@app.route('/wb-api/tags/<toolkey>', methods=['GET'])
def wb_tags(toolkey=None):
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.repository.tool.tags(connect, session['user'], toolkey)
        connect.close()
        return json.dumps(result)
    return 'null'

@app.route('/wb-api/create-tag', methods=['POST'])
def wb_create_tag():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = clooca.repository.tool.create_tag(connect, session['user'], request.form['toolkey'], request.form['tag'])
        connect.close()
        return json.dumps(result)
    return 'null'

@app.route('/wb-api/del-tag', methods=['POST'])
def wb_del_tag():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        clooca_resp = clooca.repository.tool.del_tag(connect, session['user'], request.form['toolkey'])
        connect.close()
        return clooca_resp.dumps()
    return 'null'

@app.route('/robots.txt')
def robots():
    return '''
    User-agent: *
    Disallow: /
    '''



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