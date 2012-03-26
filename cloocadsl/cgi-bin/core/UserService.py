import os
import MySQLdb
import md5
import re
import sys
import datetime
import config
from flask import session
#from util import MySession

reg_username = re.compile('\w+')

def GetUserFromDB(username):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT id,uname,passwd FROM UserInfo WHERE uname = %s;', username)
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        connect.close()
        return None
    user = {}
    user['id'] = rows[0][0]
    user['uname'] = rows[0][1]
    user['passwd'] = rows[0][2]
    cur.close()
    connect.close()
    return user

def GetUser():
    if 'user' in session:
        return session['user']
    return None
#    session = MySession.GetSession()
#    if session._is_new():
#        return None
#    user = session.getAttribute("user")
#    return user

def CreateUser(username, password):
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
    cur.execute('INSERT INTO UserInfo (uname,passwd, register_date) VALUES(%s,%s,%s);',(username, md5.new(password).hexdigest(), d.strftime("%Y-%m-%d")))
    connect.commit()
    cur.close()
    connect.close()
    return True

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
    if md5.new(password).hexdigest() == user['passwd']:
#        session.setAttribute('user', user)
        session['user'] = user
        user['passwd'] = '*****'
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
