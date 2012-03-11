import os
import MySQLdb
import md5
import re
import sys
import datetime
from xml.etree.ElementTree import *
sys.path.append('../')
from core.Controller.CommandService import *
import config

reg_username = re.compile('\w+')

def CreateModel(metamodel_id, name):
    connect = MySQLdb.connect(db=config.DB2_NAME, host=config.DB2_HOST, port=config.DB2_PORT, user=config.DB2_USER, passwd=config.DB2_PASSWD)
    cur = connect.cursor()
    cur.execute('INSERT INTO model (metamodel_id, name) VALUES(%s,%s);',(metamodel_id, name, ))
    connect.commit()
    cur.close()
    connect.close()
    
def UpdateModel():
    affect_row_count = cur.execute('UPDATE userinfo SET password=%s WHERE username = %s;',(password,username))
    pass

def LoadProject(project_id):
    return GetModel(project_id)

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


# Model Service
def GetModel(model_id):
    model = {}
    global connect
    global g_model_id
    g_model_id = model_id
    connect = MySQLdb.connect(db=config.DB2_NAME, host=config.DB2_HOST, port=config.DB2_PORT, user=config.DB2_USER, passwd=config.DB2_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT * FROM model WHERE id=%s;',(model_id, ))
    rows = cur.fetchall()
    cur.close()
    model['id'] = rows[0][0]
    model['root'] = GetDiagram(rows[0][1])
    connect.close()
    return model

def GetDiagram(diagram_id):
    diagram = {}
    cur = connect.cursor()
    cur.execute('SELECT * FROM diagram WHERE id=%s;',(diagram_id, ))
    rows = cur.fetchall()
    diagram['id'] = rows[0][0]
    diagram['metadiagram_id'] = rows[0][1]
#    cur.execute('SELECT * FROM has_object WHERE diagram_id=%s;',(diagram_id, ))
#    rows = cur.fetchall()
    diagram['object'] = SelectObjects(diagram_id)
#    for i in range(len(rows)):
#        diagram['object'].append(SelectObject(rows[i][1]))
#    cur.execute('SELECT * FROM has_relationship WHERE diagram_id=%s;',(diagram_id, ))
#    rows = cur.fetchall()
    diagram['relationship'] = SelectRelationships(diagram_id)
#    for i in range(len(rows)):
#        diagram['relationship'].append(SelectRelationship(rows[i][1]))
    cur.close()
    return diagram

def SelectDiagram(diagram_id):
    cur = connect.cursor()
    cur.execute('SELECT * FROM diagram WHERE id=%s;',(diagram_id, ))
    rows = cur.fetchall()
    cur.close()
    diagram = {}
    diagram['id'] = rows[0][0]
    diagram['metadiagram_id'] = rows[0][1]
    return diagram

def SelectObject(object_id):
    cur = connect.cursor()
    cur.execute('SELECT * FROM object WHERE id=%s AND model_id=%s;',(object_id, g_model_id, ))
    rows = cur.fetchall()
    cur.close()
    object = {}
    object['id'] = rows[0][0]
    object['metaobject_id'] = rows[0][1]
    object['x'] = rows[0][2]
    object['y'] = rows[0][3]
    object['local_id'] = rows[0][4]
    return object

def SelectObjects(diagram_id):
    cur = connect.cursor()
    cur.execute('SELECT * FROM object WHERE diagram_id=%s AND model_id=%s;',(diagram_id, g_model_id, ))
    rows = cur.fetchall()
    cur.close()
    objects = []
    for i in range(len(rows)):
        object = {}
        object['id'] = rows[i][0]
        object['metaobject_id'] = rows[i][1]
        object['x'] = rows[i][2]
        object['y'] = rows[i][3]
        object['local_id'] = rows[i][4]
        object['diagram_id'] = rows[i][5]
        object['properties'] = SelectProperties(object['id'])
        objects.append(object)
    return objects

def SelectRelationship(relationship_id):
    cur = connect.cursor()
    cur.execute('SELECT * FROM relationship WHERE id=%s;',(relationship_id, ))
    rows = cur.fetchall()
    cur.close()
    relationship = {}
    relationship['id'] = rows[0][0]
    relationship['metarelationship_id'] = rows[0][1]
    relationship['src'] = rows[0][2]
    relationship['dest'] = rows[0][3]
    return relationship

def SelectRelationships(diagram_id):
    cur = connect.cursor()
    cur.execute('SELECT * FROM relationship WHERE diagram_id=%s AND model_id=%s;',(diagram_id, g_model_id, ))
    rows = cur.fetchall()
    cur.close()
    relationships = []
    for i in range(len(rows)):
        relationship = {}
        relationship['id'] = rows[i][0]
        relationship['metarelationship_id'] = rows[i][1]
        relationship['src'] = rows[i][2]
        relationship['dest'] = rows[i][3]
        relationship['local_id'] = rows[i][4]
        relationship['diagram_id'] = rows[i][5]
        relationships.append(relationship)
    return relationships

def SelectProperties(object_id):
    cur = connect.cursor()
    cur.execute('SELECT * FROM property WHERE object_id=%s AND model_id=%s;',(object_id, g_model_id, ))
    rows = cur.fetchall()
    cur.close()
    properties = []
    for i in range(len(rows)):
        property = {}
        property['id'] = rows[i][0]
        property['object_id'] = rows[i][1]
        property['metaproperty_id'] = rows[i][2]
        property['value'] = rows[i][3]
        properties.append(property)
    return properties
