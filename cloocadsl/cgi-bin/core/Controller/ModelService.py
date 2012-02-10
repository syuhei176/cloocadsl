import os
import MySQLdb
import md5
import re
import sys
import datetime
sys.path.append('../../')
from config import *

reg_username = re.compile('\w+')

def CreateModel(metamodel_id, name):
    connect = MySQLdb.connect(db=config.DB2_NAME, host=config.DB2_HOST, port=config.DB2_PORT, user=config.DB2_USER, passwd=config.DB2_PASSWD)
    cur = connect.cursor()
    cur.execute('INSERT INTO model (metamodel_id, name) VALUES(%s,%s);',(metamodel_id, name, ))
    connect.commit()
    cur.close()
    connect.close()
    
def AddDiagram(model_id, metadiagram_id, name):
    connect = MySQLdb.connect(db=config.DB2_NAME, host=config.DB2_HOST, port=config.DB2_PORT, user=config.DB2_USER, passwd=config.DB2_PASSWD)
    cur = connect.cursor()
    cur.execute('INSERT INTO diagram (metadiagram_id, name) VALUES(%s,%s);',(metadiagram_id, name, ))
    diagram_id = cur.lastrowid
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE model SET root=%s WHERE id = %s;',(diagram_id,model_id, ))
    connect.commit()
    cur.close()
    connect.close()

def UpdateModel():
    affect_row_count = cur.execute('UPDATE userinfo SET password=%s WHERE username = %s;',(password,username))
    pass

def LoadModel():
    pass

def MoveObject():
    pass

def AddObject():
    pass

def DeleteObject():
    pass

def AddBinding():
    pass

def AddObject():
    pass

def GetUserFromDB(username):
  connect = MySQLdb.connect(db="clooca", host="localhost", port=3306, user="clooca", passwd="un1verse")
  cur = connect.cursor()
  cur.execute('SELECT id,username,password,email,role,detail FROM userinfo WHERE username = %s;', username)
  rows = cur.fetchall()
  if len(rows) == 0:
    cur.close()
    connect.close()
    return None
  user = FreeUser(rows[0][0])
  user.username = rows[0][1]
  user.password = rows[0][2]
  user.email = rows[0][3]
  user.role = rows[0][4]
  user.detail = rows[0][5]
  cur.close()
  connect.close()
  return user

  cur.execute('INSERT INTO userinfo (username,password, role, regist_date, detail) VALUES(%s,%s,%s,%s,%s);',(username, md5.new(password).hexdigest(), role, d.strftime("%Y-%m-%d"), detail))
  connect.commit()
  cur.close()
  connect.close()
  return True

def EnableEmail(user, email):
  return user.EnableMail(email)

def Login(username, password):
  if not reg_username.match(username):
    return LoginInfo(False, False, None)
  session = GetSession()
  user = GetUserFromDB(username)
  if user == None:
      return LoginInfo(False, False, None)
  if not user.username == username:
    return LoginInfo(False, False, None)
  if md5.new(password).hexdigest() == user.password:
    session.setAttribute('user', user)
  else:
    return LoginInfo(False, False, None)
  lesson = GetLesson()
  if lesson == None:
    return LoginInfo(True, False, user)
  else:
    return LoginInfo(True, True, user)
  return LoginInfo(False, False, None)

def CheckLoggedin():
  user = GetUser()
  if user == None:
    return LoginInfo(False, False, None)
  lesson = GetLesson()
  if lesson == None:
    return LoginInfo(True, False, user)
  else:
    return LoginInfo(True, True, user)

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
  cur.execute('SELECT id,username,password,email,role FROM userinfo')
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
