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
    reg_result = Register(connect, username, password, email, 'free', state=2)
    if reg_result['result']:
        cur = connect.cursor()
        d = datetime.datetime.today()
        key = md5.new(d.strftime('%s')).hexdigest()
        cur.execute('UPDATE UserInfo SET email_key=%s WHERE id=%s;', (key, reg_result['user_id']))
        connect.commit()
        from_addr = 'hiya@gmail.com'
        to_addr = email
        link = 'http://dsl.clooca.com/confirm/%s' % key
        body = u'''
        %s さん！cloocaに、ご登録ありがとうございます！
        登録を完了するには %s にアクセスしてください。
        ''' % (username, link)
        msg = Gmail.create_message(from_addr, to_addr, 'cloocaにご登録ありがとうございます。', body)
        Gmail.send_via_gmail(from_addr, to_addr, msg)
        cur.close()
        connect.close()
        return True
    connect.close()
    return False

def RegisterWbLicense(username, password, email):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    reg_result = Register(connect, username, password, email, 'wb')
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
        %s さん！clooca developer licenseに、ご登録ありがとうございます！
        登録を完了するには %s にアクセスしてください。
        ''' % (username, link)
        msg = Gmail.create_message(from_addr, to_addr, 'thank you for your registration!', body)
        Gmail.send_via_gmail(from_addr, to_addr, msg)
        cur.close()
        connect.close()
        return True
    connect.close()
    return False

def RegisterGroupLicense(username, password, email, group_key, group_name):
    if len(group_key) >= 16:
        return False
    if len(group_name.encode('utf_8')) >= 255:
        return False
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    reg_result = Register(connect, username, password, email, 'group')
    if reg_result['result']:
        cur = connect.cursor()
        d = datetime.datetime.today()
        key = md5.new(d.strftime('%s')).hexdigest()
        cur.execute('UPDATE UserInfo SET email_key=%s WHERE id=%s;', (key, reg_result['user_id']))
        connect.commit()
        from_addr = 'hiya@gmail.com'
        to_addr = email
        link = 'http://dsl.clooca.com/confirm/%s' % key
        link2 = 'http://dsl.clooca.com/login/%s' % group_key
        body = '''
        %s さん！cloocaグループライセンスに、ご登録ありがとうございます！
        登録を完了するには %s にアクセスしてください。
        また、グループにログインするには次のURLにアクセスしてください。 %s
        ''' % (username, link, link2)
        msg = Gmail.create_message(from_addr, to_addr, 'thank you!', body)
        Gmail.send_via_gmail(from_addr, to_addr, msg)
        cur.close()
        if GroupService.createGroup(connect, reg_result['user_id'], group_key, group_name):
            connect.close()
            return True
    connect.close()
    return False


def Register(connect, username, password, email, license_type, state=0):
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
    cur.execute('INSERT INTO UserInfo (uname,passwd,registration_date,email,state,license_type) VALUES(%s,%s,%s,%s,%s,%s);',(username, md5.new(password).hexdigest(), d.strftime("%Y-%m-%d"), Util.myencode(email), state, license_type, ))
    user_id = cur.lastrowid
    connect.commit()
    cur.close()
    return {'result': True, 'user_id': user_id}

def EnableEmail(user, key):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT email_key,license_type FROM UserInfo WHERE id=%s;', (user['id']))
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

def GetUserFromDB(connect, username):
    cur = connect.cursor()
    cur.execute('SELECT id,uname,passwd,role,license_type,registration_date,state FROM UserInfo WHERE uname = %s;', (username, ))
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        return None
    user = {}
    user['id'] = rows[0][0]
    user['uname'] = rows[0][1]
    user['passwd'] = rows[0][2]
    user['role'] = rows[0][3]
    user['license_type'] = rows[0][4]
    user['registration_date'] = rows[0][5]
    user['state'] = rows[0][6]
    cur.close()
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

def Login(username, password):
    if not reg_username.match(username):
        return None
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    user = GetUserFromDB(connect, username)
    if user == None:
        connect.close()
        return None
    if md5.new(password).hexdigest() == user['passwd']:
        user['passwd'] = '*****'
        if user['state'] == 0 and (datetime.date.today() - user['registration_date']) > datetime.timedelta(days=30):
            connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
            cur = connect.cursor()
            cur.execute('UPDATE UserInfo SET state=%s WHERE id=%s;', (1, user['id']))
            connect.commit()
            cur.close()
            user['state'] = 1
        user['registration_date'] = str(user['registration_date'])
        session['user'] = user
        connect.close()
        return user
    else:
        connect.close()
        return None
    return None

def LoginToGroup(username, password, group_key):
    if not reg_username.match(username):
        return None
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    group = GroupService.getGroupByKey(group_key, connect)
    user = GetUserFromDB(connect, username, group['id'])
    if user == None:
        connect.close()
        return None
    if md5.new(password).hexdigest() == user['passwd']:
        role = GroupService.checkJoinByKey(user, group_key, connect)
        if not role == None:
            user['passwd'] = '*****'
            if group['state'] == 0 and (datetime.date.today() - group['registration_date']) > datetime.timedelta(days=30):
                cur = connect.cursor()
                cur.execute('UPDATE GroupInfo SET state=%s WHERE id=%s;', (1, group['id']))
                connect.commit()
                cur.close()
                group['state'] = 1
            user['registration_date'] = str(user['registration_date'])
            group['registration_date'] = str(group['registration_date'])
            session['user'] = user
            session['group'] = group
            user['group'] = group
            user['role'] = role
            connect.close()
            return user
        connect.close()
        return None
    else:
        connect.close()
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
