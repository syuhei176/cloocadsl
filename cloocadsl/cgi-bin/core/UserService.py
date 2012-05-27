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
from util import Util

reg_username = re.compile('\w+')

def RegisterEditorLicense(username, password, email):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    reg_result = Register(connect, username, password, email, 'free')
    if reg_result['result']:
        cur = connect.cursor()
        d = datetime.datetime.today()
        key = md5.new(d.strftime('%s')).hexdigest()
        cur.execute('UPDATE UserInfo SET email_key=%s WHERE id=%s;', (key, reg_result['user_id']))
        connect.commit()
        from_addr = 'hiya@gmail.com'
        to_addr = email
        link = 'http://dsl.clooca.com/confirm/%s' % key
        body = '''
        %s thank you
         please access %s
        ''' % (username, link)
        msg = Gmail.create_message(from_addr, to_addr, 'a', body)
        Gmail.send_via_gmail(from_addr, to_addr, msg)
        cur.close()
        connect.close()
        return True
    connect.close()
    return False

def Register(connect, username, password, email, license_type):
    if not reg_username.match(username):
        return {'result': False, 'user_id': 0}
    if len(password) < 5:
        return {'result': False, 'user_id': 0}
    cur = connect.cursor()
    cur.execute('SELECT uname FROM UserInfo WHERE uname = %s;', (username,))
    rows = cur.fetchall()
    if len(rows) != 0:
        cur.close()
        return {'result': False, 'user_id': 0}
    d = datetime.datetime.today()
    cur.execute('INSERT INTO UserInfo (uname,passwd,register_date,email) VALUES(%s,%s,%s,%s);',(username, md5.new(password).hexdigest(), d.strftime("%Y-%m-%d"), Util.myencode(email), ))
    user_id = cur.lastrowid
    connect.commit()
    cur.close()
    return {'result': True, 'user_id': user_id}

def EnableEmail(user, key):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT email_key FROM UserInfo WHERE id=%s;', (user['id']))
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        connect.close();
        return False
    if not rows[0][0] == key:
        cur.close()
        connect.close();
        return False
    num = cur.execute('UPDATE UserInfo SET email_is_available=%s WHERE id=%s;', (1, user['id']))
    connect.commit()
    cur.close()
    connect.close()
    return True

def GetUserFromDB(username):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT id,uname,passwd,role,license_type FROM UserInfo WHERE uname = %s;', username)
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
    user['license_type'] = rows[0][4]
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

def getUserInfo(user):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT id,uname,passwd,register_date,email,role,belonging FROM UserInfo WHERE id = %s;', user['id'])
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        connect.close()
        return None
    user = {}
    user['id'] = rows[0][0]
    user['uname'] = rows[0][1]
    user['passwd'] = '*' * 5
    user['register_date'] = rows[0][3]
    user['email'] = rows[0][4]
    user['role'] = rows[0][5]
    user['belonging'] = rows[0][6]
    cur.close()
    connect.close()
    return user    
