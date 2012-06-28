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

"""
プロジェクトをロードする
"""
def load(connect, user, pid):
    cur = connect.cursor()
    cur.execute('SELECT * FROM hasProject WHERE user_id=%s AND project_id=%s;',(user['id'], pid, ))
    has_rows = cur.fetchall()
    cur.close()
    #if len(has_rows) == 0:
    #    return None
    cur = connect.cursor()
    cur.execute('SELECT id,name,xml,metamodel_id,rep_id,space_key FROM ProjectInfo WHERE id=%s;',(pid, ))
    rows = cur.fetchall()
    cur.close()
    project = {}
    project['id'] = rows[0][0]
    project['name'] = rows[0][1].decode('utf-8')
    project['xml'] = rows[0][2].decode('utf-8')
    project['metamodel_id'] = rows[0][3]
    project['rep_id'] = rows[0][4]
    project['space_key'] = rows[0][5]
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
    #connect.close()
    return project

def saveProject(user, pid, xml):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT * FROM hasProject WHERE user_id=%s AND project_id=%s;',(user['id'], pid, ))
    has_rows = cur.fetchall()
    cur.close()
    #if len(has_rows) == 0:
    #    connect.close()
    #    return None
    cur = connect.cursor()
    #cur.execute('SELECT last_editor_id,xml FROM ProjectInfo WHERE id=%s;',(pid, ))
    #rows = cur.fetchall()
    #if len(rows) == 0:
    #    cur.close()
    #    connect.close()
    #    return None
    result_json = xml
    updated = False
    """
    if rows[0][0] == user['id']:
        pass
    else:
        model1 = json.loads(rows[0][1])
        model2 = json.loads(xml)
        merged_model = merge(model1, model2)
        result_json = json.dumps(merged_model)
        updated = True
    """
    affect_row_count = cur.execute('UPDATE ProjectInfo SET xml=%s,last_editor_id=%s WHERE id = %s;',(result_json.encode('utf_8'), user['id'], pid, ))
    connect.commit()
    cur.close()
    connect.close()
    return {'updated':updated,'xml':result_json}
