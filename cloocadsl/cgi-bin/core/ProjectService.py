# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import re
import sys
import datetime
from xml.etree.ElementTree import *
sys.path.append('../')
#from config import *
import config

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
    cur.execute('SELECT * FROM hasProject WHERE user_id=%s AND project_id=%s;',(user['id'], pid, ))
    has_rows = cur.fetchall()
    cur.close()
    if len(has_rows) == 0:
        connect.close()
        return None
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE ProjectInfo SET xml=%s WHERE id = %s;',(xml.encode('utf_8'), pid, ))
    connect.commit()
    cur.close()
    connect.close()
    return True

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
def loadProject(user, pid, connect):
    #connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT * FROM hasProject WHERE user_id=%s AND project_id=%s;',(user['id'], pid, ))
    has_rows = cur.fetchall()
    cur.close()
    if len(has_rows) == 0:
        connect.close()
        return None
    cur = connect.cursor()
    cur.execute('SELECT id,name,xml,metamodel_id,rep_id,group_id FROM ProjectInfo WHERE id=%s;',(pid, ))
    rows = cur.fetchall()
    cur.close()
    project = {}
    project['id'] = rows[0][0]
    project['name'] = rows[0][1]
    project['xml'] = rows[0][2]
    project['metamodel_id'] = rows[0][3]
    project['rep_id'] = rows[0][4]
    project['group_id'] = rows[0][5]
    cur = connect.cursor()
    cur.execute('SELECT id,name,xml,template,visibillity,welcome_message FROM MetaModelInfo WHERE id=%s;',(project['metamodel_id'], ))
    rows = cur.fetchall()
    cur.close()
    metamodel = {}
    metamodel['id'] = rows[0][0]
    metamodel['name'] = rows[0][1]
    metamodel['xml'] = rows[0][2]
    metamodel['config'] = rows[0][3]
    metamodel['visibillity'] = rows[0][4]
    metamodel['welcome_message'] = rows[0][5].decode('utf-8')
    project['metamodel'] = metamodel
    #connect.close()
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


clean_xml = '''
<?xml version="1.0" encoding="utf-8"?><Model id="0" current_version="1"><Diagram id="1" meta_id="1"><VersionElement version="1" ver_type="add" /></Diagram></Model>
'''
clean_json = ''

def createProject(connect, user, name, xml, metamodel_id, group_id=0,_is_sample=False):
    if len(name.encode('utf_8')) >= 255:
        return False
    cur = connect.cursor()
    cur.execute('LOCK TABLES ProjectInfo WRITE,hasProject WRITE,MetaModelInfo WRITE;')
    json_text = clean_json
    if _is_sample:
        cur.execute('SELECT sample FROM MetaModelInfo WHERE id=%s;',(metamodel_id, ))
        rows = cur.fetchall()
        json_text = rows[0][0]
    cur.execute('INSERT INTO ProjectInfo (name,xml,metamodel_id,group_id) VALUES(%s,%s,%s,%s);',(name.encode('utf_8'), json_text, metamodel_id, group_id, ))
    connect.commit()
    id = cur.lastrowid
    cur.close()
    cur = connect.cursor()
    cur.execute('INSERT INTO hasProject (user_id,project_id) VALUES(%s,%s);',(user['id'], id, ))
    connect.commit()
    cur.execute('UNLOCK TABLES;')
    cur.close()
    project = {}
    project['id'] = id
    project['name'] = name
    project['xml'] = clean_json
    project['metamodel_id'] = metamodel_id
    return True


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

def loadMyProjectList(user, group_id, connect):
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
