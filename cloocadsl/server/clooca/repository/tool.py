# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import re
import sys
import datetime
import config
import random


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
    cur.execute('SELECT id,tool_info.tool_uri,name,head_version,owner_id FROM tool_info INNER JOIN user_has_tool ON user_has_tool.tool_uri = tool_info.tool_uri AND user_has_tool.user_id = %s AND user_has_tool.permission = 1;', (user['id'], ))
    rows = cur.fetchall()
    cur.close()
    tools = []
    for i in range(len(rows)):
        tool = {}
        tool['id'] = rows[i][0]
        tool['tool_key'] = rows[i][1]
        tool['name'] = rows[i][2].decode('utf-8')
        tool['head_version'] = rows[i][3]
        tool['owner_id'] = rows[i][4]
        tools.append(tool)
    return tools

def getMyReadableTools(connect, user):
    cur = connect.cursor()
    cur.execute('SELECT id,tool_info.tool_uri,name,head_version,owner_id FROM tool_info INNER JOIN user_has_tool ON user_has_tool.tool_uri = tool_info.tool_uri AND user_has_tool.user_id = %s;', (user['id'], ))
    rows = cur.fetchall()
    cur.close()
    tools = []
    for i in range(len(rows)):
        tool = {}
        tool['id'] = rows[i][0]
        tool['tool_key'] = rows[i][1]
        tool['name'] = rows[i][2].decode('utf-8')
        tool['head_version'] = rows[i][3]
        tool['owner_id'] = rows[i][4]
        tools.append(tool)
    return tools

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
def create(connect, user, tool_key, tool_name):
    cur = connect.cursor()
    cur.execute('SELECT COUNT(*) FROM tool_info WHERE tool_uri=%s;', (tool_key, ))
    tool_count = cur.fetchone()[0]
    if tool_count != 0:
        cur.close()
        return False
    d = datetime.datetime.today()
    cur.execute('INSERT INTO tool_info (tool_uri,name,created_date,head_version,owner_id) VALUES(%s,%s,%s,%s,%s);',(tool_key, tool_name.encode('utf-8'), d.strftime("%Y-%m-%d"), 1, user['id']))
    tool_id = cur.lastrowid
    cur.execute('INSERT INTO user_has_tool (user_id,tool_uri,permission,is_bought) VALUES(%s,%s,%s,%s);',(user['id'], tool_key, 1, 0))
    connect.commit()
    cur.close()
    return True

"""
ワークスペースからツールデータを読み込む
ワークスペースが存在する場合は読み込み
ワークスペースが存在しない場合は、リポジトリからチェックアウト
"""
def load_from_ws(connect, user, tool_key):
    cur = connect.cursor()
    #cur.execute('SELECT metamodel,notation,wellcome_message FROM tool_workspace WHERE tool_uri = %s AND user_id = %s;', (tool_key, user['id'],))
    cur.execute('SELECT metamodel FROM tool_workspace WHERE tool_uri = %s AND user_id = %s;', (tool_key, user['id'],))
    rows = cur.fetchall()
    cur.close()
    if len(rows) == 0:
        tool = checkout(connect, user, tool_key)
        return tool
    tool = {}
    tool['metamodel'] = rows[0][0]
    #tool['notaion'] = rows[0][1]
    #tool['wellcome_message'] = rows[0][2]
    return tool

"""
"""
def checkout(connect, user, tool_key):
    tool = {}
    cur = connect.cursor()
    cur.execute('SELECT COUNT(*) FROM user_has_tool WHERE user_id=%s AND tool_uri=%s;', (user['id'], tool_key, ))
    has_tool_count = cur.fetchone()[0]
    if has_tool_count == 0:
        cur.close()
        return None
    cur.execute('SELECT name FROM tool_info WHERE tool_uri = %s;', (tool_key, ))
    rows = cur.fetchall()
    d = datetime.datetime.today()
    cur.execute('INSERT INTO tool_workspace (user_id,tool_uri,checkout_date) VALUES(%s,%s,%s);',(user['id'], tool_key, d.strftime("%Y-%m-%d"), ))
    cur.execute('UPDATE tool_workspace SET metamodel=%s WHERE tool_uri=%s AND user_id=%s;', ('', tool_key, user['id'], ))
    connect.commit()
    cur.close()
    return tool

"""
"""
def save_to_ws(connect, user, tool_key, metamodel):
    cur = connect.cursor()
    num_of_affected_row = cur.execute('UPDATE tool_workspace SET metamodel=%s WHERE tool_uri=%s AND user_id=%s;', (metamodel, tool_key, user['id'], ))
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
"""
def commit(tool_key):
    cur.execute('SELECT COUNT(*) FROM has_tool WHERE user_id=%s AND tool_uri=%s;', (user['id'], tool_key, ))
    has_tool_count = cur.fetchone()[0]
    if has_tool_count == 0:
        cur.close()
        return None
    return True

"""
"""
def update(tool_key):
    return True

"""
"""
def update_to(tool_key, version):
    return True

"""
"""
def revert(tool_key, version_id):
    return {}
