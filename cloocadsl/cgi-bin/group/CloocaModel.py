# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import re
import sys
import datetime
import config_group as config
from flask import session
from core.util import Util

def GetUserFromDB(connect, username, group_key):
    cur = connect.cursor()
    cur.execute('SELECT id,space_key,username,password,role FROM UserInfo WHERE username = %s AND space_key = %s;', (username, group_key, ))
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        connect.close()
        return None
    user = {}
    user['id'] = int(rows[0][0])
    user['space_key'] = rows[0][1]
    user['uname'] = rows[0][2]
    user['passwd'] = rows[0][3]
    user['role'] = int(rows[0][4])
    cur.close()
    return user

def GetSpaceFromDB(connect, group_key):
    cur = connect.cursor()
    cur.execute('SELECT space_key,name,lang,_is_email_available,email,registration_date,contract_deadline,plan,state FROM SpaceInfo WHERE space_key = %s;', (group_key, ))
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        connect.close()
        return None
    user = {}
    user['key'] = rows[0][0]
    user['name'] = rows[0][1].decode('utf-8')
    user['lang'] = rows[0][2]
    user['_is_email_available'] = rows[0][3]
    user['email'] = Util.mydecode(rows[0][4])
    user['registration_date'] = rows[0][5]
    user['contract_deadline'] = rows[0][6]
    user['plan'] = rows[0][7]
    user['state'] = int(rows[0][8])
    cur.close()
    return user

def getProjectFromDB(connect, pid):
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
    return project

def getMetaModelFromDB(connect, user, pid, check=True):
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
    project['config'] = rows[0][3]
    project['visibillity'] = int(rows[0][4])
    project['welcome_message'] = rows[0][5].decode('utf_8')
    project['targets'] = rows[0][6]
    project['group_id'] = int(rows[0][7])
    #connect.close()
    return project
