# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import re
import sys
import datetime
import config as config
import CloocaModel
from flask import session
from core.util import Gmail
from core.util import Util

reg_username = re.compile('\w+')

def Register(username, password, email):
    #チェック
    if len(username) >= 32:
        return None
    if len(password) >= 32 or len(password) < 5:
        return None
    if len(email) >= 256:
        return None
    #データベース操作
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT id FROM UserInfo WHERE username = %s;', (username,))
    rows = cur.fetchall()
    if len(rows) != 0:
        cur.close()
        connect.close()
        return None
    d = datetime.datetime.today()
    cur.execute('INSERT INTO UserInfo (username,password,email,registration_date) VALUES(%s,%s,%s,%s);',(username, md5.new(password+'t').hexdigest(), Util.myencode(email), d.strftime("%Y-%m-%d"), ))
    connect.commit()
    d = datetime.datetime.today()
    key = md5.new(d.strftime('%s')).hexdigest()
    cur.execute('UPDATE UserInfo SET email_key=%s WHERE username=%s;', (key, username, ))
    connect.commit()
    from_addr = 'confirm@clooca.com'
    to_addr = email
    link = 'http://game.clooca.com/confirm/%s' % (key)
    link2 = 'http://game.clooca.com/login'
    body = u'''
    %s さん！clooca game、ご登録ありがとうございます！
    登録を完了するには %s にアクセスしてください。
    また、グループにログインするには次のURLにアクセスしてください。 %s
    ''' % (username, link, link2)
    msg = Gmail.create_message(from_addr, to_addr, 'clooca game！', body)
    Gmail.send_via_gmail(from_addr, to_addr, msg)
    cur.close()
    connect.close()
    return True

def EnableEmail(user, key):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT email_key FROM UserInfo WHERE username=%s;', (user['uname']))
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        connect.close();
        return False
    if not rows[0][0] == key:
        cur.close()
        connect.close();
        return False
    num = cur.execute('UPDATE UserInfo SET _is_email_available=%s WHERE username=%s;', (1, user['uname']))
    connect.commit()
    cur.close()
    connect.close()
    return True

def Login(username, password):
    if not reg_username.match(username):
        return None
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    user = CloocaModel.GetUserFromDB(connect, username)
    if user == None:
        connect.close()
        return None
    if md5.new(password + 't').hexdigest() == user['passwd']:
        user['passwd'] = '*****'
        user['registration_date'] = str(user['registration_date'])
        user['lastlogin_date'] = str(user['lastlogin_date'])
        session['user'] = user
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
