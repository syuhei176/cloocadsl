# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import re
import sys
import json
#sys.path.append('../')
from xml.etree.ElementTree import *
import config


'''
グローバル変数
'''
#データベースとの接続
connect = None
#モデルリポジトリのID
model_id = None
#次のバージョン
next_version = None


def getRepositoryFromDB(rep_id):
    connect = MySQLdb.connect(db=config.REP_DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT id,name,head_version,model_id,owner_id FROM Repository WHERE id=%s;', (rep_id))
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        connect.close()
        return None
    rep = {}
    rep['id'] = rows[0][0]
    rep['name'] = rows[0][1]
    rep['head_version'] = rows[0][2]
    rep['model_id'] = rows[0][3]
    rep['owner_id'] = rows[0][4]
    cur.close()
    connect.close()
    return rep

'''
リポジトリを作成する。
'''
def CreateRepository(user, rep_name):
    global connect
    connect = MySQLdb.connect(db=config.REP_DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('INSERT INTO Repository (head_version,name,owner_id) VALUES(%s,%s,%s);', (1,rep_name,user['id']))
    connect.commit()
    rep_id = cur.lastrowid
#    cur.execute('INSERT INTO model (id) VALUES(%s);', (rep_id))
#    connect.commit()
#    cur.execute('UPDATE ProjectInfo SET rep_id=%s WHERE id=%s;', (rep_id, project_id))
#    connect.commit()
    cur.close()
    connect.close()
    clearRepository(user, rep_id)
    connect = MySQLdb.connect(db=config.REP_DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('INSERT INTO model (id) VALUES(%s);', (rep_id))
    cur.execute('UPDATE Repository SET model_id=%s WHERE id=%s;', (rep_id, rep_id))
    connect.commit()
    cur.close()
    connect.close()

    

'''
リポジトリを削除する
'''
def deleteRepository(user, rep_id):
    connect = MySQLdb.connect(db=config.REP_DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('DELETE FROM Repository WHERE id=%s AND owner_id=%s;', (rep_id, user['id']))
    affected = cur.rowcount
    connect.commit()
    cur.close()
    connect.close()
    clearRepository(user, rep_id)
    return affected == 1

'''
リポジトリの中身をクリアする
'''
def clearRepository(user, rep_id):
    global connect
    connect = MySQLdb.connect(db=config.REP_DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
#    cur.execute('UPDATE ProjectInfo SET rep_id=%s WHERE id=%s;', (0, pid))
    cur.execute('DELETE FROM has_property WHERE model_id=%s;', (rep_id))
    cur.execute('DELETE FROM has_object WHERE model_id=%s;', (rep_id))
    cur.execute('DELETE FROM has_relationship WHERE model_id=%s;', (rep_id))
#    cur.execute('DELETE FROM model WHERE id=%s;', (rep_id))
    cur.execute('DELETE FROM diagram WHERE model_id=%s;', (rep_id))
    cur.execute('DELETE FROM object WHERE model_id=%s;', (rep_id))
    cur.execute('DELETE FROM relationship WHERE model_id=%s;', (rep_id))
    cur.execute('DELETE FROM property WHERE model_id=%s;', (rep_id))
    connect.commit()
    cur.close()
    connect.close()

'''
'''
def rep_list():
    connect = MySQLdb.connect(db=config.REP_DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT id,model_id,head_version,name,owner_id FROM Repository;')
    rows = cur.fetchall()
    reps = []
    for i in range(len(rows)):
        rep = {}
        rep['id'] = rows[i][0]
        rep['model_id'] = rows[i][1]
        rep['head_version'] = rows[i][2]
        rep['name'] = rows[i][3]
        rep['owner_id'] = rows[i][4]
        reps.append(rep)
    cur.close()
    connect.close()
    return reps

'''
'''
def user_rep_list(user):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT id,model_id,head_version,name,owner_id FROM Repository WHERE owner_id=%s;', (rep_id))
    rows = cur.fetchall()
    reps = []
    for i in range(len(rows)):
        rep = {}
        rep['id'] = rows[i][0]
        rep['model_id'] = rows[i][1]
        rep['head_version'] = rows[i][2]
        rep['name'] = rows[i][3]
        rep['owner_id'] = rows[i][4]
        reps.append(rep)
    cur.close()
    connect.close()
    return reps

'''
'''
def checkout(rep_id, project_id):
    global connect
    connect = MySQLdb.connect(db=config.REP_DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT id,model_id,head_version FROM Repository WHERE id=%s;', (rep_id))
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        connect.close()
        return False
    rep_id = rows[0][0]
    model_id = rows[0][1]
    head_version = rows[0][2]
    cur.close()
    connect.close()
    return True

'''
'''
def getHistory(rep_id):
    global connect
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT * FROM has_property WHERE model_id=%s;', (rep_id))
    cur.execute('SELECT * FROM model WHERE id=%s;', (rep_id))
    rows = cur.fetchall()
    cur.execute('SELECT * FROM diagram WHERE model_id=%s;', (rep_id))
    cur.execute('SELECT * FROM object WHERE model_id=%s;', (rep_id))
    cur.execute('SELECT * FROM relationship WHERE model_id=%s;', (rep_id))
    cur.execute('SELECT * FROM property WHERE model_id=%s;', (rep_id))
    connect.commit()
    cur.close()
    connect.close()

'''
'''
def getHistory_version(rep_id, version):
    global connect
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT * FROM has_property WHERE model_id=%s;', (rep_id))
    cur.execute('SELECT * FROM model WHERE id=%s;', (rep_id))
    rows = cur.fetchall()
    cur.execute('SELECT * FROM diagram WHERE model_id=%s AND version=%s;', (rep_id, version))
    cur.execute('SELECT * FROM object WHERE model_id=%s AND version=%s;', (rep_id, version))
    cur.execute('SELECT * FROM relationship WHERE model_id=%s AND version=%s;', (rep_id, version))
    cur.execute('SELECT * FROM property WHERE model_id=%s AND version=%s;', (rep_id, version))
    connect.commit()
    cur.close()
    connect.close()
