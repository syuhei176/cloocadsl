# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import re
import sys
import datetime
import config as config
from flask import session
from core.util import Util
import ModelCompiler
import ProjectService

reg_username = re.compile('\w+')

def getCharacters(connect, user):
    cur = connect.cursor()
    cur.execute('SELECT CharacterInfo.id,user_id,game_type,name,level,exp,hp,atk,tactics,project_id,UserInfo.username FROM CharacterInfo INNER JOIN UserInfo ON CharacterInfo.user_id = UserInfo.id',())
    rows = cur.fetchall()
    characters = []
    cur.close()
    for i in range(len(rows)):
        character = {}
        character['id'] = int(rows[i][0])
        character['user_id'] = rows[i][1]
        character['game_type'] = rows[i][2]
        character['name'] = rows[i][3]
        character['level'] = int(rows[i][4])
        character['exp'] = int(rows[i][5])
        character['hp'] = int(rows[i][6])
        character['atk'] = int(rows[i][7])
        character['tactics'] = rows[i][8]
        character['project_id'] = int(rows[i][9])
        character['owner_name'] = rows[i][10]
        characters.append(character)
    return characters

def getMyCharacters(connect, user):
    cur = connect.cursor()
    cur.execute('SELECT id,user_id,game_type,name,level,exp,hp,atk,tactics,project_id FROM CharacterInfo WHERE user_id=%s;',(user['id'], ))
    rows = cur.fetchall()
    characters = []
    cur.close()
    for i in range(len(rows)):
        character = {}
        character['id'] = int(rows[i][0])
        character['user_id'] = rows[i][1]
        character['game_type'] = rows[i][2]
        character['name'] = rows[i][3]
        character['level'] = int(rows[i][4])
        character['exp'] = int(rows[i][5])
        character['hp'] = int(rows[i][6])
        character['atk'] = int(rows[i][7])
        character['tactics'] = rows[i][8]
        character['project_id'] = int(rows[i][9])
        characters.append(character)
    return characters

def createCharacter(connect, user, name):
    if len(name.encode('utf_8')) >= 255:
        return False
    cur = connect.cursor()
    cur.execute('INSERT INTO CharacterInfo (name,user_id) VALUES(%s,%s);',(name.encode('utf_8'), user['id'], ))
    connect.commit()
    id = cur.lastrowid
    cur.close()
    proj = ProjectService.createProject(connect, id, user, name, '', 1) #use API
    return True

def getMyResults(connect, user):
    cur = connect.cursor()
    cur.execute('SELECT user_id,game_type,points,result FROM ResultSummary WHERE user_id = %s;', (user['id'], ))
    rows = cur.fetchall()
    results = []
    cur.close()
    for i in range(len(rows)):
        result = {}
        result['user_id'] = int(rows[0][0])
        result['game_type'] = rows[0][1]
        result['point'] = int(rows[0][2])
        result['result'] = rows[0][3]
        results.append(result)
    return results

def insertBattleResult(connect, game_type, user, counter_user, result):
    cur = connect.cursor()
    cur.execute('SELECT cnt FROM ResultInfo WHERE user_id1 = %s AND user_id2 = %s AND game_type=%s ORDER BY cnt DESC LIMIT 1;', (user['id'], counter_user, game_type))
    rows = cur.fetchall()
    cnt = 0
    if len(rows) == 0:
        cnt = 1
    else:
        cnt = rows[0][0]
    cur.execute('INSERT INTO ResultInfo (cnt,user_id1,user_id2,game_type,result) VALUES(%s,%s,%s,%s,%s);',(cnt, user['id'], counter_user, game_type, result))
    connect.commit()
    cur.close()
    return cnt

def updateResult(connect, user, result):
    cur = connect.cursor()
    cur.execute('INSERT INTO ResultSummary (name,user_id) VALUES(%s,%s);',(name.encode('utf_8'), user['id'], ))
    affect_row_count = cur.execute('UPDATE ResultSummary SET result=%s WHERE user_id=%s AND id = %s;',(result_json.encode('utf_8'), user['id'], pid, ))
    cur.close()

def getMyProjects(connect, user, space_key):
    cur = connect.cursor()
    cur.execute('SELECT ProjectInfo.id AS id,name,metamodel_id,rep_id,space_key FROM ProjectInfo INNER JOIN hasProject ON ProjectInfo.id = hasProject.project_id AND hasProject.user_id=%s AND ProjectInfo.space_key=%s;',(user['id'], space_key, ))
    rows = cur.fetchall()
    projects = []
    cur.close()
    for i in range(len(rows)):
        project = {}
        project['id'] = rows[i][0]
        project['name'] = rows[i][1]
        project['meta_id'] = rows[i][2]
        projects.append(project)
    return projects

def getGroupTools(connect, user, space_key):
    cur = connect.cursor()
    cur.execute('SELECT MetaModelInfo.id AS id,name,xml,visibillity,space_key FROM MetaModelInfo WHERE MetaModelInfo.space_key=%s AND MetaModelInfo.visibillity=1',(space_key, ))
    rows = cur.fetchall()
    cur.close()
    metamodels = []
    for i in range(len(rows)):
        metamodel = {}
        metamodel['id'] = rows[i][0]
        metamodel['name'] = (rows[i][1]).decode('utf-8')
        metamodel['visibillity'] = rows[i][3]
        metamodels.append(metamodel)
    return metamodels

def getMyTools(connect, user, space_key):
    cur = connect.cursor()
    cur.execute('SELECT MetaModelInfo.id AS id,name,xml,visibillity,space_key FROM MetaModelInfo INNER JOIN hasMetaModel ON MetaModelInfo.id = hasMetaModel.metamodel_id AND hasMetaModel.user_id=%s AND MetaModelInfo.space_key=%s;',(user['id'], space_key, ))
    rows = cur.fetchall()
    cur.close()
    metamodels = []
    for i in range(len(rows)):
        metamodel = {}
        metamodel['id'] = rows[i][0]
        metamodel['name'] = (rows[i][1]).decode('utf-8')
        metamodel['visibillity'] = rows[i][3]
        metamodels.append(metamodel)
    return metamodels

def deleteProject(user, pid):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT * FROM hasProject WHERE user_id=%s AND project_id=%s;',(user['id'], pid, ))
    has_rows = cur.fetchall()
    cur.close()
    if len(has_rows) == 0:
        connect.close()
        return False
    cur = connect.cursor()
    cur.execute('DELETE FROM hasProject WHERE user_id=%s AND project_id=%s;',(user['id'], pid, ))
    cur.execute('DELETE FROM ProjectInfo WHERE id=%s;',(pid, ))
    connect.commit()
    cur.close()
    connect.close()
    return True

def deleteMetaModel(user, id):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT * FROM hasMetaModel WHERE user_id=%s AND metamodel_id=%s;',(user['id'], id, ))
    has_rows = cur.fetchall()
    cur.close()
    if len(has_rows) == 0:
        connect.close()
        return False
    cur = connect.cursor()
    cur.execute('DELETE FROM hasMetaModel WHERE user_id=%s AND metamodel_id=%s;',(user['id'], id, ))
    cur.execute('DELETE FROM MetaModelInfo WHERE id=%s;',(id, ))
    connect.commit()
    cur.close()
    connect.close()
    return True


wb_config = '{"targets":[],"editor":{"generatable":true,"downloadable":true}}'

def createMetaModel(user, name, xml, visibillity, space_key):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('INSERT INTO MetaModelInfo (name,xml,visibillity,space_key,sample,config) VALUES(%s,%s,%s,%s,%s,%s);',(name.encode('utf_8'), xml, visibillity, space_key, '', wb_config))
    connect.commit()
    id = cur.lastrowid
    cur.close()
    cur = connect.cursor()
    cur.execute('INSERT INTO hasMetaModel (user_id,metamodel_id) VALUES(%s,%s);',(user['id'], id, ))
    connect.commit()
    cur.close()
    connect.close()
    project = {}
    project['id'] = id
    project['name'] = name
    project['xml'] = xml
    project['visibillity'] = visibillity
    project['space_key'] = space_key

def updateMetaModel(connect, user, metamodel_id, name, visibillity, space_key):
    cur = connect.cursor()
    affected_rows = cur.execute('UPDATE MetaModelInfo SET  name=%s,visibillity=%s WHERE id=%s;', (name, visibillity, metamodel_id, ))
    connect.commit()
    cur.close()
    if affected_rows == 1:
        return True
    return False


"""
manage member
"""
def getGroupMember(connect, user, space_key, type):
    cur = connect.cursor()
    if type == 0:
        cur.execute('SELECT id,username,role FROM UserInfo WHERE space_key=%s;',(space_key, ))
    elif type == 1:
        cur.execute('SELECT id,username,role FROM UserInfo WHERE role=%s AND space_key=%s;',(0, space_key, ))
    elif type == 2:
        cur.execute('SELECT id,username,role FROM UserInfo WHERE role=%s AND space_key=%s;',(1, space_key, ))
    elif type == 3:
        cur.execute('SELECT id,username,role FROM UserInfo WHERE role=%s AND space_key=%s;',(2, space_key, ))
    else:
        cur.execute('SELECT id,username,role FROM UserInfo WHERE space_key=%s;',(space_key, ))
    rows = cur.fetchall()
    cur.close()
    members = []
    for i in range(len(rows)):
        member = {}
        member['id'] = int(rows[i][0])
        member['username'] = rows[i][1]
        member['role'] = rows[i][2]
        members.append(member)
    return members

def addUser(connect, user, space_key, username, password):
    d = datetime.datetime.today()
    if not reg_username.match(username):
        return False
    if len(password) < 5:
        return False
    cur = connect.cursor()
    cur.execute('SELECT username FROM UserInfo WHERE username = %s AND space_key=%s;', (username, space_key, ))
    rows = cur.fetchall()
    if not len(rows) == 0:
        cur.close()
        return False
    cur.execute('INSERT INTO UserInfo (username,password,space_key) VALUES(%s,%s,%s);',(username, md5.new(password+'t').hexdigest(), space_key, ))
    user_id = cur.lastrowid
    connect.commit()
    cur.close()
    return True

def addUsers(connect, user, space_key, members_text):
    members = json.loads(members_text)
    for member in members:
        addUser(connect, user, space_key, member['username'], member['password'])

def updateUser(connect, user, space_key, user_id, new_role):
    cur = connect.cursor()
    affected_rows = cur.execute('UPDATE UserInfo SET role=%s WHERE id=%s;', (new_role, user_id))
    connect.commit()
    cur.close()
    if affected_rows == 1:
        return True
    return False

def updateGroup(connect, user, space_key, name):
    cur = connect.cursor()
    affected_rows = cur.execute('UPDATE SpaceInfo SET name=%s WHERE space_key=%s;', (name.encode('utf-8'), space_key))
    connect.commit()
    cur.close()
    if affected_rows == 1:
        return True
    return False

def publish(connect, user, id, space_key):
    cur = connect.cursor()
    #ツールをコピーする
    #コピー先のvisibillityを1にする
    cur.execute('SELECT id,name,xml,config,visibillity,welcome_message,space_key,sample,version FROM MetaModelInfo WHERE id=%s;',(id, ))
    rows = cur.fetchall()
    src_version = int(rows[0][8])
    cur.execute('INSERT INTO MetaModelInfo (name,xml,config,visibillity,welcome_message,space_key,sample) VALUES(%s,%s,%s,%s,%s,%s,%s);',(rows[0][1],rows[0][2],rows[0][3],1,rows[0][5],rows[0][6],rows[0][7]))
    dest_id = cur.lastrowid
    cur.execute('INSERT INTO hasMetaModel (user_id,metamodel_id) VALUES(%s,%s);',(user['id'], dest_id, ))
    #テンプレートのコピー
    cur.execute('SELECT name,path,content FROM Template WHERE metamodel_id=%s',(id, ))
    rows = cur.fetchall()
    for i in range(len(rows)):
        cur.execute('INSERT INTO Template (name,path,content,metamodel_id) VALUES(%s,%s,%s,%s);',(rows[i][0], rows[i][1], rows[i][2], dest_id, ))
    #コピー元のバージョンを１つあげる
    affected_rows = cur.execute('UPDATE MetaModelInfo SET version=%s WHERE id=%s;', (str(src_version+1), id))
    if user['group']['plan'] == 'free':
        #コピー先にサンプルタグを付ける
        cur.execute('INSERT INTO metamodel_tag (metamodel_id, tag) VALUES(%s,%s);',(dest_id, 'sample'))
    connect.commit()
    cur.close()
    return True

def import_from_sample_tool(connect, user, sample_id, space_key):
    cur = connect.cursor()
    #ツールをコピーする
    #コピー先のvisibillityを1にする
    cur.execute('SELECT id,name,xml,config,visibillity,welcome_message,space_key,sample,version FROM MetaModelInfo WHERE id=%s;',(sample_id, ))
    rows = cur.fetchall()
    src_version = int(rows[0][8])
    cur.execute('INSERT INTO MetaModelInfo (name,xml,config,visibillity,welcome_message,space_key,sample) VALUES(%s,%s,%s,%s,%s,%s,%s);',(rows[0][1],rows[0][2],rows[0][3],1,rows[0][5],rows[0][6],rows[0][7]))
    dest_id = cur.lastrowid
    cur.execute('INSERT INTO hasMetaModel (user_id,metamodel_id) VALUES(%s,%s);',(user['id'], dest_id, ))
    #テンプレートのコピー
    cur.execute('SELECT name,path,content FROM Template WHERE metamodel_id=%s',(sample_id, ))
    rows = cur.fetchall()
    for i in range(len(rows)):
        cur.execute('INSERT INTO Template (name,path,content,metamodel_id) VALUES(%s,%s,%s,%s);',(rows[i][0], rows[i][1], rows[i][2], dest_id, ))

def sample_tools(connect, user, space_key):
    cur = connect.cursor()
    cur.execute('SELECT MetaModelInfo.id AS id,name,xml,visibillity,space_key FROM MetaModelInfo INNER JOIN metamodel_tag ON MetaModelInfo.id = metamodel_tag.metamodel_id AND metamodel_tag.tag=%s;',('sample', ))
    rows = cur.fetchall()
    cur.close()
    metamodels = []
    for i in range(len(rows)):
        metamodel = {}
        metamodel['id'] = rows[i][0]
        metamodel['name'] = rows[i][1].decode('utf-8')
        metamodel['visibillity'] = rows[i][3]
        metamodels.append(metamodel)
    return metamodels
