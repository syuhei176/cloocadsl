# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import re
import sys
import datetime
import json
import config

def parse_structure(metamodel):
    for key in metamodel['nestingPackages']:
        if not parse_structure_part(metamodel['nestingPackages'][key]):
            return False
    return True

def parse_structure_part(package):
    if False:
        return False
    for key in package['nestingPackages']:
        if not parse_structure_part(package['nestingPackages'][key]):
            return False
    return True

next_version = 0
g_tool_key = ''

"""
コミット操作
変更されたメタモデルとノーテーションとテンプレートをバージョン管理テーブルに挿入する。
"""
def commit_impl(connect, user, metamodel, tool_key, l_next_version, comment):
    global g_tool_key
    g_tool_key = tool_key
    global next_version
    next_version = l_next_version
    if not parse_structure(metamodel):
        return 3
    if commit_elements(connect, user, tool_key, metamodel) == False:
        return 4
    cur = connect.cursor()
    d = datetime.datetime.today()
    cur.execute('INSERT INTO tool_commit (tool_key,version,comment,date) VALUES(%s,%s,%s,%s);',(g_tool_key, next_version, comment.encode('utf-8'), d.strftime("%Y-%m-%d"), ))
    cur.execute('UPDATE tool_info SET head_version=%s,updated_date=%s WHERE tool_uri=%s;', (next_version, d.strftime("%Y-%m-%d"), tool_key, ))
    connect.commit()
    cur.close()
    return 5

modify_one_package = False

def commit_elements(connect, user, toolkey, metamodel):
    global modify_one_package
    modify_one_package = False
    commit_package(connect, metamodel)
    commit_template(connect, user, toolkey)
    return modify_one_package

def commit_package(connect, metamodel):
    for key in metamodel['nestingPackages']:
        commit_package_part(connect, metamodel['nestingPackages'][key])

def commit_package_part(connect, package):
    if package['lang_type'] == 'dsl':
        commit_dsl(connect, package)
    if package['lang_type'] == 'dsml':
        commit_dsml(connect, package)
    for key in package['nestingPackages']:
        commit_package_part(connect, package['nestingPackages'][key])

def commit_dsl(connect, package):
    #パッケージが修正されていれば、フラグを立てる
    if not package.has_key('op'):
        return
    if package['op'] == 'none':
        return
    global modify_one_package
    modify_one_package = True
    #実際にデータベースにテーブルを挿入する
    cur = connect.cursor()
    package_uri = package['parent_uri'] + '.' + package['name']
    if package['op'] == 'add':
        op = 1
    elif package['op'] == 'update':
        op = 2
    elif package['op'] == 'del':
        op = 3
    else:
        op = 0
    if not op == 0:
        cur.execute('INSERT INTO metapackage (tool_key,package_uri,lang_type,version,content,name,parent_uri,op) VALUES(%s,%s,%s,%s,%s,%s,%s,%s);',(g_tool_key, package_uri, 0, next_version, json.dumps(package['content']).encode('utf-8'), package['name'], package['parent_uri'], op, ))
    cur.close()

def commit_dsml(connect, package):
    #パッケージが修正されていれば、フラグを立てる
    if not package.has_key('op'):
        return
    if package['op'] == 'none':
        return
    global modify_one_package
    modify_one_package = True
    #実際にデータベースにテーブルを挿入する
    cur = connect.cursor()
    package_uri = package['parent_uri'] + '.' + package['name']
    cur.execute('INSERT INTO metapackage (tool_key,package_uri,lang_type,version,content,name,parent_uri) VALUES(%s,%s,%s,%s,%s,%s,%s);',(g_tool_key, package_uri, 1, next_version, json.dumps(package['content']).encode('utf-8'), package['name'], package['parent_uri'], ))
    cur.close()

def commit_notation(connect, notation):
    cur = connect.cursor()
#    cur.execute('INSERT INTO notation (uri, content) VALUES(%s);',(package['uri'] + '.' + package['name'], package['text'].encode('utf-8'), ))
    cur.close()

def commit_template(connect, user, tool_key):
    cur = connect.cursor()
    cur.execute('SELECT id,user_id,tool_uri,name,package_uri,content,is_modified FROM template_workspace WHERE user_id=%s AND tool_uri=%s;',(user['id'], tool_key))
    rows = cur.fetchall()
    cur.close()
    for i in range(len(rows)):
        if int(rows[i][6]) == 1:
            commit_one_template(connect, rows[i][2], rows[i][3], rows[i][4], rows[i][5])

def commit_one_template(connect, tool_key, name, package_uri, content):
    global modify_one_package
    modify_one_package = True
    cur = connect.cursor()
    cur.execute('INSERT INTO template (tool_key,name,version,package_uri,content) VALUES(%s,%s,%s,%s,%s);',(tool_key, name, next_version, package_uri, content))
    cur.close()
