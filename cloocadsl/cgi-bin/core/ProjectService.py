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

'''
グローバル変数
'''
reg_username = re.compile('\w+')
connect = None
g_model_id = None

'''
プロジェクトを保存する
'''
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
    affect_row_count = cur.execute('UPDATE ProjectInfo SET xml=%s WHERE id = %s;',(xml, pid, ))
    connect.commit()
    cur.close()
    connect.close()
    return True

'''
プロジェクトをロードする
'''
def loadProject(user, pid):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT * FROM hasProject WHERE user_id=%s AND project_id=%s;',(user['id'], pid, ))
    has_rows = cur.fetchall()
    cur.close()
    if len(has_rows) == 0:
        connect.close()
        return None
    cur = connect.cursor()
    cur.execute('SELECT id,name,xml,metamodel_id FROM ProjectInfo WHERE id=%s;',(pid, ))
    rows = cur.fetchall()
    cur.close()
    project = {}
    project['id'] = rows[0][0]
    project['name'] = rows[0][1]
    project['xml'] = rows[0][2]
    project['metamodel_id'] = rows[0][3]
    connect.close()
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
clean_json = '''
{"id":1,"current_version":1,"root":{"id":1,"meta_id":1,"objects":[],"relationships":[],"ve":{"version":1,"ver_type":"add"}}}
'''

def createProject(user, name, xml, metamodel_id):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('INSERT INTO ProjectInfo (name,xml,metamodel_id) VALUES(%s,%s,%s);',(name, clean_json, metamodel_id, ))
    connect.commit()
    id = cur.lastrowid
    cur.close()
    cur = connect.cursor()
    cur.execute('INSERT INTO hasProject (user_id,project_id) VALUES(%s,%s);',(user['id'], id, ))
    connect.commit()
    cur.close()
    connect.close()
    project = {}
    project['id'] = id
    project['name'] = name
    project['xml'] = clean_json
    project['metamodel_id'] = metamodel_id
    return True

def loadMyProjectList(user):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT project_id FROM hasProject WHERE user_id=%s;',(user['id'], ))
    rows = cur.fetchall()
    projects = []
    cur.close()
    for i in range(len(rows)):
        cur = connect.cursor()
        cur.execute('SELECT id,name,xml FROM ProjectInfo WHERE id=%s;',(rows[i][0], ))
        metamodel_rows = cur.fetchall()
        project = {}
        project['id'] = metamodel_rows[0][0]
        project['name'] = metamodel_rows[0][1]
#        metamodel['xml'] = metamodel_rows[0][2]
        projects.append(project)
        cur.close()
    connect.close()
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
