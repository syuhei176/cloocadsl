# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import re
import sys
import datetime
import config_group as config
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
