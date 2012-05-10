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

"""
グローバル変数
"""
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

"""
リポジトリを作成する。
"""
def CreateRepository(user, rep_name, group_id):
    global connect
    connect = MySQLdb.connect(db=config.REP_DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('INSERT INTO Repository (head_version,name,owner_id) VALUES(%s,%s,%s);', (1,rep_name,group_id))
    connect.commit()
    rep_id = cur.lastrowid
    cur.close()
    clearRepository(connect, user, rep_id)
    cur = connect.cursor()
    cur.execute('INSERT INTO model (id) VALUES(%s);', (rep_id))
    cur.execute('UPDATE Repository SET model_id=%s WHERE id=%s;', (rep_id, rep_id))
    connect.commit()
    cur.close()
    connect.close()

"""
リポジトリを削除する
"""
def deleteRepository(user, rep_id, group_id):
    connect = MySQLdb.connect(db=config.REP_DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('DELETE FROM Repository WHERE id=%s AND owner_id=%s;', (rep_id, group_id))
    affected = cur.rowcount
    connect.commit()
    cur.close()
    clearRepository(connect, user, rep_id)
    connect.close()
    return affected == 1

"""
リポジトリの中身をクリアする
"""
def clearRepository(connect, user, rep_id):
    #connect = MySQLdb.connect(db=config.REP_DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    #cur.execute('DELETE FROM has_property WHERE model_id=%s;', (rep_id))
    #cur.execute('DELETE FROM has_object WHERE model_id=%s;', (rep_id))
    #cur.execute('DELETE FROM has_relationship WHERE model_id=%s;', (rep_id))
    cur.execute('DELETE FROM comment WHERE rep_id=%s;', (rep_id))
    cur.execute('DELETE FROM diagram WHERE model_id=%s;', (rep_id))
    cur.execute('DELETE FROM object WHERE model_id=%s;', (rep_id))
    cur.execute('DELETE FROM relationship WHERE model_id=%s;', (rep_id))
    cur.execute('DELETE FROM property WHERE model_id=%s;', (rep_id))
    connect.commit()
    cur.close()
    #connect.close()

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

def ver_list(rep_id):
    connect = MySQLdb.connect(db=config.REP_DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT Repository.id AS id,version,content FROM Repository INNER JOIN comment ON Repository.id = comment.rep_id AND Repository.id=%s;',(rep_id, ))
    rows = cur.fetchall()
    reps = []
    for i in range(len(rows)):
        rep = {}
        rep['rep_id'] = rows[i][0]
        rep['version'] = rows[i][1]
        rep['content'] = rows[i][2]
        reps.append(rep)
    cur.close()
    connect.close()
    return reps

"""
"""
def group_rep_list(group_id):
    connect = MySQLdb.connect(db=config.REP_DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT id,model_id,head_version,name,owner_id FROM Repository WHERE owner_id=%s;', (group_id))
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

"""
"""
def getHistory(rep_id):
    history = {}
    history['verlist'] = {}
    connect = MySQLdb.connect(db=config.REP_DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT id,name,head_version,model_id FROM Repository WHERE id=%s;', (rep_id))
    rows = cur.fetchall()
    model_id = rows[0][3]
    cur.execute('SELECT version,content FROM comment WHERE rep_id=%s;', (rep_id))
    rows = cur.fetchall()
    for i in range(len(rows)):
        history['verlist'][str(rows[i][0])] = {"version":int(rows[i][0]), "content":rows[i][1].decode('utf-8')}
        history['verlist'][str(rows[i][0])]['changes'] = []
    cur.execute('SELECT * FROM model WHERE id=%s;', (model_id))
    rows = cur.fetchall()
    cur.execute('SELECT id,version,ver_type,meta_id FROM diagram WHERE model_id=%s;', (model_id))
    rows = cur.fetchall()
    for i in range(len(rows)):
        d = {}
        d['id'] = int(rows[i][0])
        d['version'] = int(rows[i][1])
        d['ver_type'] = rows[i][2]
        d['meta_id'] = int(rows[i][3])
        d['type'] = 'diagram'
        if history['verlist'].has_key(str(rows[i][1])):
            history['verlist'][str(rows[i][1])]['changes'].append(d)
    cur.execute('SELECT id,version,ver_type,meta_id FROM object WHERE model_id=%s;', (model_id))
    rows = cur.fetchall()
    for i in range(len(rows)):
        d = {}
        d['id'] = int(rows[i][0])
        d['version'] = int(rows[i][1])
        d['ver_type'] = rows[i][2]
        d['meta_id'] = int(rows[i][3])
        d['type'] = 'object'
        if history['verlist'].has_key(str(rows[i][1])):
            history['verlist'][str(rows[i][1])]['changes'].append(d)
    cur.execute('SELECT id,version,ver_type,meta_id FROM relationship WHERE model_id=%s;', (model_id))
    rows = cur.fetchall()
    for i in range(len(rows)):
        d = {}
        d['id'] = int(rows[i][0])
        d['version'] = int(rows[i][1])
        d['ver_type'] = rows[i][2]
        d['meta_id'] = int(rows[i][3])
        d['type'] = 'relationship'
        if history['verlist'].has_key(str(rows[i][1])):
            history['verlist'][str(rows[i][1])]['changes'].append(d)
    cur.execute('SELECT id,version,ver_type,meta_id,content FROM property WHERE model_id=%s;', (model_id))
    rows = cur.fetchall()
    for i in range(len(rows)):
        d = {}
        d['id'] = int(rows[i][0])
        d['version'] = int(rows[i][1])
        d['ver_type'] = rows[i][2]
        d['meta_id'] = int(rows[i][3])
        d['type'] = 'property'
        d['value'] = rows[i][4].decode('utf-8')
        if history['verlist'].has_key(str(rows[i][1])):
            history['verlist'][str(rows[i][1])]['changes'].append(d)
    cur.close()
    connect.close()
    return history

"""
"""
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
