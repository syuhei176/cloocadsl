# -*- coding: utf-8 -*-
import sys
import MySQLdb
import config
import CommitService
import UpdateServiceJSON
import RepositoryService

'''
commit
return:0,1,2
'''
def commit(user, pid):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT id,name,xml,metamodel_id,rep_id FROM ProjectInfo WHERE id=%s;', (pid,))
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        connect.close()
        return 0
    #xml to rep (xml include version infomation)
    rep_id = rows[0][4]
    model_json = rows[0][2]
    cur.close()
    connect.close()
    return CommitService.commit(rep_id, model_json)

def update(user, pid):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT rep_id FROM ProjectInfo WHERE id=%s;', (pid,))
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        connect.close()
        return 0
    rep_id = rows[0][0]
    cur.close()
#    connect.close()
    model_json = UpdateServiceJSON.LoadHeadRevision(rep_id)
#    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('UPDATE ProjectInfo SET xml=%s WHERE id=%s;', (model_json, pid))
    connect.commit()
    cur.close()
    connect.close()
    return model_json

def update_to_version(user, pid, version):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT rep_id FROM ProjectInfo WHERE id=%s;', (pid,))
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        connect.close()
        return 0
    rep_id = rows[0][0]
    cur.close()
#    connect.close()
    model_json = UpdateServiceJSON.LoadRevision(rep_id, version)
#    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('UPDATE ProjectInfo SET xml=%s WHERE id=%s;', (model_json, pid))
    connect.commit()
    cur.close()
    connect.close()
    return model_json

'''
リポジトリからプロジェクトにモデルデータをコピーする。
プロジェクトとリポジトリを関連づける。
'''
def checkout(user, rep_id, pid):
    RepositoryService.checkout(rep_id, pid)
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('UPDATE ProjectInfo SET rep_id=%s WHERE id=%s;', (rep_id, pid))
    connect.commit()
    cur.close()
    connect.close()
    update(user, pid)
    

def improt_to_rep(user, pid, rep_id):
    pass

def export_from_rep(user, pid, rep_id):
    pass

'''
リポジトリを作成する。
'''
def create_rep(user, rep_name):
    return RepositoryService.CreateRepository(user, rep_name)

def clear_rep(user, rep_id):
    return RepositoryService.clearRepository(user, rep_id)

def delete_rep(user, rep_id):
    return RepositoryService.deleteRepository(user, rep_id)

def rep_list(user):
    return RepositoryService.rep_list()

def user_rep_list(user):
    pass

def group_rep_list(user):
    pass

def get_history():
    pass