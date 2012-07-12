# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import re
import sys
import datetime
import config
import random
from flask import session
from clooca.util import Gmail
from clooca.util import Util

"""
"""
def Register(email):
    if len(email) < 3:
        return False
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    password = genPassword(6)
    reg_result = CreateUser(connect, email, password)
    if reg_result['result']:
        cur = connect.cursor()
        d = datetime.datetime.today()
        key = md5.new(d.strftime('%s')).hexdigest()
        cur.execute('UPDATE account_info SET email_key=%s WHERE email=%s;', (key, email, ))
        connect.commit()
        from_addr = 'hiya@clooca.com'
        to_addr = email
        link = 'http://dsl.clooca.com/confirm/%s' % key
        body = u'''
        %s さん！cloocaに、ご登録ありがとうございます！
        登録を完了するには %s にアクセスしてください。
        パスワードは %s です。
        ''' % (email, link, password)
        msg = Gmail.create_message(from_addr, to_addr, 'cloocaにご登録ありがとうございます。', body)
        Gmail.send_via_gmail(from_addr, to_addr, msg)
        cur.close()
        connect.close()
        return True
    connect.close()
    return False

def CreateUser(connect, email, password):
    if len(password) < 5:
        return {'result': False, 'user_id': 0}
    cur = connect.cursor()
    cur.execute('SELECT email FROM account_info WHERE email = %s;', (email,))
    rows = cur.fetchall()
    if len(rows) != 0:
        cur.close()
        return {'result': False, 'user_id': 0}
    d = datetime.datetime.today()
    cur.execute('INSERT INTO account_info (email,password,registration_date) VALUES(%s,%s,%s);',(Util.myencode(email), md5.new(password).hexdigest(), d.strftime("%Y-%m-%d"), ))
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


def GetUser():
    if 'user' in session:
        return session['user']
    return None

def genPassword(passlen):
    s = 'abcdefghijkmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ123456789'
    password = ''
    for i in range(passlen):
        password += random.choice(s)
    return password
