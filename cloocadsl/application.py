# coding: utf-8
"""
run
auto create table
deploy
"""

from flask import Flask, url_for, render_template, session, request, make_response
import sys
import json
sys.path.append('cgi-bin/')
from core import UserService
from core import MetaModelService
from core import ProjectService
from core import ModelCompiler
from core import FileService
from mvcs import CommitService

app = Flask(__name__)

@app.route('/index')
def index():
    if 'user' in session:
        return render_template('index.html', loggedin = True, username = session['user']['uname'])
    return render_template('index.html', loggedin = False, username = '')

@app.route('/dashboard')
@app.route('/dashboard/<name>')
def dashboard(name=None):
    if 'user' in session:
        return render_template('dashboard.html',
                               loggedin = True,
                               username = session['user']['uname'],
                               mymetamodel = json.dumps(MetaModelService.loadMyMetaModelList(session['user'])),
                               myproject = json.dumps(ProjectService.loadMyProjectList(session['user'])),
                               metamodel = json.dumps(MetaModelService.loadMetaModelList())
                               )
    return render_template('dashboard.html', loggedin = False, username = '')

@app.route('/editor')
def editor():
    if 'user' in session:
        return render_template('editor.html', loggedin = True, username = session['user']['uname'])
    return render_template('index.html', loggedin = False, username = '')

@app.route('/editorjs')
def editorjs():
    if 'user' in session:
        return render_template('editorjs.html', loggedin = True, username = session['user']['uname'])
    return render_template('index.html', loggedin = False, username = '')

@app.route('/workbench')
def workbench():
    if 'user' in session:
        return render_template('workbench.html', loggedin = True, username = session['user']['uname'])
    return render_template('index.html', loggedin = False, username = '')

@app.route('/register', methods=['POST'])
def register():
    return json.dumps(UserService.CreateUser(request.form['username'], request.form['password']))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = UserService.Login(request.form['username'], request.form['password'])
#        resp = make_response(json.dumps(user), '200')
#        resp.headers['Content-type'] = 'text/javascript'
        return json.dumps(user)

@app.route('/logout')
def logout():
    # remove the username from the session if its there
    session.pop('user', None)
    return redirect(url_for('index'))

@app.route('/createm', methods=['POST'])
def createm():
    project = MetaModelService.createMetaModel(session['user'], request.form['name'], request.form['xml'], request.form['visibillity'])
    return json.dumps(project)

@app.route('/createp', methods=['POST'])
def createp():
    project = ProjectService.createProject(session['user'], request.form['name'], request.form['xml'], request.form['metamodel_id'])
    return json.dumps(project)

@app.route('/deletep', methods=['POST'])
def deletep():
    if 'user' in session:
        result = deleteProject(session['user'], request.form['pid'])
        return json.dumps(result)
    else:
        return 'false'

@app.route('/pload', methods=['POST'])
def pload():
    if 'user' in session:
        result = ProjectService.loadProject(session['user'], request.form['pid'])
        return json.dumps(result)
    else:
        return 'false'

@app.route('/psave', methods=['POST'])
def psave():
    return json.dumps(ProjectService.saveProject(session['user'], request.form['pid'], request.form['xml']))

@app.route('/mload', methods=['POST'])
def mload():
    project = MetaModelService.loadMetaModel(session['user'], request.form['id'])
    return json.dumps(project)

@app.route('/msave', methods=['POST'])
def msave():
    return json.dumps(MetaModelService.saveMetaModel(session['user'], request.form['id'], request.form['xml']))

@app.route('/gen', methods=['POST'])
def gen():
    if 'user' in session:
        generator = ModelCompiler.BaseGenerator()
        generator.GenerateCode(session['user'], int(request.form['pid']));
        return 'true'
    else:
        return 'false'

@app.route('/download', methods=['GET'])
def download():
    if 'user' in session:
        project_id = request.form['pid']
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
            resp = make_response(content, '200')
            resp.headers['Content-type'] = 'application/octet-stream;'
            resp.headers['Content-Disposition'] = 'attachment; filename=p'+project_id+'.zip;'
            return resp

@app.route('/tree', methods=['POST'])
def tree():
    if 'user' in session:
        result = FileService.GetFileTree(session['user'], request.form['id'])
        return json.dumps(result)

@app.route('/create_rep', methods=['POST'])
def create_rep():
    if 'user' in session:
        pass

@app.route('/commit', methods=['POST'])
def commit():
    if 'user' in session:
        CommitService.commit(request.form['pid'])
        return ""

@app.route('/update', methods=['POST'])
def update():
    project = MetaModelService.loadMetaModel(session['user'], request.form['id'])
    return json.dumps(project)

with app.test_request_context():
    print url_for('index')
    print url_for('static', filename='index.html')

#sercret key
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
 
argvs = sys.argv  # コマンドライン引数を格納したリストの取得
argc = len(argvs) # 引数の個数

if argc == 2:
    if argvs[1] == 'run':
        app.run()
    if argvs[1] == 'sync':
        pass
    if argvs[1] == 'deploy':
        pass
else:
    pass

if __name__ == '__main__':
    app.run(debug=True)