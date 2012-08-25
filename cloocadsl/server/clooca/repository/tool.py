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

def fetchFromDB():
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    for i in range(10):
        yield n
        n += 1
    connect.close()

"""
"""
def getMyWritableTools(connect, user):
    cur = connect.cursor()
    cur.execute('SELECT id,tool_info.tool_uri,name,head_version,owner_id FROM tool_info INNER JOIN user_has_tool ON user_has_tool.tool_uri = tool_info.tool_uri AND user_has_tool.user_id = %s AND user_has_tool.permission = 1 ORDER BY tool_info.updated_date DESC;', (user['id'], ))
    rows = cur.fetchall()
    cur.close()
    return reduce(lambda a,b: [{'id':b[0],
                               'tool_key':b[1],
                               'name':b[2].decode('utf-8'),
                               'head_version':b[3],
                               'owner_id':b[4],
                               }] + a, rows, [])

def getMyReadableTools(connect, user):
    cur = connect.cursor()
    cur.execute('SELECT id,tool_info.tool_uri,name,head_version,owner_id FROM tool_info INNER JOIN user_has_tool ON user_has_tool.tool_uri = tool_info.tool_uri AND user_has_tool.user_id = %s;', (user['id'], ))
    rows = cur.fetchall()
    cur.close()
    return reduce(lambda a,b: [{'id':b[0],'tool_key':b[1],'name':b[2].decode('utf-8'),'head_version':b[3],'owner_id':b[4],}] + a, rows, [])

def getToolInfo(connect, user, tool_key):
    cur = connect.cursor()
    cur.execute('SELECT id,tool_uri,name,head_version,created_date,owner_id FROM tool_info WHERE tool_uri=%s', (tool_key, ))
    row = cur.fetchone()
    cur.close()
    tool = {}
    tool['id'] = row[0]
    tool['tool_key'] = row[1]
    tool['name'] = row[2].decode('utf-8')
    tool['head_version'] = row[3]
    tool['created_date'] = str(row[4])
    tool['owner_id'] = row[5]
    return tool

"""
ツールの作成
"""
def create(connect, user, tool_key, tool_name, vis):
    cur = connect.cursor()
    cur.execute('SELECT COUNT(*) FROM tool_info WHERE tool_uri=%s;', (tool_key, ))
    tool_count = cur.fetchone()[0]
    if tool_count != 0:
        cur.close()
        return False
    d = datetime.datetime.today()
    if vis == 'true':
        visibillity = 1
    else:
        visibillity = 0
    cur.execute('INSERT INTO tool_info (tool_uri,name,created_date,head_version,owner_id,visibillity) VALUES(%s,%s,%s,%s,%s,%s);',(tool_key, tool_name.encode('utf-8'), d.strftime("%Y-%m-%d"), 1, user['id'], visibillity))
    tool_id = cur.lastrowid
    cur.execute('INSERT INTO user_has_tool (user_id,tool_uri,permission,is_bought) VALUES(%s,%s,%s,%s);',(user['id'], tool_key, 1, 0))
    connect.commit()
    cur.close()
    return True

simple_dsl_struct = '''
{nestingPackages:"",importedPackages:""}
'''
simple_dsl_package = '''
{nestingPackages:"",importedPackages:""}
'''

def create_simple_DSL(connect):
    cur.execute('INSERT INTO meta_structure (tool_uri,version,content) VALUES(%s,%s,%s);',(tool_key, 1, simple_dsl))
    cur.execute('INSERT INTO meta_package (tool_uri,name,version,content,lang_type) VALUES(%s,%s,%s,%s,%s);',(tool_key, 'default', 1, simple_dsl_package, 'dsl', ))
    connect.commit()

def create_simple_DSML(connect):
    cur.execute('INSERT INTO tool_info (tool_uri,name,created_date,head_version,owner_id) VALUES(%s,%s,%s,%s,%s);',(tool_key, tool_name.encode('utf-8'), d.strftime("%Y-%m-%d"), 1, user['id']))
    
"""
ワークスペースからツールデータを読み込む
ワークスペースが存在する場合は読み込み
ワークスペースが存在しない場合は、リポジトリからチェックアウト
"""
def load_from_ws(connect, user, tool_key):
    cur = connect.cursor()
    #cur.execute('SELECT metamodel,notation,wellcome_message FROM tool_workspace WHERE tool_uri = %s AND user_id = %s;', (tool_key, user['id'],))
    cur.execute('SELECT tool_uri, metamodel,current_version FROM tool_workspace WHERE tool_uri = %s AND user_id = %s;', (tool_key, user['id'],))
    rows = cur.fetchall()
    cur.close()
    if len(rows) == 0:
        tool = checkout(connect, user, tool_key)
        return tool
    tool = {}
    tool['tool_key'] = rows[0][0]
    tool['metamodel'] = rows[0][1].decode('utf-8')
    #tool['notaion'] = rows[0][1]
    #tool['wellcome_message'] = rows[0][2]
    tool['current_version'] = rows[0][2]
    return tool

"""
"""
def checkout(connect, user, tool_key):
    tool = {}
    cur = connect.cursor()
    cur.execute('SELECT COUNT(*) FROM user_has_tool WHERE user_id=%s AND tool_uri=%s;', (user['id'], tool_key, ))
    has_tool_count = cur.fetchone()[0]
    cur.execute('SELECT name,head_version,visibillity FROM tool_info WHERE tool_uri = %s;', (tool_key, ))
    row = cur.fetchone()
    toolname = row[0]
    rep_version = int(row[1])
    visibillity = int(row[2])
    if has_tool_count == 0:
        if visibillity == 0:
            cur.close()
            return None
        else:
            cur.execute('INSERT INTO user_has_tool (user_id,tool_uri,permission,is_bought) VALUES(%s,%s,%s,%s);',(user['id'], tool_key, 1, 0))
            connect.commit()
    d = datetime.datetime.today()
    cur.execute('INSERT INTO tool_workspace (user_id,tool_uri,checkout_date) VALUES(%s,%s,%s);',(user['id'], tool_key, d.strftime("%Y-%m-%d"), ))
    result = updateImpl.update_impl(connect, user, tool_key, rep_version, False)
    #cur.execute('UPDATE tool_workspace SET metamodel=%s WHERE tool_uri=%s AND user_id=%s;', (result['metamodel'], tool_key, user['id'], ))
    connect.commit()
    cur.close()
    tool['tool_key'] = tool_key
    tool['toolname'] = toolname
    tool['metamodel'] = result['metamodel']
    return tool

"""
"""
def save_to_ws(connect, user, tool_key, metamodel=None, notation=None):
    cur = connect.cursor()
    if not metamodel == None:
        num_of_affected_row = cur.execute('UPDATE tool_workspace SET metamodel=%s WHERE tool_uri=%s AND user_id=%s;', (metamodel.encode('utf-8'), tool_key, user['id'], ))
    if not notation == None:
        num_of_affected_row = cur.execute('UPDATE tool_workspace SET notation=%s WHERE tool_uri=%s AND user_id=%s;', (notation.encode('utf-8'), tool_key, user['id'], ))
    connect.commit()
    cur.close()
    return num_of_affected_row != 0

"""
ツールワークスペースを削除する
"""
def uncheckout(connect, user, tool_key):
    cur = connect.cursor()
    cur.execute('DELETE FROM tool_workspace WHERE tool_uri=%s AND user_id=%s;', (tool_key, user['id'], ))
    connect.commit()
    cur.close()
    return True

"""
ツールを削除する
"""
def delete(connect, user, tool_key):
    cur = connect.cursor()
    cur.execute('SELECT COUNT(*) FROM user_has_tool WHERE user_id=%s AND tool_uri=%s;', (user['id'], tool_key, ))
    has_tool_count = cur.fetchone()[0]
    if has_tool_count == 0:
        cur.close()
        return False
    cur.execute('DELETE FROM tool_info WHERE tool_uri=%s;', (tool_key, ))
    connect.commit()
    cur.close()
    return True

"""
@return: アクセス権なし:0,読み込み専用:1,書き込み権限あり:2
"""
def GetToolAccessInfo(connect, user, tool_key):
    result = 0
    cur = connect.cursor()
    cur.execute('SELECT permission FROM user_has_tool WHERE user_id=%s AND tool_uri=%s;', (user['id'], tool_key, ))
    row = cur.fetchone()
    cur.close()
    if len(row) == 0:
        #アクセス権がない
        result = 0
        return result
    permission = int(row[0])
    return permission + 1

"""
commit
@return: 
"""
def commit(connect, user, tool_key, comment):
    """
    アクセス権の確認
    """
    access_ret = GetToolAccessInfo(connect, user, tool_key)
    if access_ret == 0:
        #権限なし
        return 0
    if access_ret == 1:
        #書き込み権限なし
        return 1
    """
    バージョンの確認
    """
    cur = connect.cursor()
    cur.execute('SELECT current_version,metamodel FROM tool_workspace WHERE user_id=%s AND tool_uri=%s;', (user['id'], tool_key, ))
    row = cur.fetchone()
    workspace_version = int(row[0])
    metamodel_json = row[1].decode('utf-8')
    cur.execute('SELECT head_version FROM tool_info WHERE tool_uri=%s;', (tool_key, ))
    rep_version = int(cur.fetchone()[0])
    cur.close()
    if workspace_version == rep_version:
        metamodel = json.loads(metamodel_json)
        result = commitImpl.commit_impl(connect, user, metamodel, tool_key, rep_version + 1, comment)
        if result == 5:
            result = updateImpl.update_impl(connect, user, tool_key, rep_version + 1, False)
    else:
        #ワークスペースとリポジトリのバージョンが一致していない
        result = 2
    return result

"""
"""
def update(connect, user, tool_key):
    resp = CloocaResponse()
    """
    アクセス権の確認
    """
    access_ret = GetToolAccessInfo(connect, user, tool_key)
    if access_ret == 0:
        #権限なし
        resp.code = 0
        return resp
    cur = connect.cursor()
    cur.execute('SELECT head_version FROM tool_info WHERE tool_uri=%s;', (tool_key, ))
    rep_version = int(cur.fetchone()[0])
    cur.close()
    resp.success = True
    resp.code = 1
    resp.content = updateImpl.update_impl(connect, user, tool_key, rep_version, True)
    return resp

"""
"""
def update_to_ver(connect, user, tool_key, version):
    resp = CloocaResponse()
    """
    アクセス権の確認
    """
    access_ret = GetToolAccessInfo(connect, user, tool_key)
    if access_ret == 0:
        #権限なし
        resp.code = 0
        return resp
    cur = connect.cursor()
    cur.execute('SELECT head_version FROM tool_info WHERE tool_uri=%s;', (tool_key, ))
    rep_version = int(cur.fetchone()[0])
    cur.close()
    if version <= rep_version:
        resp.success = True
        resp.code = 1
        resp.content = updateImpl.update_impl(connect, user, tool_key, version)
    else:
        resp.code = 2
    return resp

"""
"""
def revert(tool_key, version_id):
    return {}
