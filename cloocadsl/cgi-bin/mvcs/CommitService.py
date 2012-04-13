# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import re
import sys
import json
sys.path.append('../')
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

'''
 ワークスペースからモデルリポジトリにコミットする。
'''
def commit(rep_id, model_json):
    #select project xml
    global connect
    connect = MySQLdb.connect(db=config.REP_DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    #最新バージョンじゃないとだめ
    cur.execute('SELECT id,model_id,head_version FROM Repository WHERE id=%s;', (rep_id))
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        connect.close()
        return 0
    model_id = rows[0][1]
    head_version = int(rows[0][2])
    model = json.loads(model_json)
    if int(model['current_version']) == head_version:
        if InsertJSON2REP(model, model_id):
            cur = connect.cursor()
            cur.execute('UPDATE Repository SET head_version=%s WHERE id=%s;', (next_version,rep_id,))
            connect.commit()
            cur.close()
            connect.close()
            return 1
        else:
            return 3
    else:
        cur.close()
        connect.close()
        return 2

def InsertJSON2REP(model, mid):
    global model_id
    global g_model
    model_id = mid
    g_model = model
    return parse_model_JSON(g_model)

def parse_model_JSON(model):
    id = model['id']
    version = int(model['current_version'])
    global next_version
    next_version = version + 1
    edited = False
    for key in model['diagrams']:
        if parseDiagramJSON(model['diagrams'][key]):
            edited = True
    for key in model['objects']:
        if parseObjectJSON(model['objects'][key]):
            edited = True
    for key in model['relationships']:
        if parseRelationshipJSON(model['relationships'][key]):
            edited = True
    for key in model['properties']:
        if parsePropertyJSON(model['properties'][key]):
            edited = True
    if not edited:
        return False
    root = model['root']
    cur = connect.cursor()
    cur.execute('UPDATE model SET root=%s,version=%s WHERE id=%s;', (root,next_version,model_id,))
    connect.commit()
    cur.close()
    return True

def parseDiagramJSON(diagram):
    cur = connect.cursor()
    edited = False
    id = diagram['id']
    meta_id = diagram['meta_id']
    edited_type = diagram['ve']['ver_type']
    version = int(diagram['ve']['version'])
    cur.execute('DELETE FROM has_object WHERE diagram_id=%s AND model_id=%s AND version=%s;', (id,model_id,next_version))
    cur.execute('DELETE FROM has_relationship WHERE diagram_id=%s AND model_id=%s AND version=%s;', (id,model_id,next_version))
    connect.commit()
    insert_datas = []
    for obj_id in diagram['objects']:
#        cur.execute('INSERT INTO has_object (diagram_id,object_id,model_id,version) VALUES(%s,%s,%s,%s);', (id,obj_id,model_id,next_version))
        insert_datas.append((id,obj_id,model_id,next_version))
    cur.executemany('INSERT INTO has_object (diagram_id,object_id,model_id,version) VALUES(%s,%s,%s,%s);', insert_datas)
    insert_datas = []
    for rel_id in diagram['relationships']:
#        cur.execute('INSERT INTO has_relationship (diagram_id,relationship_id,model_id,version) VALUES(%s,%s,%s,%s);', (id,rel_id,model_id,next_version))
        insert_datas.append((id,obj_id,model_id,next_version))
    cur.executemany('INSERT INTO has_relationship (diagram_id,relationship_id,model_id,version) VALUES(%s,%s,%s,%s);', insert_datas)
    connect.commit()
    if edited_type == 'update':
        cur.execute('DELETE FROM diagram where id=%s AND model_id=%s AND version=%s;', (id,model_id,next_version))
        connect.commit()
        cur.execute('INSERT INTO diagram (id,meta_id,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s);', (id,meta_id,model_id,next_version,0))
        connect.commit()
    elif edited_type == 'add':
        cur.execute('DELETE FROM diagram where id=%s AND model_id=%s AND version=%s;', (id,model_id,next_version))
        connect.commit()
        cur.execute('INSERT INTO diagram (id,meta_id,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s);', (id,meta_id,model_id,next_version,1))
        connect.commit()
    elif edited_type == 'delete':
        cur.execute('DELETE FROM diagram where id=%s AND model_id=%s AND version=%s;', (id,model_id,next_version))
        connect.commit()
        cur.execute('INSERT INTO diagram (id,meta_id,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s);', (id,meta_id,model_id,next_version,2))
        connect.commit()
    else:
        pass
    if not edited_type == 'none':
        edited = True
    cur.close()
    return edited

def parseObjectJSON(obj):
    edited = False
    id = obj['id']
    meta_id = obj['meta_id']
    x = obj['bound']['x']
    y = obj['bound']['y']
    edited_type = obj['ve']['ver_type']
    version = int(obj['ve']['version'])
    if not edited_type == 'delete':
        cur = connect.cursor()
        cur.execute('DELETE FROM has_property WHERE parent_id=%s AND model_id=%s AND version=%s;', (id,model_id,next_version))
        connect.commit()
        cur.close()
        for e in obj['properties']:
            if parsePropertyListJSON(e, id):
                children_edited = True
    if edited_type == 'update':
        cur = connect.cursor()
        cur.execute('DELETE FROM object where id=%s AND model_id=%s AND version=%s;', (id,model_id,next_version))
        connect.commit()
        cur.execute('INSERT INTO object (id,meta_id,x,y,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s,%s);', (id,meta_id,x,y,model_id,next_version,0))
        connect.commit()
        cur.close()
        return True
    elif edited_type == 'add':
        cur = connect.cursor()
        cur.execute('DELETE FROM object where id=%s AND model_id=%s AND version=%s;', (id,model_id,next_version))
        connect.commit()
        cur.execute('INSERT INTO object (id,meta_id,x,y,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s,%s);', (id,meta_id,x,y,model_id,next_version,1))
        connect.commit()
        cur.close()
        return True
    elif edited_type == 'delete':
        cur = connect.cursor()
        cur.execute('INSERT INTO object (id,meta_id,x,y,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s,%s);', (id,meta_id,x,y,model_id,next_version,2))
        connect.commit()
        cur.close()
        return True
    else:
        return False
    if not edited_type == 'none':
        edited = True
    return edited

def parseRelationshipJSON(rel):
    edited = False
    id = rel['id']
    meta_id = rel['meta_id']
    src = rel['src']
    dest = rel['dest']
    edited_type = rel['ve']['ver_type']
    version = int(rel['ve']['version'])
    if not edited_type == 'delete':
        cur = connect.cursor()
        cur.execute('DELETE FROM has_property WHERE parent_id=%s AND model_id=%s AND version=%s;', (id,model_id,next_version))
        connect.commit()
        cur.close()
        for e in rel['properties']:
            if parsePropertyListJSON(e, id):
                children_edited = True
    if edited_type == 'update':
        cur = connect.cursor()
        cur.execute('DELETE FROM relationship where id=%s AND model_id=%s AND version=%s;', (id,model_id,next_version))
        connect.commit()
        cur.execute('INSERT INTO relationship (id,meta_id,src,dest,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s,%s);', (id,meta_id,src,dest,model_id,next_version,0))
        connect.commit()
        cur.close()
        return True
    elif edited_type == 'add':
        cur = connect.cursor()
        cur.execute('DELETE FROM relationship where id=%s AND model_id=%s AND version=%s;', (id,model_id,next_version))
        connect.commit()
        cur.execute('INSERT INTO relationship (id,meta_id,src,dest,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s,%s);', (id,meta_id,src,dest,model_id,next_version,1))
        connect.commit()
        cur.close()
        return True
    elif edited_type == 'delete':
        cur = connect.cursor()
        cur.execute('INSERT INTO relationship (id,meta_id,src,dest,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s,%s);', (id,meta_id,src,dest,model_id,next_version,2))
        connect.commit()
        cur.close()
        return True
    else:
        return False
    if not edited_type == 'none':
        edited = True
    return edited


def parsePropertyListJSON(plist, parent_id):
    cur = connect.cursor()
    children_edited = False
    meta_id = plist['meta_id']
    for prop_id in plist['children']:
        cur.execute('INSERT INTO has_property (parent_id,property_id,model_id,version) VALUES(%s,%s,%s,%s);', (parent_id,prop_id,model_id,next_version))
        connect.commit()
    cur.close()
    return children_edited

def parsePropertyJSON(prop):
    edited = False
    id = prop['id']
    meta_id = prop['meta_id']
    content = prop['value']
    edited_type = prop['ve']['ver_type']
    version = int(prop['ve']['version'])
    if edited_type == 'update':
        cur = connect.cursor()
        cur.execute('DELETE FROM property where id=%s AND model_id=%s AND version=%s;', (id,model_id,next_version))
        connect.commit()
        cur.execute('INSERT INTO property (id,meta_id,content,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s);', (id,meta_id,content,model_id,next_version,0))
        connect.commit()
        cur.close()
        return True
    elif edited_type == 'add':
        cur = connect.cursor()
        cur.execute('DELETE FROM property where id=%s AND model_id=%s AND version=%s;', (id,model_id,next_version))
        connect.commit()
        cur.execute('INSERT INTO property (id,meta_id,content,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s);', (id,meta_id,content,model_id,next_version,1))
        connect.commit()
        cur.close()
        return True
    elif edited_type == 'delete':
        cur = connect.cursor()
        cur.execute('INSERT INTO property (id,meta_id,content,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s);', (id,meta_id,content,model_id,next_version,2))
        connect.commit()
        cur.close()
        return True
    else:
        pass
    if not edited_type == 'none':
        edited = True
    return edited
