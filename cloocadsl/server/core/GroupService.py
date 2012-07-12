# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import sys
import datetime
from xml.etree.ElementTree import *
sys.path.append('../')
#from config import *
import config


def checkJoin(user, group_id, connect):
    cur = connect.cursor()
    cur.execute('SELECT * FROM JoinInfo WHERE user_id=%s AND group_id=%s',(user['id'], group_id, ))
    has_rows = cur.fetchall()
    cur.close()
    if len(has_rows) == 0:
        return False
    return True

def checkJoinByKey(user, group_key, connect):
    cur = connect.cursor()
    cur.execute('SELECT role FROM GroupInfo INNER JOIN JoinInfo ON GroupInfo.id = JoinInfo.group_id AND JoinInfo.user_id=%s AND GroupInfo.group_key=%s;',(user['id'], group_key))
    has_rows = cur.fetchall()
    cur.close()
    if len(has_rows) == 0:
        return None
    role = int(has_rows[0][0])
    return role


def checkUserJoinGroup(user, connect):
    cur = connect.cursor()
    cur.execute('SELECT GroupInfo.id AS id1, JoinInfo.group_id AS id2,name,user_id,role,service FROM GroupInfo INNER JOIN JoinInfo ON GroupInfo.id = JoinInfo.group_id AND JoinInfo.user_id=%s;',(user['id'], ))
    has_rows = cur.fetchall()
    cur.close()
    joinInfos = []
    for i in range(len(has_rows)):
        group_id = has_rows[i][0]
        name = has_rows[i][2]
        role = int(has_rows[i][4])
        service = has_rows[i][5]
        joinInfo = {}
        joinInfo['id'] = group_id
        joinInfo['name'] = name
        joinInfo['role'] = role
        joinInfo['service'] = service
        joinInfos.append(joinInfo)
    return joinInfos

def getMyGroups(user, connect):
    cur = connect.cursor()
    cur.execute('SELECT GroupInfo.id AS id1, JoinInfo.group_id AS id2,name,user_id,role,service FROM GroupInfo INNER JOIN JoinInfo ON GroupInfo.id = JoinInfo.group_id AND JoinInfo.user_id=%s;',(user['id'], ))
    has_rows = cur.fetchall()
    cur.close()
    joinInfos = []
    for i in range(len(has_rows)):
        group_id = has_rows[i][0]
        name = has_rows[i][2]
        role = int(has_rows[i][4])
        service = has_rows[i][5]
        joinInfo = {}
        joinInfo['id'] = group_id
        joinInfo['name'] = name.decode('utf-8')
        joinInfo['role'] = role
        joinInfo['service'] = service
        joinInfos.append(joinInfo)
    return joinInfos

def joinGroup(user, group_id, connect):
    cur = connect.cursor()
    cur.execute('SELECT * FROM JoinInfo WHERE user_id=%s AND group_id=%s;', (user['id'], group_id, ))
    rows = cur.fetchall()
    if not len(rows) == 0:
        cur.close()
        return False
    cur.execute('UPDATE UserInfo SET group_id=%s WHERE id=%s;', (group_id, user['id']))
    cur.execute('INSERT INTO JoinInfo (user_id,group_id,role) VALUES(%s,%s,%s);',(user['id'], group_id, 0, ))
    connect.commit()
    cur.close()
    return True

def updateRole(user, group_id, user_id, role, connect):
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE JoinInfo SET role=%s WHERE user_id=%s AND group_id=%s;', (role, user_id, group_id, ))
    connect.commit()
    cur.close()
    if affect_row_count == 0:
        return False
    return True
    
def createGroup(connect, user_id, group_key, group_name):
    if len(group_name.encode('utf_8')) >= 255:
        return False
    cur = connect.cursor()
    d = datetime.datetime.today()
    cur.execute('INSERT INTO GroupInfo (group_key,name,detail,visibillity,service,registration_date) VALUES(%s,%s,%s,%s,%s,%s);',(group_key, group_name.encode('utf_8'),'',0,'free',d.strftime("%Y-%m-%d"),))
    connect.commit()
    group_id = cur.lastrowid
    cur.execute('UPDATE UserInfo SET group_id=%s WHERE id=%s;', (group_id, user_id))
    cur.execute('INSERT INTO JoinInfo (user_id,group_id,role) VALUES(%s,%s,%s);',(user_id, group_id, 1, ))
    connect.commit()
    cur.close()
    return True

def getGroup(group_id, connect):
    cur = connect.cursor()
    cur.execute('SELECT id,group_key,name,detail,visibillity,service,registration_date,state FROM GroupInfo WHERE id = %s;', group_id)
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        return None
    group = {}
    group['id'] = int(rows[0][0])
    group['key'] = rows[0][1]
    group['name'] = rows[0][2].decode('utf-8')
    group['detail'] = rows[0][3].decode('utf-8')
    group['visibillity'] = int(rows[0][4])
    group['service'] = rows[0][5]
    group['registration_date'] = rows[0][6]
    group['state'] = int(rows[0][7])
    cur.close()
    return group

def getGroupByKey(group_key, connect):
    cur = connect.cursor()
    cur.execute('SELECT id,group_key,name,detail,visibillity,service,registration_date,state FROM GroupInfo WHERE group_key = %s;', group_key)
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        return None
    group = {}
    group['id'] = int(rows[0][0])
    group['key'] = rows[0][1]
    group['name'] = rows[0][2].decode('utf-8')
    group['detail'] = rows[0][3].decode('utf-8')
    group['visibillity'] = int(rows[0][4])
    group['service'] = rows[0][5]
    group['registration_date'] = rows[0][6]
    group['state'] = int(rows[0][7])
    cur.close()
    return group



def updateGroup(user, group_id, name, detail, visibillity, connect):
    if len(name) >= 255:
        return False
    cur = connect.cursor()
    cur.execute('SELECT * FROM JoinInfo WHERE user_id=%s AND group_id=%s;', (user['id'], group_id, ))
    rows = cur.fetchall()
    if not len(rows) == 0:
        cur = connect.cursor()
        affect_row_count = cur.execute('UPDATE GroupInfo SET name=%s, detail=%s, visibillity=%s WHERE id = %s;',(name, detail, visibillity, group_id, ))
        connect.commit()
        cur.close()
        return True
    else:
        cur.close()
        return False

def deleteGroup(user, group_id, connect):
    if checkUserJoinGroup(user, group_id, connect) == 1:
        cur = connect.cursor()
        cur.execute('DELETE FROM GroupInfo WHERE group_id=%s;',(group_id,))
        cur.execute('DELETE FROM Join WHERE group_id=%s;',(group_id,))
        connect.commit()
        cur.close()
        return True
    else:
        return False

def getGroupMember(user, group_id, connect):
    cur = connect.cursor()
    cur.execute('SELECT UserInfo.id AS id,UserInfo.uname,UserInfo.role,JoinInfo.role FROM UserInfo INNER JOIN JoinInfo ON UserInfo.id = JoinInfo.user_id AND JoinInfo.group_id=%s;',(group_id, ))
    rows = cur.fetchall()
    cur.close()
    members = []
    for i in range(len(rows)):
        user_id = int(rows[i][0])
        uname = rows[i][1]
        user_role = int(rows[i][2])
        group_role = int(rows[i][3])
        member = {}
        member['id'] = user_id
        member['uname'] = uname
        member['role'] = user_role
        member['group_role'] = group_role
        members.append(member)
    return members

def addUser(connect, user, group_id, username, password):
    d = datetime.datetime.today()
    if not reg_username.match(username):
        return False
    if len(password) < 5:
        return False
    cur = connect.cursor()
    cur.execute('SELECT uname FROM UserInfo WHERE uname = %s AND group_id=%s;', (username, group_id, ))
    rows = cur.fetchall()
    if not len(rows) == 0:
        cur.close()
        return False
    cur.execute('INSERT INTO UserInfo (uname,passwd,register_date,email,state,license_type,group_id) VALUES(%s,%s,%s,%s,%s,%s,%s);',(username, md5.new(password).hexdigest(), d.strftime("%Y-%m-%d"), '', 2, 'membr', group_id, ))
    user_id = cur.lastrowid
    connect.commit()
    cur.close()
    return True

def addUsers(connect, user, group_id, members_text):
    members = json.loads(members_text)
    for member in members:
        addUser(connect, user, group_id, member['username'], member['password'])

def getComunity(user, connect):
    cur = connect.cursor()
    cur.execute('SELECT id,name,detail,visibillity,service FROM GroupInfo WHERE visibillity = 1;')
    rows = cur.fetchall()
    cur.close()
    groups = []
    for i in range(len(rows)):
        group_id = int(rows[i][0])
        name = rows[i][1]
        detail = rows[i][2]
        visibillity = int(rows[i][3])
        group = {}
        group['id'] = group_id
        group['name'] = name.decode('utf-8')
        group['detail'] = detail.decode('utf-8')
        group['visibillity'] = visibillity
        groups.append(group)
    return groups
