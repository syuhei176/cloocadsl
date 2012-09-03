# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import re
import sys
import datetime
import config
import json
from clooca.lang import CloocaResponse
from toolimpl import commitImpl,updateImpl
import tool

def getMyWritableProjects(connect, user, toolkey):
    """
    """
    cur = connect.cursor()
    cur.execute('SELECT project_info.id,name,head_version,owner_id FROM project_info INNER JOIN user_has_project ON user_has_project.project_id = project_info.id AND user_has_project.user_id = %s AND user_has_project.permission = 1 AND project_info.toolkey = %s ORDER BY project_info.updated_date DESC;', (user['id'], toolkey, ))
    rows = cur.fetchall()
    cur.close()
    return reduce(lambda a,b: [{'id':b[0],
                               'name':b[1].decode('utf-8'),
                               'head_version':b[2],
                               'owner_id':b[3],
                               }] + a, rows, [])

def getProjectInfo(connect, user, project_id):
    cur = connect.cursor()
    cur.execute('SELECT id,name,head_version,created_date,owner_id,toolkey,tool_tag_id FROM project_info WHERE id = %s;', (project_id, ))
    row = cur.fetchone()
    cur.close()
    if row == None:
        return
    tool = {}
    tool['id'] = row[0]
    tool['name'] = row[1].decode('utf-8')
    tool['head_version'] = row[2]
    tool['created_date'] = str(row[3])
    tool['owner_id'] = row[4]
    tool['toolkey'] = row[5]
    tool['tool_tag_id'] = row[6]
    return tool

def create(connect, user, project_name, tool_key, tool_tag_id):
    """
    プロジェクトの作成
    """
    access_ret = tool.GetToolAccessInfo(connect, user, tool_key)
    if access_ret == 0:
        #ツールへのアクセス権限なし
        return False
    cur = connect.cursor()
    d = datetime.datetime.today()
    cur.execute('INSERT INTO project_info (name,toolkey,tool_tag_id,created_date,head_version,owner_id) VALUES(%s,%s,%s,%s,%s,%s);',(project_name, tool_key, tool_tag_id, d.strftime("%Y-%m-%d"), 1, user['id']))
    project_id = cur.lastrowid
    cur.execute('INSERT INTO user_has_project (user_id,project_id,permission) VALUES(%s,%s,%s);',(user['id'], project_id, 1))
    connect.commit()
    cur.close()
    return True

def load_from_ws(connect, user, project_id):
    """
    ワークスペースからプロジェクトデータを読み込む
    ワークスペースが存在する場合は読み込み
    ワークスペースが存在しない場合は、リポジトリからチェックアウト
    """
    cur = connect.cursor()
    cur.execute('SELECT model FROM project_workspace WHERE project_id = %s AND user_id = %s;', (project_id, user['id'],))
    row = cur.fetchone()
    cur.close()
    if row == None:
        project = checkout(connect, user, project_id)
        return project
    project = {}
    project['model'] = row[0]
    return project

def checkout(connect, user, project_id):
    """
    プロジェクトのチェックアウトを行う
    """
    project = {}
    permission = getProjectAccessInfo(connect, user, project_id)
    cur = connect.cursor()
    cur.execute('SELECT name,head_version,visibillity FROM project_info WHERE id = %s;', (project_id, ))
    row = cur.fetchone()
    toolname = row[0]
    rep_version = int(row[1])
    visibillity = int(row[2])
    if permission == 0 or permission == 1:
        if visibillity == 0:
            cur.close()
            return None
        else:
            #visibillityが1で、ユーザがアクセス権を持っていない場合は、チェックアウト時にアクセス権が付けられる
            cur.execute('INSERT INTO user_has_project (user_id,project_id,permission) VALUES(%s,%s,%s);',(user['id'], project_id, 1))
            connect.commit()
    d = datetime.datetime.today()
    #update rep_version
    cur.execute('INSERT INTO project_workspace (user_id,project_id,checkout_date,model) VALUES(%s,%s,%s,%s);',(user['id'], project_id, d.strftime("%Y-%m-%d"), 'null'))
    connect.commit()
    cur.close()
    return project

def save_to_ws(connect, user, project_id, model):
    """
    """
    cur = connect.cursor()
    num_of_affected_row = cur.execute('UPDATE project_workspace SET model=%s WHERE project_id=%s AND user_id=%s;', (model, project_id, user['id'], ))
    connect.commit()
    cur.close()
    return num_of_affected_row != 0

"""
プロジェクトワークスペースを削除する
"""
def uncheckout(connect, user, project_key):
    cur = connect.cursor()
    cur.execute('DELETE FROM project_workspace WHERE project_key=%s AND user_id=%s;', (project_key, user['id'], ))
    connect.commit()
    cur.close()
    return True

"""
プロジェクトを削除する
"""
def delete(connect, user, project_id):
    permission = getProjectAccessInfo(connect, user, project_id)
    if not permission == 2:
        return False
    cur = connect.cursor()
    cur.execute('DELETE FROM project_info WHERE project_id=%s;', (project_id, ))
    connect.commit()
    cur.close()
    return True

def commit(connect, user, project_id):
    """
    """
    resp = CloocaResponse(0, '', False)
    permission = getProjectAccessInfo(connect, user, project_id)
    if not permission == 2:
        return resp
    resp.code = 1
    cur = connect.cursor()
    current_version, model, checkout_date = getProjectWSFromDB(connect, user, project_id)
    head_version = getProjectInfoFromDB(connect, project_id)
    if current_version == head_version:
        next_version = current_version + 1
        resp.code = 1
        cur.execute('INSERT INTO model (version,content,project_id) VALUES(%s,%s,%s);',(next_version, model, project_id))
        cur.execute('UPDATE project_info SET head_version=%s WHERE id=%s;', (next_version, project_id, ))
        connect.commit()
        resp.success = True
        resp.content = model
    else:
        resp.code = 2
    return resp

def update(connect, user, project_id):
    """
    update head version
    """
    resp = CloocaResponse(0, '', False)
    permission = getProjectAccessInfo(connect, user, project_id)
    if not permission == 2:
        return resp
    resp.code = 1
    cur = connect.cursor()
    current_version, model, checkout_date = getProjectWSFromDB(connect, user, project_id)
    head_version = getProjectInfoFromDB(connect, project_id)
    cur = connect.cursor()
    cur.execute('SELECT content FROM model WHERE version=%s AND project_id=%s',(head_version, project_id))
    row = cur.fetchone()
    if row == None:
        cur.close()
        resp.code = 0
        return resp
    content = row[0]
    #merge model and content
    merged_model = content
    num_of_affected_row = cur.execute('UPDATE project_workspace SET model=%s,current_version=%s WHERE project_id=%s AND user_id=%s;', (merged_model, head_version, project_id, user['id'], ))
    connect.commit()
    cur.close()
    resp.content = content
    return resp

"""
"""
def update_to(project_key, version):
    #update version
    return True

"""
"""
def revert(project_key, version_id):
    return {}

"""
@return: アクセス権なし:0,読み込み専用:1,書き込み権限あり:2
"""
def getProjectAccessInfo(connect, user, project_id):
    result = 0
    cur = connect.cursor()
    cur.execute('SELECT permission FROM user_has_project WHERE user_id=%s AND project_id=%s;', (user['id'], project_id, ))
    row = cur.fetchone()
    cur.close()
    if len(row) == 0:
        #アクセス権がない
        result = 0
        return result
    permission = int(row[0])
    return permission + 1

def getProjectInfoFromDB(connect, project_id):
    cur = connect.cursor()
    cur.execute('SELECT head_version FROM project_info WHERE id=%s;', (project_id, ))
    row = cur.fetchone()
    if row == None:
        return None
    head_version = row[0]
    cur.close()
    return (head_version)

def getProjectWSFromDB(connect, user, project_id):
    cur = connect.cursor()
    cur.execute('SELECT current_version,model,checkout_date FROM project_workspace WHERE user_id=%s AND project_id=%s;', (user['id'], project_id, ))
    row = cur.fetchone()
    if row == None:
        return None
    current_version = row[0]
    model = row[1]
    checkout_date = row[2]
    cur.close()
    return (current_version, model, checkout_date)
