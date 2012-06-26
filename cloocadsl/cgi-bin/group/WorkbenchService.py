# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import re
import sys
import datetime
import config
from flask import session
from core import GroupService
from core.util import Gmail
from core.util import Util

def loadMetaModel(connect, user, pid):
    cur = connect.cursor()
    cur.execute('SELECT * FROM hasMetaModel WHERE user_id=%s AND metamodel_id=%s;',(user['id'], pid, ))
    has_rows = cur.fetchall()
    cur.close()
    if len(has_rows) == 0:
        return None
    cur = connect.cursor()
    cur.execute('SELECT id,name,xml,config,visibillity,welcome_message,space_key FROM MetaModelInfo WHERE id=%s;',(pid, ))
    rows = cur.fetchall()
    cur.close()
    project = {}
    project['id'] = rows[0][0]
    project['name'] = rows[0][1].decode('utf_8')
    project['xml'] = rows[0][2].decode('utf_8')
    project['config'] = rows[0][3]
    project['visibillity'] = int(rows[0][4])
    project['welcome_message'] = rows[0][5].decode('utf_8')
    project['space_key'] = rows[0][6]
    return project

def save(user, pid, xml):
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

def saveConfig(user, pid, conf):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT * FROM hasMetaModel WHERE user_id=%s AND metamodel_id=%s;',(user['id'], pid, ))
    has_rows = cur.fetchall()
    cur.close()
    if len(has_rows) == 0:
        return None
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE MetaModelInfo SET config=%s WHERE id = %s;',(conf.encode('utf_8'), pid, ))
    connect.commit()
    cur.close()
    connect.close()
    return True

def preview(connect, user, id):
    cur = connect.cursor()
    cur.execute('SELECT * FROM hasMetaModel WHERE user_id=%s AND metamodel_id=%s;',(user['id'], id, ))
    has_rows = cur.fetchall()
    cur.close()
    if len(has_rows) == 0:
        return None
    cur = connect.cursor()
    cur.execute('SELECT id,name,xml,config,visibillity,welcome_message,sample FROM MetaModelInfo WHERE id=%s;',(id, ))
    rows = cur.fetchall()
    cur.close()
    result = {}
    result['id'] = None
    result['name'] = 'preview'
    result['xml'] = rows[0][6].decode('utf-8')
    result['metamodel_id'] = id
    result['rep_id'] = None
    result['group_id'] = None
    metamodel = {}
    metamodel['id'] = rows[0][0]
    metamodel['name'] = rows[0][1].decode('utf_8')
    metamodel['xml'] = rows[0][2].decode('utf_8')
    metamodel['config'] = rows[0][3]
    metamodel['visibillity'] = int(rows[0][4])
    metamodel['welcome_message'] = rows[0][5].decode('utf_8')
    result['metamodel'] = metamodel
    return result