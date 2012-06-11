# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import re
import sys
import datetime
from xml.etree.ElementTree import *
sys.path.append('../')
import config
import GroupService

reg_username = re.compile('\w+')
connect = None
g_model_id = None

def saveSample(connect, user, id, sample):
    cur = connect.cursor()
    cur.execute('SELECT * FROM hasMetaModel WHERE user_id=%s AND metamodel_id=%s;',(user['id'], id, ))
    has_rows = cur.fetchall()
    cur.close()
    if len(has_rows) == 0:
        return None
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE MetaModelInfo SET sample=%s WHERE id = %s;',(sample.encode('utf_8'), id, ))
    connect.commit()
    cur.close()
    return True

def loadSample(connect, user, id):
    cur = connect.cursor()
    cur.execute('SELECT * FROM hasMetaModel WHERE user_id=%s AND metamodel_id=%s;',(user['id'], id, ))
    has_rows = cur.fetchall()
    cur.close()
    if len(has_rows) == 0:
        return None
    cur = connect.cursor()
    cur.execute('SELECT sample FROM MetaModelInfo WHERE id=%s;',(id, ))
    rows = cur.fetchall()
    cur.close()
    if rows[0][0] == None:
        return ''
    return rows[0][0].decode('utf-8')

def saveAll(user, pid, name, xml, visibillity, welcome_message):
    if len(name.encode('utf_8')) >= 255:
        return False
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT * FROM hasMetaModel WHERE user_id=%s AND metamodel_id=%s;',(user['id'], pid, ))
    has_rows = cur.fetchall()
    cur.close()
    if len(has_rows) == 0:
        return None
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE MetaModelInfo SET name=%s,xml=%s,visibillity=%s,welcome_message=%s WHERE id = %s;',(name.encode('utf_8'), xml.encode('utf_8'), visibillity, welcome_message.encode('utf_8'), pid, ))
    connect.commit()
    cur.close()
    connect.close()
    return True

def saveMetaModel(user, pid, xml):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT * FROM hasMetaModel WHERE user_id=%s AND metamodel_id=%s;',(user['id'], pid, ))
    has_rows = cur.fetchall()
    cur.close()
    if len(has_rows) == 0:
        return None
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE MetaModelInfo SET xml=%s WHERE id = %s;',(xml.encode('utf_8'), pid, ))
    connect.commit()
    cur.close()
    connect.close()
    return True

def saveTempConfig(user, pid, tc):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT * FROM hasMetaModel WHERE user_id=%s AND metamodel_id=%s;',(user['id'], pid, ))
    has_rows = cur.fetchall()
    cur.close()
    if len(has_rows) == 0:
        return None
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE MetaModelInfo SET template=%s WHERE id = %s;',(tc, pid, ))
    connect.commit()
    cur.close()
    connect.close()
    return True

def loadMetaModel(connect, user, pid, check=True):
    #connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    if check:
        cur = connect.cursor()
        cur.execute('SELECT * FROM hasMetaModel WHERE user_id=%s AND metamodel_id=%s;',(user['id'], pid, ))
        has_rows = cur.fetchall()
        cur.close()
        if len(has_rows) == 0:
            return None
    cur = connect.cursor()
    cur.execute('SELECT id,name,xml,template,visibillity,welcome_message,targets,group_id FROM MetaModelInfo WHERE id=%s;',(pid, ))
    rows = cur.fetchall()
    cur.close()
    project = {}
    project['id'] = rows[0][0]
    project['name'] = rows[0][1].decode('utf_8')
    project['xml'] = rows[0][2].decode('utf_8')
    project['template'] = rows[0][3]
    project['visibillity'] = int(rows[0][4])
    project['welcome_message'] = rows[0][5]
    project['targets'] = rows[0][6]
    project['group_id'] = int(rows[0][7])
    #connect.close()
    return project

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

def createMetaModel(user, name, xml, visibillity, group_id=0):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('INSERT INTO MetaModelInfo (name,xml,visibillity,group_id) VALUES(%s,%s,%s,%s);',(name.encode('utf_8'), xml, visibillity, group_id, ))
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
    project['group_id'] = group_id
    return True


def loadMyOwnMetaModelList(user, connect):
    cur = connect.cursor()
    cur.execute('SELECT MetaModelInfo.id AS id,name,xml,visibillity,group_id FROM MetaModelInfo INNER JOIN hasMetaModel ON MetaModelInfo.id = hasMetaModel.metamodel_id AND hasMetaModel.user_id=%s AND MetaModelInfo.group_id=0;',(user['id'], ))
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

def loadMyAllMetaModelList(user, connect):
    cur = connect.cursor()
    cur.execute('SELECT MetaModelInfo.id AS id,name,xml,visibillity,group_id FROM MetaModelInfo INNER JOIN hasMetaModel ON MetaModelInfo.id = hasMetaModel.metamodel_id AND hasMetaModel.user_id=%s;',(user['id'], ))
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


def loadMyMetaModelList(user, group_id, connect):
    cur = connect.cursor()
    cur.execute('SELECT MetaModelInfo.id AS id,name,xml,visibillity,group_id FROM MetaModelInfo INNER JOIN hasMetaModel ON MetaModelInfo.id = hasMetaModel.metamodel_id AND hasMetaModel.user_id=%s AND MetaModelInfo.group_id=%s;',(user['id'], group_id, ))
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

def loadGroupMetaModelList(user=None, group_id=None, connect=None):
    cur = connect.cursor()
    cur.execute('SELECT id,name,visibillity FROM MetaModelInfo WHERE group_id=%s AND visibillity >= 2;',(group_id, ))
    rows = cur.fetchall()
    cur.close()
    metamodels = []
    for i in range(len(rows)):
        metamodel = {}
        metamodel['id'] = rows[i][0]
        metamodel['name'] = rows[i][1]
        metamodel['visibillity'] = rows[i][2]
        metamodels.append(metamodel)
    return metamodels

def loadMetaModelList(user=None, group_id=None, connect=None):
#    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    if group_id == None:
        cur.execute('SELECT id,name,xml FROM MetaModelInfo WHERE visibillity=1;')
    else:
        cur.execute('SELECT id,name,xml FROM MetaModelInfo WHERE group_id=%s AND (visibillity=1 OR visibillity=3);',(group_id, ))
    rows = cur.fetchall()
    cur.close()
#    connect.close()
    metamodels = []
    for i in range(len(rows)):
        metamodel = {}
        metamodel['id'] = rows[i][0]
        metamodel['name'] = rows[i][1]
        metamodels.append(metamodel)
    return metamodels

def loadMyTools(user, connect):
    cur = connect.cursor()
    cur.execute('SELECT MetaModelInfo.id AS id,name,xml FROM MetaModelInfo INNER JOIN hasTool ON MetaModelInfo.id = hasTool.tool_id AND hasTool.user_id=%s;',(user['id'], ))
    rows = cur.fetchall()
    cur.close()
    tools = []
    for i in range(len(rows)):
        metamodel = {}
        metamodel['id'] = int(rows[i][0])
        metamodel['name'] = (rows[i][1]).decode('utf-8')
        tools.append(metamodel)
    return tools
