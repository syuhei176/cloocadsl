# -*- coding: utf-8 -*-

#game CloocaModel

import os
import MySQLdb
import md5
import re
import sys
import datetime
import config as config
from flask import session
from core.util import Util



def GetUserFromDB(connect, username):
    cur = connect.cursor()
    cur.execute('SELECT id,username,password,email,type,registration_date,lastlogin_date,full_name FROM UserInfo WHERE username = %s;', (username, ))
    rows = cur.fetchall()
    cur.close()
    if len(rows) == 0:
        return None
    user = {}
    user['id'] = int(rows[0][0])
    user['uname'] = rows[0][1]
    user['passwd'] = rows[0][2]
    user['email'] = rows[0][3]
    user['type'] = rows[0][4]
    user['registration_date'] = rows[0][5]
    user['lastlogin_date'] = rows[0][6]
    user['full_name'] = rows[0][7]
    return user


def GetStatusFromDB(connect, username, game_type):
    cur = connect.cursor()
    cur.execute('SELECT id,username,game_type,point,result FROM StatusInfo WHERE username = %s AND game_type = %s;', (username, game_type, ))
    rows = cur.fetchall()
    cur.close()
    if len(rows) == 0:
        return None
    user = {}
    user['id'] = int(rows[0][0])
    user['uname'] = rows[0][1]
    user['game_type'] = rows[0][2]
    user['point'] = int(rows[0][3])
    user['result'] = rows[0][4]
    return user

def GetCharacterFromDB(connect, id):
    cur = connect.cursor()
    cur.execute('SELECT id,user_id,game_type,name,level,exp,hp,atk,statics,project_id FROM CharacterInfo WHERE id = %s;', (id, ))
    rows = cur.fetchall()
    cur.close()
    if len(rows) == 0:
        return None
    user = {}
    user['id'] = int(rows[0][0])
    user['user_id'] = rows[0][1]
    user['game_type'] = rows[0][2]
    user['name'] = rows[0][3]
    user['level'] = int(rows[0][4])
    user['exp'] = int(rows[0][5])
    user['hp'] = int(rows[0][6])
    user['atk'] = int(rows[0][7])
    user['statics'] = rows[0][8]
    user['project_id'] = int(rows[0][9])
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
