# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import re
import sys
import datetime
import config_group as config
from flask import session
from core import GroupService
from core.util import Gmail
from core.util import Util

reg_username = re.compile('\w+')

def Register(username, password, email, group_key, group_name, plan):
    #チェック
    if len(group_key) >= 10:
        return None
    if len(group_name.encode('utf_8')) >= 255:
        return None
    if len(username) >= 32:
        return None
    if len(password) >= 32 or len(password) < 5:
        return None
    #データベース操作
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT space_key FROM SpaceInfo WHERE space_key = %s;', (group_key,))
    rows = cur.fetchall()
    if len(rows) != 0:
        cur.close()
        connect.close()
        return None
    d = datetime.datetime.today()
    contract_deadline = d + datetime.timedelta(months=1)
    cur.execute('INSERT INTO SpaceInfo (space_key,name,email,registration_date,contract_deadline,plan) VALUES(%s,%s,%s,%s,%s,%s);',(group_key, group_name.encode('utf-8'), Util.myencode(email), d.strftime("%Y-%m-%d"), contract_deadline.strftime("%Y-%m-%d"), plan, ))
    connect.commit()
    d = datetime.datetime.today()
    key = md5.new(d.strftime('%s')).hexdigest()
    cur.execute('UPDATE SpaceInfo SET email_key=%s WHERE space_key=%s;', (key, group_key, ))
    connect.commit()
    cur.execute('INSERT INTO UserInfo (username,password,space_key,role) VALUES(%s,%s,%s,%s);',(username, md5.new(password+'t').hexdigest(), group_key, 0))
    connect.commit()
    from_addr = 'hiya@gmail.com'
    to_addr = email
    link = 'http://127.0.0.1:5000/confirm/%s' % key
    link2 = 'http://127.0.0.1:5000/login/%s' % group_key
    body = '''
    %s さん！clooca for groupに、ご登録ありがとうございます！
    登録を完了するには %s にアクセスしてください。
    また、グループにログインするには次のURLにアクセスしてください。 %s
    ''' % (username, link, link2)
    msg = Gmail.create_message(from_addr, to_addr, 'thank you!', body)
    Gmail.send_via_gmail(from_addr, to_addr, msg)
    cur.close()
    connect.close()
    return True

def EnableEmail(user, key):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT email_key FROM SpaceInfo WHERE space_key=%s;', (user['space_key']))
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        connect.close();
        return False
    if not rows[0][0] == key:
        cur.close()
        connect.close();
        return False
    num = cur.execute('UPDATE SpaceInfo SET _is_email_available=%s WHERE space_key=%s;', (1, user['space_key']))
    connect.commit()
    cur.close()
    connect.close()
    return True

def LoginToGroup(username, password, group_key):
    if not reg_username.match(username):
        return None
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    user = GetUserFromDB(connect, username, group_key)
    if user == None:
        connect.close()
        return None
    if md5.new(password+'t').hexdigest() == user['passwd']:
        user['passwd'] = '*****'
        group = GetSpaceFromDB(connect, group_key)
        contract_deadline
        if datetime.date.today() > group['contract_deadline']:
            cur = connect.cursor()
            cur.execute('UPDATE SpaceInfo SET state=%s WHERE space_key=%s;', (1, group_key))
            connect.commit()
            cur.close()
            group['state'] = 1
        group['registration_date'] = str(group['registration_date'])
        group['contract_deadline'] = str(group['contract_deadline'])
        session['user'] = user
        session['group'] = group
        user['group'] = group
        connect.close()
        return user
    else:
        connect.close()
        return None
    return None

def payment(connect, space_key, months):
    cur = connect.cursor()
    d = datetime.datetime.today()
    contract_deadline = d + datetime.timedelta(months=months)
    cur.execute('UPDATE SpaceInfo SET state=%s,contract_deadline=%s WHERE space_key=%s;', (2, d.strftime("%Y-%m-%d"), space_key))
    cur.close()

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

