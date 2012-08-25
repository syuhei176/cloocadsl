# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import re
import sys
import datetime
import json
import config
import difflib

g_tool_key = ''
g_version = 0
g_need_merge = False

def update_impl(connect, user, tool_key, version, need_merge):
    global g_tool_key
    g_tool_key = tool_key
    global g_version
    g_version = version
    global g_need_merge
    g_need_merge = need_merge
    metamodel = update_packages(connect)
    update_template(connect, user, tool_key)
    cur = connect.cursor()
    if need_merge and g_version > 1:
        g_version = g_version - 1
        metamodel_base = update_packages(connect)
        cur.execute('SELECT metamodel FROM tool_workspace WHERE tool_uri=%s AND user_id=%s;', (tool_key, user['id'], ))
        row = cur.fetchone()
        if not row == None:
            metamodel = merge(metamodel, json.loads(row[0]), metamodel_base)
    num_of_affected_row = cur.execute('UPDATE tool_workspace SET metamodel=%s,current_version=%s WHERE tool_uri=%s AND user_id=%s;', (json.dumps(metamodel).encode('utf-8'), version, tool_key, user['id'], ))
    connect.commit()
    cur.close()
    return {'metamodel':metamodel}

def update_packages(connect):
    packages = []
    cur = connect.cursor()
    cur.execute('SELECT package_uri FROM metapackage WHERE tool_key=%s;',(g_tool_key, ))
    rows = cur.fetchall()
    package_keys = {}
    for i in range(len(rows)):
        package_keys[rows[i][0]] = 0
    for package_uri in package_keys:
        cur.execute('SELECT package_uri,lang_type,content,name,parent_uri,op,version FROM metapackage WHERE tool_key=%s AND package_uri=%s AND version <= %s ORDER BY version DESC LIMIT 1;',(g_tool_key, package_uri, g_version, ))
        row = cur.fetchone()
        if row == None:
            continue
        package_uri = row[0]
        lang_type = int(row[1])
        content = row[2]
        name = row[3]
        parent_uri = row[4]
        op = row[5]
        version = row[6]
        if op == 3:
            continue
        if lang_type == 0:
            packages.append(update_dsl(connect, package_uri, content, name, parent_uri, version))
        elif lang_type == 1:
            packages.append(update_dsml(connect, package_uri, content, name, parent_uri, version))
    cur.close()
    #packagesの処理
    metamodel = array2tree(packages)
    metamodel['toolkey'] = str(g_tool_key)
    return metamodel

def array2tree(L):
    #reduce(lambda a,b: a+[b] if b > 3 else [], L, [])
    p = {}
    p['nestingPackages'] = {}
    for i in L:
        uris = i['parent_uri'].split('.')
        if len(uris) == 1:
            p['nestingPackages'][i['name']] = i
    return p

update_dsl = (lambda connect, package_uri, content, name, parent_uri, version :
              {'name':name,
               'parent_uri':parent_uri,
               'content':json.loads(content),
               'lang_type':'dsl',
               'nestingPackages':{},
               'version':version,
               'modified_after_commit':False,
               'op':'none'})

update_dsml = (lambda connect, package_uri, content, name, parent_uri, version :
               {'name':name,
                'parent_uri':parent_uri,
                'content':json.loads(content),
                'lang_type':'dsml',
                'nestingPackages':{},
                'version':version,
                'modified_after_commit':False,
                'op':'none'})

def update_template(connect, user, tool_key):
    #ワークスペースの削除
    cur = connect.cursor()
    cur.execute('DELETE FROM template_workspace WHERE tool_uri=%s AND user_id=%s;', ( tool_key, user['id'], ))
    cur.execute('SELECT name FROM template WHERE tool_key=%s;',(g_tool_key, ))
    rows = cur.fetchall()
    package_keys = {}
    for i in range(len(rows)):
        package_keys[rows[i][0]] = 0
    for name in package_keys:
        cur.execute('SELECT tool_key,name,version,package_uri,content FROM template WHERE tool_key=%s AND name=%s AND version <= %s ORDER BY version DESC LIMIT 1;',(g_tool_key, name, g_version, ))
        row = cur.fetchone()
        if not row == None:
            name = row[1]
            version = row[2]
            package_uri = row[3]
            content = row[4]
            cur.execute('INSERT INTO template_workspace (tool_uri,user_id,name,package_uri,content,is_modified,version) VALUES(%s,%s,%s,%s,%s,%s,%s);',(tool_key, user['id'], name, package_uri, content, 0, version, ))
    connect.commit()
    cur.close()
    return True

def merge(rep, ws, base):
    a = {}
    for key in rep['nestingPackages']:
        if not a.has_key(key):
            a[key] = {}
            a[key]['rep'] = False
            a[key]['ws'] = False
            a[key]['base'] = False
        a[key]['rep'] = True
    for key in ws['nestingPackages']:
        if not a.has_key(key):
            a[key] = {}
            a[key]['rep'] = False
            a[key]['ws'] = False
            a[key]['base'] = False
        a[key]['ws'] = True
    for key in base['nestingPackages']:
        if not a.has_key(key):
            a[key] = {}
            a[key]['rep'] = False
            a[key]['ws'] = False
            a[key]['base'] = False
        a[key]['base'] = True
    """
    a,d,uでもう一度
    rep ws  base
    x   x   x    -
    o   x   x    repを反映
    x   o   x    wsを反映
    x   x   o    wsを反映
    o   o   x    wsとrepをマージ
    o   x   o    wsを反映（削除を反映）
    x   o   o    repを反映（削除を反映）
    o   o   o    wsとrepをマージ、そのまま
    """
    for key in a:
        if a[key]['rep'] and not a[key]['ws'] and not a[key]['base']:
            ws['nestingPackages'][key] = rep['nestingPackages'][key]
        if not a[key]['rep'] and a[key]['ws'] and not a[key]['base']:
            pass
        if not a[key]['rep'] and not a[key]['ws'] and a[key]['base']:
            pass
        if a[key]['rep'] and a[key]['ws'] and not a[key]['base']:
            ws['nestingPackages'][key] = merge_package(rep['nestingPackages'][key], ws['nestingPackages'][key], None)
        if a[key]['rep'] and not a[key]['ws'] and a[key]['base']:
            pass
        if not a[key]['rep'] and a[key]['ws'] and a[key]['base']:
            del ws['nestingPackages'][key]
        if a[key]['rep'] and a[key]['ws'] and a[key]['base']:
            ws['nestingPackages'][key] = merge_package(rep['nestingPackages'][key], ws['nestingPackages'][key], base['nestingPackages'][key])
    return ws

def merge_package(src, dest, base):
    if not src['lang_type'] == dest['lang_type']:
        return dest
    if src['lang_type'] == 'dsl':
        return merge_dsl(src, dest, base)
    if src['lang_type'] == 'dsml':
        return merge_dsml(src, dest)
    return dest

def merge_dsl(src, dest, base):
    dest['content'] = merge_text(src['content'], dest['content'], base)
    #print dest['content']
    return dest


def merge_text(src, dest, base):
    """
    テキストマージアルゴリズム
    """
    src_lines = src.splitlines()
    dest_lines = dest.splitlines()
    diff = difflib.ndiff(src_lines, dest_lines)
    a = []
    for l in diff:
        if l[0] == ' ':
            a.append(l[2:])
        else:
            a.append(l)
    return '\n'.join(a)

def merge_dsml(src, dest):
    return src
