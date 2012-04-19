# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import re
import sys
import datetime
import config
from flask import session
import GroupService
from util import Gmail

reg_username = re.compile('\w+')

def GetUserFromDB(username):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT id,uname,passwd,role FROM UserInfo WHERE uname = %s;', username)
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        connect.close()
        return None
    user = {}
    user['id'] = rows[0][0]
    user['uname'] = rows[0][1]
    user['passwd'] = rows[0][2]
    user['role'] = rows[0][3]
    cur.close()
    connect.close()
    return user

def GetUser():
    if 'user' in session:
        return session['user']
    return None

def CreateUser(username, password, role = 0, group_id=None):
    if not reg_username.match(username):
        return False
    if len(password) < 5:
        return False
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT uname FROM UserInfo WHERE uname = %s;', (username,))
    rows = cur.fetchall()
    if len(rows) != 0:
        cur.close()
        connect.close()
        return False
    d = datetime.datetime.today()
    cur.execute('INSERT INTO UserInfo (uname,passwd,register_date,role) VALUES(%s,%s,%s,%s);',(username, md5.new(password).hexdigest(), d.strftime("%Y-%m-%d"), role, ))
    user_id = cur.lastrowid
    connect.commit()
    if not group_id == None:
        GroupService.joinGroup(user_id, group_id, connect)
    cur.close()
    connect.close()
    return True

'''
'''
def CreateAdminUser(email):
    from_addr = 'hiya@gmail.com'
    to_addr = email
    msg = Gmail.create_message(from_addr, to_addr, 'test subject', 'test body')
    Gmail.send_via_gmail(from_addr, to_addr, msg)

'''
'''
def ConfirmEmail():
    pass

def EnableEmail(user, email):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    num = cur.execute('UPDATE userinfo SET email=%s WHERE id=%s;', (email, user.id))
    connect.commit()
    cur.close()
    connect.close()
    return True
#    return (num == 1)

def Login(username, password):
    if not reg_username.match(username):
        return None
#    session = MySession.GetSession()
    user = GetUserFromDB(username)
    if user == None:
        return None
    if md5.new(password).hexdigest() == user['passwd']:
        #session.setAttribute('user', user)
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        joinInfos = GroupService.checkUserJoinGroup(user, connect)
        connect.close()
        user['passwd'] = '*****'
        user['joinInfos'] = joinInfos
        session['user'] = user
        return user
    else:
        return None
    return None

def CheckLoggedin():
    user = GetUser()
    return user

#admin
def DeleteUser(username):
    connect = MySQLdb.connect(db="clooca", host="localhost", port=3306, user="clooca", passwd="un1verse")
    cur = connect.cursor()
    n = cur.execute('DELETE FROM userinfo WHERE username=%s', (username,))
    connect.commit()
    cur.close()
    connect.close()
    if n == 0:
        return False
    return True

def DeleteUserById(id):
  connect = MySQLdb.connect(db="clooca", host="localhost", port=3306, user="clooca", passwd="un1verse")
  cur = connect.cursor()
  n = cur.execute('DELETE FROM userinfo WHERE id=%s', (id,))
  connect.commit()
  cur.close()
  connect.close()
  if n == 0:
    return False
  return True

#admin
def GetUserList():
  connect = MySQLdb.connect(db="clooca", host="localhost", port=3306, user="clooca", passwd="un1verse")
  cur = connect.cursor()
  cur.execute('SELECT id,username,password,email,role FROM userinfo;')
  rows = cur.fetchall()
  userlist = []
  for i in range(len(rows)):
    userinfo = {}
    userinfo['id'] = rows[i][0]
    userinfo['username'] = rows[i][1]
#    userinfo['password'] = rows[i][1]
    userinfo['email'] = rows[i][3]
    userinfo['role'] = rows[i][4]
    userlist.append(userinfo)
  cur.close()
  connect.close()
  return userlist

def GetUserListByHead(head):
  connect = MySQLdb.connect(db="clooca", host="localhost", port=3306, user="clooca", passwd="un1verse")
  cur = connect.cursor()
  cur.execute('SELECT id,username,password,email,role FROM userinfo WHERE substring(username, 1, 1) = %s', (head))
  rows = cur.fetchall()
  userlist = []
  for i in range(len(rows)):
    userinfo = {}
    userinfo['id'] = rows[i][0]
    userinfo['username'] = rows[i][1]
#    userinfo['password'] = rows[i][1]
    userinfo['email'] = rows[i][3]
    userinfo['role'] = rows[i][4]
    userlist.append(userinfo)
  cur.close()
  connect.close()
  return userlist

def UpdateUserPassword(username, password):
    connect = MySQLdb.connect(db="clooca", host="localhost", port=3306, user="clooca", passwd="un1verse")
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE userinfo SET password=%s WHERE username = %s;',(password,username))
    connect.commit()
    cur.close()
    connect.close()
    if affect_row_count == 0:
        return False
    return True

def UpdateUserDetail(username, detail):
    connect = MySQLdb.connect(db="clooca", host="localhost", port=3306, user="clooca", passwd="un1verse")
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE userinfo SET detail=%s WHERE username = %s;',(detail,username))
    connect.commit()
    cur.close()
    connect.close()
    if affect_row_count == 0:
        return False
    return True
