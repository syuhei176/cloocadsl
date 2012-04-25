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
sys.path.append(config.CLOOCA_CGI)
from core import UserService
from core import MetaModelService
from core import ProjectService
from core import ModelCompiler
from core import FileService
from core import GroupService
from mvcs import CommitService
from mvcs import UpdateServiceJSON
from mvcs import RepositoryService
from mvcs import mvcs
from shinshu import compile_server

app = Flask(__name__)

@app.route('/')
@app.route('/index')
def index():
    if 'user' in session:
        return render_template('index.html', loggedin = True, username = session['user']['uname'])
    return render_template('index.html', loggedin = False, username = '')

@app.route('/document')
def document():
    return render_template('document.html')

@app.route('/login', methods=['GET'])
def login_view():
    if 'user' in session:
        return redirect('/mygroups')
    else:
        return render_template('login.html')

def hash(k):
    return md5.new(str((k * 5 + 100001) % 34567)).hexdigest()

@app.route('/member_reg/<gid>/<key>', methods=['GET'])
def member_reg_view(gid,key):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    group = GroupService.getGroup(None, gid, connect)
    connect.close()
    if group == None or not key == hash(int(gid)):
        return render_template('request_deny.html')
    if 'user' in session:
        return render_template('member_join.html', group_id=gid, group=group)
    else:
        return render_template('member_reg.html', group_id=gid, group=group)

@app.route('/reg', methods=['GET'])
def reg_view():
    return render_template('register.html')

@app.route('/mygroups')
def mygroups(type='js'):
    if 'user' in session and 'joinInfos' in session['user']:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        resp = render_template('mygroups.html',
                               username = session['user']['uname'],
                               groups = GroupService.getMyGroups(session['user'], connect))
        connect.close()
        return resp
    return redirect(url_for('login_view'))


@app.route('/groups')
def groups():
    if 'user' in session and 'joinInfos' in session['user']:
        return render_template('groups.html',
                               username = session['user']['uname'],
                               joinInfos = session['user']['joinInfos']
                               )
    return redirect(url_for('login_view'))

@app.route('/account')
def account():
    if 'user' in session:
        return render_template('account.html', user = UserService.getUserInfo(session['user']))
    return redirect(url_for('login_view'))


@app.route('/dashboard/<id>')
def dashboard(id=None):
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        cur = connect.cursor()
        cur.execute('SELECT group_id,role FROM JoinInfo WHERE user_id=%s AND group_id=%s;', (session['user']['id'], id, ))
        rows = cur.fetchall()
        cur.close()
        joinInfo = {}
        joinInfo['id'] = int(id)
        joinInfo['role'] = int(rows[0][1])
        if not len(rows) == 0:
            if joinInfo['role'] == 0:
                return render_template('dashboard.html',
                                       loggedin = True,
                                       username = session['user']['uname'],
                                       mymetamodel = json.dumps(MetaModelService.loadMyMetaModelList(session['user'], id, connect)),
                                       myproject = json.dumps(ProjectService.loadMyProjectList(session['user'], id, connect)),
                                       metamodels = json.dumps(MetaModelService.loadMetaModelList(session['user'], id, connect)),
                                       group = GroupService.getGroup(session['user'], joinInfo['id'], connect),
#                                       members = GroupService.getGroupMember(session['user'], joinInfo['id'], connect),
                                       group_id = joinInfo['id'])
            elif joinInfo['role'] == 1:
                return render_template('dashboard1.html',
                                       loggedin = True,
                                       username = session['user']['uname'],
                                       mymetamodel = json.dumps(MetaModelService.loadMyMetaModelList(session['user'], id, connect)),
                                       myproject = json.dumps(ProjectService.loadMyProjectList(session['user'], id, connect)),
                                       metamodels = json.dumps(MetaModelService.loadMetaModelList(session['user'], id, connect)),
                                       group = GroupService.getGroup(session['user'], joinInfo['id'], connect),
                                       members = GroupService.getGroupMember(session['user'], joinInfo['id'], connect),
                                       group_id = joinInfo['id'],hash_key = hash(joinInfo['id']))
    else:
        return redirect(url_for('login_view'))
    return render_template('request_deny.html')

@app.route('/editorjs/<pid>')
def editorjs(pid=None):
    if 'user' in session:
        result = ProjectService.loadProject(session['user'], pid)
        if not result == None:
            gid = int(result['group_id'])
            connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
            cur = connect.cursor()
            cur.execute('SELECT GroupInfo.id AS id1,role,name,service FROM GroupInfo INNER JOIN JoinInfo ON GroupInfo.id = JoinInfo.group_id AND JoinInfo.user_id=%s AND group_id=%s;',(session['user']['id'], gid))
            rows = cur.fetchall()
            cur.close()
            connect.close()
            if not len(rows) == 0:
                joinInfo = {}
                joinInfo['id'] = int(rows[0][0])
                joinInfo['role'] = int(rows[0][1])
                joinInfo['name'] = rows[0][2]
                joinInfo['service'] = rows[0][3]
                result['group'] = joinInfo
                return render_template('editorjs.html', pid = pid, project = json.dumps(result))
    else:
        return redirect(url_for('login_view'))
    return render_template('request_deny.html')

@app.route('/workbenchjs/<id>')
def workbenchjs(id=None):
    if 'user' in session:
        return render_template('workbenchjs.html', id=id, loggedin = True, username = session['user']['uname'])
    return render_template('index.html', loggedin = False, username = '')


@app.route('/join-group', methods=['POST'])
def join_group():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = GroupService.joinGroup(session['user'], request.form['group_id'], connect)
        connect.close()
        return json.dumps(result)

@app.route('/update-role', methods=['POST'])
def update_role():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = GroupService.updateRole(session['user'], request.form['group_id'], request.form['user_id'], request.form['role'], connect)
        connect.close()
        return json.dumps(result)

@app.route('/free-register', methods=['POST'])
def register_free():
    if 'group_id' in request.form:
        return json.dumps(UserService.CreateUser(request.form['username'], request.form['password'], group_id=request.form['group_id']))
    else:
        return json.dumps(UserService.CreateUser(request.form['username'], request.form['password']))

@app.route('/register', methods=['POST'])
def register_admin():
    return json.dumps(UserService.CreateUser(request.form['username'],
                                             request.form['password'],
                                             role=1,
                                             email=request.form['email']))

@app.route('/login-to', methods=['POST'])
def login():
    user = UserService.Login(request.form['username'], request.form['password'])
    if not user == None and 'permanent' in request.form:
        session.permanent = True
    return json.dumps(user)

@app.route('/logout')
def logout():
    # remove the username from the session if its there
    session.pop('user', None)
    return redirect(url_for('index'))

@app.route('/createm', methods=['POST'])
def createm():
    if 'user' in session and 'joinInfos' in session['user']:
        gid = request.form['group_id']
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        cur = connect.cursor()
        cur.execute('SELECT group_id,role FROM JoinInfo WHERE user_id=%s AND group_id=%s;', (session['user']['id'], gid, ))
        rows = cur.fetchall()
        cur.close()
        connect.close()
        if not len(rows) == 0:
            joinInfo = {}
            joinInfo['id'] = int(rows[0][0])
            joinInfo['role'] = int(rows[0][1])
            if joinInfo['id'] == int(gid) and joinInfo['role'] == 1:
                project = MetaModelService.createMetaModel(session['user'], request.form['name'], request.form['xml'], request.form['visibillity'], joinInfo)
                return json.dumps(project)
    return 'false'

@app.route('/createp', methods=['POST'])
def createp():
    if 'user' in session:
        gid = int(request.form['group_id'])
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        cur = connect.cursor()
        cur.execute('SELECT group_id,role FROM JoinInfo WHERE user_id=%s AND group_id=%s;', (session['user']['id'], gid, ))
        rows = cur.fetchall()
        cur.close()
        connect.close()
        if not len(rows) == 0:
            joinInfo = {}
            joinInfo['id'] = int(rows[0][0])
            joinInfo['role'] = int(rows[0][1])
            project = ProjectService.createProject(session['user'], request.form['name'], request.form['xml'], request.form['metamodel_id'], joinInfo)
            return json.dumps(project)
    return 'false'

@app.route('/deletep', methods=['POST'])
def deletep():
    if 'user' in session:
        result = ProjectService.deleteProject(session['user'], request.form['pid'])
        return json.dumps(result)
    else:
        return 'false'

@app.route('/deletem', methods=['POST'])
def deletem():
    if 'user' in session:
        result = MetaModelService.deleteMetaModel(session['user'], request.form['id'])
        return json.dumps(result)
    else:
        return 'false'

@app.route('/pload', methods=['POST'])
def pload():
    if 'user' in session:
        result = ProjectService.loadProject(session['user'], request.form['pid'])
        for joinInfo in session['user']['joinInfos']:
            if joinInfo['id'] == result['group_id']:
                result['group'] = joinInfo
                return json.dumps(result)
    return 'false'

@app.route('/psave', methods=['POST'])
def psave():
    return json.dumps(ProjectService.saveProject(session['user'], request.form['pid'], request.form['xml']))

@app.route('/mload', methods=['POST'])
def mload():
    project = MetaModelService.loadMetaModel(session['user'], request.form['id'])
    return json.dumps(project)


@app.route('/metamodel-save', methods=['POST'])
def metamodel_save():
    if not 'user' in session:
        return 'false'
    if not 'id' in request.form:
        return 'false'
    id = request.form['id']
    if 'name' in request.form and 'xml' in request.form and 'visibillity' in request.form:
        return json.dumps(MetaModelService.saveAll(session['user'],
                                                   request.form['id'],
                                                   request.form['name'],
                                                   request.form['xml'],
                                                   request.form['visibillity']))
    if 'name' in request.form:
        pass
    if 'xml' in request.form:
        pass
    if 'visibillity' in request.form:
        pass
    return 'false'
    

@app.route('/msave', methods=['POST'])
def msave():
    return json.dumps(MetaModelService.saveMetaModel(session['user'], request.form['id'], request.form['xml']))

@app.route('/tcsave', methods=['POST'])
def tcsave():
    return json.dumps(MetaModelService.saveTempConfig(session['user'], request.form['id'], request.form['tc']))


@app.route('/gen', methods=['POST'])
def gen():
    if 'user' in session:
        generator = ModelCompiler.BaseGenerator()
        mes = generator.GenerateCode(session['user'], int(request.form['pid']));
        return json.dumps(mes)
    else:
        return 'false'

@app.route('/download/<pid>', methods=['GET'])
def download(pid):
    if 'user' in session:
        user = session['user']
        project_id = pid;
        userpath = config.CLOOCA_CGI+'/out/' + user['uname']
        projectpath = userpath + '/p' + project_id
        filepath = projectpath + '/p' + project_id + '.zip'
        if os.path.exists(projectpath) == True:
            if os.path.exists(filepath) == True:
                os.remove(filepath)
            zip = zipfile.ZipFile(filepath, 'w', zipfile.ZIP_DEFLATED)
            filelist=os.listdir(projectpath)
            for n in range(len(filelist)):
                if not filelist[n].encode('ascii') == 'p' + project_id+'.zip':
                    zip.write(projectpath + '/' + filelist[n].encode('ascii'), filelist[n].encode('ascii'))
            zip.close()
            f = open(filepath, 'rb')
            content = f.read()
            os.remove(filepath)
            resp = make_response(content)
            resp.headers['Content-type'] = 'application/octet-stream;'
            resp.headers['Content-Disposition'] = 'attachment; filename=p'+project_id+'.zip;'
            return resp


@app.route('/update-group', methods=['POST'])
def update_group():
    if 'user' in session:
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        result = GroupService.updateGroup(session['user'], request.form['group_id'], request.form['name'].encode('utf-8'), request.form['detail'].encode('utf-8'), request.form['visibillity'], connect)
        connect.close()
        return json.dumps(result)

@app.route('/compile_server/reserve', methods=['POST'])
def compile_server_reserve():
    if 'user' in session:
        return json.dumps(compile_server.reserve(session['user'], request.form['pid'], request.form['pname']))
        
'''
template
'''
@app.route('/template/tree', methods=['POST'])
def temp_tree():
    if 'user' in session:
        result = FileService.GetFileTree(session['user'], request.form['id'])
        return json.dumps(result)

@app.route('/template/new', methods=['POST'])
def temp_new():
    if 'user' in session:
        result = FileService.CreateNewFile(session['user'], request.form['id'], request.form['fname'])
        return json.dumps(result)

@app.route('/template/save', methods=['POST'])
def temp_save():
    if 'user' in session:
        result = FileService.SaveFile(session['user'], request.form['id'], request.form['fname'], request.form['content'])
        return json.dumps(result)

'''
mvcs
'''
@app.route('/mvcs/commit', methods=['POST'])
def commit():
    if 'user' in session:
        resp = mvcs.commit(session['user'], pid=request.form['pid'])
        return json.dumps(resp)

@app.route('/mvcs/update', methods=['POST'])
def update():
    if 'user' in session:
        resp = mvcs.update(session['user'], pid=request.form['pid'])
        return json.dumps(resp)

@app.route('/mvcs/update_to_version', methods=['POST'])
def update_to_version():
    if 'user' in session:
        resp = mvcs.update_to_version(session['user'], pid=request.form['pid'], version=request.form['version'])
        return json.dumps(resp)

@app.route('/mvcs/checkout', methods=['POST'])
def checkout():
    if 'user' in session:
        resp = mvcs.checkout(session['user'], pid=request.form['pid'], rep_id=request.form['rep_id'])
        return json.dumps(resp)

@app.route('/mvcs/import', methods=['POST'])
def mvcs_import():
    if 'user' in session:
        resp = mvcs.import_to_rep(session['user'], pid=request.form['pid'], rep_id=request.form['rep_id'])
        return json.dumps(resp)

@app.route('/mvcs/export', methods=['POST'])
def mvcs_export():
    if 'user' in session:
        resp = mvcs.export_from_rep(session['user'], pid=request.form['pid'], rep_id=request.form['rep_id'])
        return json.dumps(resp)

@app.route('/mvcs/create_rep', methods=['POST'])
def create_rep():
    if 'user' in session:
        resp = mvcs.create_rep(session['user'], request.form['name'])
        return json.dumps(resp)

@app.route('/mvcs/clear_rep', methods=['POST'])
def clear_rep():
    if 'user' in session:
        resp = mvcs.clear_rep(session['user'], rep_id=request.form['rep_id'])
        return json.dumps(resp)

@app.route('/mvcs/delete_rep', methods=['POST'])
def delete_rep():
    if 'user' in session:
        resp = mvcs.delete_rep(session['user'], rep_id=request.form['rep_id'])
        return json.dumps(resp)

@app.route('/mvcs/rep_list', methods=['POST'])
def rep_list():
    if 'user' in session:
        resp = mvcs.rep_list(session['user'])
        return json.dumps(resp)

@app.route('/mvcs/user_rep_list', methods=['POST'])
def user_rep_list():
    if 'user' in session:
        resp = mvcs.user_rep_list(session['user'])
        return json.dumps(resp)

@app.route('/mvcs/group_rep_list', methods=['POST'])
def group_rep_list():
    if 'user' in session:
        resp = mvcs.group_rep_list(session['user'])
        return json.dumps(resp)

@app.route('/mvcs/gethistory', methods=['POST'])
def gethistory():
    if 'user' in session:
        RepositoryService.getHistory(request.form['pid'])


with app.test_request_context():
    print url_for('index')
    print url_for('static', filename='index.html')

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