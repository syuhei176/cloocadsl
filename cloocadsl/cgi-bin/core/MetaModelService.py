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

reg_username = re.compile('\w+')
connect = None
g_model_id = None

def saveMetaModel(user, pid, xml):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT * FROM hasMetaModel WHERE user_id=%s AND metamodel_id=%s;',(user['id'], pid, ))
    has_rows = cur.fetchall()
    cur.close()
    if len(has_rows) == 0:
        return None
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE MetaModelInfo SET xml=%s WHERE id = %s;',(xml, pid, ))
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

def loadMetaModel(user, pid):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
#    cur = connect.cursor()
#    cur.execute('SELECT * FROM hasMetaModel WHERE user_id=%s AND metamodel_id=%s;',(user['id'], pid, ))
#    has_rows = cur.fetchall()
#    cur.close()
#    if len(has_rows) == 0:
#        return None
    cur = connect.cursor()
    cur.execute('SELECT id,name,xml,template,welcome_message FROM MetaModelInfo WHERE id=%s;',(pid, ))
    rows = cur.fetchall()
    cur.close()
    project = {}
    project['id'] = rows[0][0]
    project['name'] = rows[0][1]
    project['xml'] = rows[0][2]
    project['template'] = rows[0][3]
    project['welcome_message'] = rows[0][4]
    connect.close()
    return project

def createMetaModel(user, name, xml, visibillity, joinInfo=None):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('INSERT INTO MetaModelInfo (name,xml,visibillity,group_id) VALUES(%s,%s,%s,%s);',(name, xml, visibillity, joinInfo['id'], ))
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
    project['group_id'] = joinInfo['id']
    return True

def loadMyMetaModelList(user, joinInfo):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT MetaModelInfo.id AS id,name,xml,visibillity,group_id FROM MetaModelInfo INNER JOIN hasMetaModel ON MetaModelInfo.id = hasMetaModel.metamodel_id AND hasMetaModel.user_id=%s AND MetaModelInfo.group_id=%s;',(user['id'], joinInfo['id'], ))
    rows = cur.fetchall()
    cur.close()
    metamodels = []
    for i in range(len(rows)):
        metamodel = {}
        metamodel['id'] = rows[i][0]
        metamodel['name'] = rows[i][1]
#        metamodel['xml'] = metamodel_rows[0][2]
        metamodel['visibillity'] = rows[i][3]
        metamodels.append(metamodel)
    connect.close()
    return metamodels

def loadMetaModelList(user=None, group=None):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    if group == None:
        cur.execute('SELECT id,name,xml FROM MetaModelInfo WHERE visibillity=%s;',(1, ))
    else:
        cur.execute('SELECT id,name,xml FROM MetaModelInfo WHERE group_id=%s AND visibillity=%s;',(group['id'], 1, ))
    rows = cur.fetchall()
    cur.close()
    connect.close()
    metamodels = []
    for i in range(len(rows)):
        metamodel = {}
        metamodel['id'] = rows[i][0]
        metamodel['name'] = rows[i][1]
        metamodels.append(metamodel)
    return metamodels
