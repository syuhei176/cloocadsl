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


def joinGroup(user_id, group_id, connect):
    cur = connect.cursor()
    cur.execute('INSERT INTO JoinInfo (user_id,group_id,role) VALUES(%s,%s,%s);',(user_id, group_id, 0, ))
    connect.commit()
    cur.close()
    
def createGroup(user, group_name, connect):
    cur.execute('INSERT INTO GroupInfo (name) VALUES(%s);',(group_name,))
    connect.commit()
    group_id = cur.lastrowid
    cur.execute('INSERT INTO Join (user_id,group_id,role) VALUES(%s,%s,%s);',(user['id'], group_id, 1, ))

def updateGroup(user, group_id, detail):
    if checkUserJoinGroup(user, group_id, connect) == 1:
        cur = connect.cursor()
        affect_row_count = cur.execute('UPDATE GroupInfo SET detail=%s WHERE id = %s;',(detail, group_id, ))
        connect.commit()
        cur.close()
        return True
    else:
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
