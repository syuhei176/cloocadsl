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

reg_username = re.compile('\w+')
connect = None
g_model_id = None

def saveMetaModel(pid, xml):
    connect = MySQLdb.connect(db=config.DB2_NAME, host=config.DB2_HOST, port=config.DB2_PORT, user=config.DB2_USER, passwd=config.DB2_PASSWD)
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE MetaModelInfo SET xml=%s WHERE id = %s;',(xml, pid, ))
    connect.commit()
    cur.close()
    connect.close()
    return True

def loadMetaModel(pid):
    connect = MySQLdb.connect(db=config.DB2_NAME, host=config.DB2_HOST, port=config.DB2_PORT, user=config.DB2_USER, passwd=config.DB2_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT id,name,xml,template FROM MetaModelInfo WHERE id=%s;',(pid, ))
    rows = cur.fetchall()
    cur.close()
    project = {}
    project['id'] = rows[0][0]
    project['name'] = rows[0][1]
    project['xml'] = rows[0][2]
    project['template'] = rows[0][3]
    connect.close()
    return project

def createMetaModel(name, xml, visibillity):
    connect = MySQLdb.connect(db=config.DB2_NAME, host=config.DB2_HOST, port=config.DB2_PORT, user=config.DB2_USER, passwd=config.DB2_PASSWD)
    cur = connect.cursor()
    cur.execute('INSERT INTO MetaModelInfo (name,xml,visibillity) VALUES(%s,%s,%s);',(name, xml, visibillity, ))
    connect.commit()
    id = cur.lastrowid
    cur.close()
    connect.close()
    project = {}
    project['id'] = id
    project['name'] = name
    project['xml'] = xml
    project['visibillity'] = visibillity
    return True

def loadMyMetaModelList(user):
    connect = MySQLdb.connect(db=config.DB2_NAME, host=config.DB2_HOST, port=config.DB2_PORT, user=config.DB2_USER, passwd=config.DB2_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT metamodel_id FROM hasMetaModel WHERE user_id=%s;',(user['id'], ))
    rows = cur.fetchall()
    metamodels = []
    for i in range(len(rows)):
        cur.close()
        cur = connect.cursor()
        cur.execute('SELECT id,name,xml,visibillity FROM MetaModelInfo WHERE id=%s;',(rows[i][0], ))
        metamodel_rows = cur.fetchall()
        metamodel = {}
        metamodel['id'] = metamodel_rows[0][0]
        metamodel['name'] = metamodel_rows[0][1]
#        metamodel['xml'] = metamodel_rows[0][2]
        metamodel['visibillity'] = metamodel_rows[0][3]
        metamodels.append(metamodel)
        cur.close()
    connect.close()
    return metamodels

def loadMetaModelList(pid):
    connect = MySQLdb.connect(db=config.DB2_NAME, host=config.DB2_HOST, port=config.DB2_PORT, user=config.DB2_USER, passwd=config.DB2_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT id,name,xml FROM MetaModelInfo WHERE visibillity=%s;',(1, ))
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