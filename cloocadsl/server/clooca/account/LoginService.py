# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import re
import sys
import datetime
import config
from flask import session
from clooca.util import Gmail
from clooca.util import Util


reg_username = re.compile('\w+')



"""
"""
def Login(email, password):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    user = GetUserFromDB(connect, email)
    if user == None:
        connect.close()
        return None
    if md5.new(password).hexdigest() == user['password']:
        user['passwd'] = '*****'
        user['registration_date'] = str(user['registration_date'])
        session['user'] = user
        connect.close()
        return user
    else:
        connect.close()
        return None
    return None

def GetUserFromDB(connect, email):
    cur = connect.cursor()
    cur.execute('SELECT user_id,email,password,registration_date,fullname,is_developper FROM account_info WHERE email = %s;', (email, ))
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        return None
    user = {}
    user['id'] = rows[0][0]
    user['email'] = rows[0][1]
    user['password'] = rows[0][2]
    user['registration_date'] = rows[0][3]
    user['fullname'] = rows[0][4].decode('utf-8')
    user['is_developper'] = rows[0][5]
    cur.close()
    return user
