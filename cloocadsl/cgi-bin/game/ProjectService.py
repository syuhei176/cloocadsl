# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import re
import sys
import datetime
import json
from xml.etree.ElementTree import *
sys.path.append('../')
#from config import *
import config
import ModelCompiler

"""
グローバル変数
"""
reg_username = re.compile('\w+')
connect = None
g_model_id = None




"""
プロジェクトを保存する
"""
def saveProject(user, pid, xml):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT xml FROM ProjectInfo WHERE id=%s AND user_id=%s',(pid, user['id'], ))
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        connect.close()
        return None
    result_json = xml
    updated = False
    affect_row_count = cur.execute('UPDATE ProjectInfo SET xml=%s WHERE user_id=%s AND id = %s;',(result_json.encode('utf_8'), user['id'], pid, ))
    connect.commit()
    cur.close()
    genTactics(connect, user, pid)
    connect.close()
    return {'updated':updated,'xml':result_json}

def genTactics(connect, user, id):
    cur = connect.cursor()
    cur.execute('SELECT id,user_id,game_type,name,level,exp,hp,atk,tactics,project_id FROM CharacterInfo WHERE id=%s AND user_id=%s;',(id, user['id'], ))
    rows = cur.fetchall()
    cur.close()
    if len(rows) == 0:
        return None
    chara_id = rows[0][0]
    project_id = rows[0][9]
    generator = ModelCompiler.BaseGenerator()
    data1 = generator.GenerateCode(user, chara_id, 'game')
    #outpath = config.CLOOCA_CGI + '/out/' + user['uname'] + '/p' + str(chara_id) + '/state.json'
    #f = open(outpath)
    #data1 = f.read()
    #f.close()
    cur = connect.cursor()
    affected_rows = cur.execute('UPDATE CharacterInfo SET tactics=%s WHERE id=%s AND user_id=%s;', (data1, chara_id, user['id'], ))
    connect.commit()
    cur.close()
    return data1

def check(user, pid):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT * FROM hasProject WHERE user_id=%s AND project_id=%s;',(user['id'], pid, ))
    has_rows = cur.fetchall()
    cur.close()
    if len(has_rows) == 0:
        connect.close()
        return False
    connect.close()
    return True

"""
プロジェクトをロードする
"""
def loadProject(connect, user, pid):
    cur = connect.cursor()
    cur.execute('SELECT id,name,xml,metamodel_id FROM ProjectInfo WHERE id=%s AND user_id=%s;',(pid, user['id'], ))
    rows = cur.fetchall()
    cur.close()
    if len(rows) == 0:
        return None
    project = {}
    project['id'] = rows[0][0]
    project['name'] = rows[0][1].decode('utf-8')
    project['xml'] = rows[0][2].decode('utf-8')
    project['metamodel_id'] = rows[0][3]
    cur = connect.cursor()
    cur.execute('SELECT id,name,xml,config,visibillity,welcome_message FROM MetaModelInfo WHERE id=%s;',(project['metamodel_id'], ))
    rows = cur.fetchall()
    cur.close()
    metamodel = {}
    metamodel['id'] = rows[0][0]
    metamodel['name'] = rows[0][1].decode('utf-8')
    metamodel['xml'] = rows[0][2].decode('utf-8')
    metamodel['config'] = rows[0][3]
    metamodel['visibillity'] = rows[0][4]
    metamodel['welcome_message'] = rows[0][5].decode('utf-8')
    project['metamodel'] = metamodel
    return project

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

def createProject(connect, id, user, name, xml, metamodel_id):
    if len(name.encode('utf_8')) >= 255:
        return None
    cur = connect.cursor()
    json_text = ''
    cur.execute('INSERT INTO ProjectInfo (id,name,xml,metamodel_id,user_id) VALUES(%s,%s,%s,%s,%s);',(id, name.encode('utf_8'), json_text, metamodel_id, user['id'], ))
    connect.commit()
    cur.close()
    project = {}
    project['id'] = id
    project['name'] = name
    project['xml'] = json_text
    project['metamodel_id'] = metamodel_id
    return project

def loadMyOwnProjectList(user, connect):
    cur = connect.cursor()
    cur.execute('SELECT ProjectInfo.id AS id,name,metamodel_id,rep_id,group_id FROM ProjectInfo INNER JOIN hasProject ON ProjectInfo.id = hasProject.project_id AND hasProject.user_id=%s AND ProjectInfo.group_id=0;',(user['id'], ))
    rows = cur.fetchall()
    cur.close()
    projects = []
    for i in range(len(rows)):
        project = {}
        project['id'] = rows[i][0]
        project['name'] = rows[i][1]
        project['meta_id'] = rows[i][2]
#        project['tool_id'] = rows[i][2]
#        project['tool_name'] = rows[i][2]
        projects.append(project)
    return projects

def loadMyProjectList(connect, user, group_id):
    cur = connect.cursor()
    cur.execute('SELECT ProjectInfo.id AS id,hasProject.project_id AS id2,name,metamodel_id,rep_id,group_id FROM ProjectInfo INNER JOIN hasProject ON ProjectInfo.id = hasProject.project_id AND hasProject.user_id=%s AND ProjectInfo.group_id=%s;',(user['id'], group_id, ))
    rows = cur.fetchall()
    projects = []
    cur.close()
    for i in range(len(rows)):
        project = {}
        project['id'] = rows[i][0]
        project['name'] = rows[i][2]
        project['meta_id'] = rows[i][3]
        projects.append(project)
    return projects

def loadLessonProjectList(user, metamodel_id):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT id,name,xml FROM ProjectInfo WHERE metamodel_id=%s;',(metamodel_id, ))
    rows = cur.fetchall()
    projects = []
    cur.close()
    connect.close()
    for i in range(len(rows)):
        project = {}
        project['id'] = rows[i][0]
        project['name'] = rows[i][1]
        project['xml'] = rows[i][2]
        projects.append(project)
    return projects

'''
merge
model1:new
model2:old
'''
def merge(model1, model2):
    global g_model1
    global g_model2
    g_model1 = model1
    g_model2 = model2
    g_model1['root'] = g_model2['root']
    for key in model2['diagrams']:
        if model1['diagrams'].has_key(str(key)):
            merge_diagram(model1['diagrams'][key], model2['diagrams'][key])
        else:
            if model2['diagrams'][key]['ve']['ver_type'] == 'add':
                model1['diagrams'][key] = model2['diagrams'][key]
    for key in model2['objects']:
        if model1['objects'].has_key(key):
            merge_object(model1['objects'][key], model2['objects'][key])
        else:
            if model2['objects'][key]['ve']['ver_type'] == 'add':
                model1['objects'][key] = model2['objects'][key]
    for key in model2['relationships']:
        if model1['relationships'].has_key(key):
            merge_relationship(model1['relationships'][key], model2['relationships'][key])
        else:
            if model2['relationships'][key]['ve']['ver_type'] == 'add':
                model1['relationships'][key] = model2['relationships'][key]
    for key in model2['properties']:
        if model1['properties'].has_key(key):
            pass    #conflict
        else:
            if model2['properties'][key]['ve']['ver_type'] == 'add':
                model1['properties'][key] = model2['properties'][key]
    checkmodel(model1)
    return model1

def merge_diagram(diagram1, diagram2):
    for obj_id in diagram2['objects']:
        if not obj_id in diagram1['objects'] and g_model2['objects'][str(obj_id)]['ve']['ver_type'] == 'add':
            diagram1['objects'].append(obj_id)
            diagram1['ve']['ver_type'] = 'update'
    for rel_id in diagram2['relationships']:
        if not rel_id in diagram1['relationships'] and g_model2['relationships'][str(rel_id)]['ve']['ver_type'] == 'add':
            diagram1['relationships'].append(rel_id)
            diagram1['ve']['ver_type'] = 'update'

def merge_object(object1, object2):
    for plist2 in object2['properties']:
        plist = None
        for plist1 in object1['properties']:
            if plist1['meta_id'] == plist2['meta_id']:
                plist = plist1
        if not plist == None:
            merge_plist(plist, plist2, object1)
        else:
            object1['properties'].append(plist2)
#            object1['ve']['ver_type'] = 'update'

def merge_relationship(object1, object2):
    for plist2 in object2['properties']:
        plist = None
        for plist1 in object1['properties']:
            if plist1['meta_id'] == plist2['meta_id']:
                plist = plist1
        if not plist == None:
            merge_plist(plist, plist2, object1)
        else:
            object1['properties'].append(plist2)
            object1['ve']['ver_type'] = 'update'


def merge_plist(plist1, plist2, obj1):
    for prop_id in plist2['children']:
        if not prop_id in plist1['children'] and g_model2['properties'][str(prop_id)]['ve']['ver_type'] == 'add':
            plist1['children'].append(prop_id)
            obj1['ve']['ver_type'] = 'update'
            
            
def checkmodel(model):
    for key in model['diagrams']:
        d = model['diagrams'][key]
        for i in d['objects']:
            if not model['objects'].has_key(str(i)):
                d['objects'].remove(i)
        for i in d['relationships']:
            if not model['relationships'].has_key(str(i)):
                d['relationships'].remove(i)
    for key in model['objects']:
        obj = model['objects'][key]
        for i in obj['properties']:
            for j in i['children']:
                if not model['properties'].has_key(str(j)):
                    i['children'].remove(j)
    for key in model['relationships']:
        obj = model['relationships'][key]
        for i in obj['properties']:
            for j in i['children']:
                if not model['properties'].has_key(str(j)):
                    i['children'].remove(j)
