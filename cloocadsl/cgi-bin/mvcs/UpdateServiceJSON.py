# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import re
import sys
import json
import config

connect = None

def GetHeadRevision(rep_id):
    global connect
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT version FROM model WHERE id=%s;', (rep_id,))
    model_rows = cur.fetchall()
    cur.close()
    connect.close()
    if len(model_rows) == 0:
        return -1
    return model_rows[0][0]

#update workspace to revision
def LoadHeadRevision(rep_id):
    global connect
    connect = MySQLdb.connect(db=config.REP_DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT head_version FROM Repository WHERE id=%s;', (rep_id,))
    rows = cur.fetchall()
    cur.close()
    if len(rows) == 0:
        connect.close()
        return False
    model_json = json.dumps(LoadModel(rep_id, rows[0][0]))
    connect.close()
    return model_json

def LoadRevision(rep_id, ver):
    global connect
    connect = MySQLdb.connect(db=config.REP_DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT head_version FROM Repository WHERE id=%s;', (rep_id,))
    rows = cur.fetchall()
    cur.close()
    if len(rows) == 0:
        connect.close()
        return False
    if ver <= rows[0][0]:
        return False
    model_json = json.dumps(LoadModel(rep_id, ver))
    connect.close()
    return model_json

def LoadModelOfHead(id):
    cur = connect.cursor()
    cur.execute('SELECT id,current_version,root FROM model WHERE id=%s;', (id,))
    rows = cur.fetchall()
    if len(rows) == 0:
        return None
    model = {}
    model['id'] = rows[0][0]
    model['current_version'] = str(rows[0][1])
    model['root'] = LoadDiagram(rows[0][2], id, rows[0][1])
    cur.close()
    return model

def LoadModel(id, ver):
    global g_model_id
    global g_version
    g_model_id = id
    g_version = ver
    cur = connect.cursor()
    cur.execute('SELECT id,version,root FROM model WHERE id=%s;', (id,))
    rows = cur.fetchall()
    if len(rows) == 0:
        return None
    model = {}
    global g_model
    g_model = model
    model['id'] = int(rows[0][0])
    model['current_version'] = str(ver)
    model['root'] = rows[0][2]
    model['properties'] = LoadPropertyEntities()
    model['diagrams'] = LoadDiagramEntities()
    model['objects'] = LoadObjectEntities()
    model['relationships'] = LoadRelationshipEntities()
    cur.close()
    return model

def LoadDiagramEntities():
    cur = connect.cursor()
    cur.execute('SELECT id, version FROM diagram WHERE model_id=%s AND version<=%s;', (g_model_id, g_version, ))
    rows = cur.fetchall()
    #各IDの最新バージョンを取得
    idmap = {}
    for i in range(len(rows)):
        if not idmap.has_key(str(rows[i][0])):
            idmap[str(rows[i][0])] = []
        idmap[str(rows[i][0])].append(rows[i][1])
    diagrams = {}
    for id in idmap.keys():
        idmap[id].sort()
        idmap[id].reverse()
        latest_ver = idmap[id][0]
        cur.execute('SELECT id,meta_id,version,model_id FROM diagram WHERE id=%s AND model_id=%s AND version=%s;', (id, g_model_id, latest_ver, ))
        rows = cur.fetchall()
        diagram = {}
        diagram['id'] = int(rows[0][0])
        diagram['meta_id'] = int(rows[0][1])
        diagram['ve'] = {}
        diagram['ve']['ver_type'] = 'none'
        diagram['ve']['version'] = int(rows[0][2])
        diagram['objects'] = []
        diagram['relationships'] = []
        cur.execute('SELECT object_id FROM has_object WHERE diagram_id=%s AND model_id=%s AND version=%s;', (id,g_model_id,latest_ver))
        rows = cur.fetchall()
        for i in range(len(rows)):
            diagram['objects'].append(rows[i][0])
        cur.execute('SELECT relationship_id FROM has_relationship WHERE diagram_id=%s AND model_id=%s AND version=%s;', (id,g_model_id,latest_ver))
        rows = cur.fetchall()
        for i in range(len(rows)):
            diagram['relationships'].append(rows[i][0])
        diagrams[str(diagram['id'])] = diagram
    cur.close()
    return diagrams

def calLatestVersion(rows):
    idmap = {}
    for i in range(len(rows)):
        if not idmap.has_key(str(rows[i][0])):
            idmap[str(rows[i][0])] = []
        idmap[str(rows[i][0])].append(rows[i][1])
    return idmap

def LoadObjectEntities():
    objects = {}
    cur = connect.cursor()
    cur.execute('SELECT id,version FROM object WHERE model_id=%s AND version<=%s;', (g_model_id, g_version))
    rows = cur.fetchall()
    idmap = {}
    for i in range(len(rows)):
        if not idmap.has_key(str(rows[i][0])):
            idmap[str(rows[i][0])] = []
        idmap[str(rows[i][0])].append(rows[i][1])
    xml = ''
    for id in idmap.keys():
        idmap[id].sort()
        idmap[id].reverse()
        latest_version = idmap[id][0]
        cur.execute('SELECT id,meta_id,x,y,version,ver_type FROM object WHERE model_id=%s AND id=%s AND version=%s;', (g_model_id, int(id), latest_version))
        obj_rows = cur.fetchall()
        if not obj_rows[0][5] == 2:
            object = {}
            meta_id = int(obj_rows[0][1])
            object['id'] = int(obj_rows[0][0])
            object['meta_id'] = meta_id
            object['bound'] = {}
            object['bound']['x'] = int(obj_rows[0][2])
            object['bound']['y'] = int(obj_rows[0][3])
            object['bound']['width'] = 50
            object['bound']['height'] = 50
            object['ve'] = {}
            object['ve']['ver_type'] = 'none'
            object['ve']['version'] = int(obj_rows[0][5])
            cur.execute('SELECT property_id FROM has_property WHERE parent_id=%s AND model_id=%s AND version=%s;', (object['id'], g_model_id, latest_version))
            property_rows = cur.fetchall()
            object['properties'] = []
            proplist = {}
            for i in range(len(property_rows)):
                property_id = int(property_rows[i][0])
                meta_id = g_model['properties'][str(property_id)]['meta_id']
                if proplist.has_key(meta_id):
                    proplist[meta_id].append(property_id)
                else:
                    proplist[meta_id] = [property_id]
            for key in proplist.keys():
                object['properties'].append({'meta_id':key,'children':proplist[key]})
            objects[str(object['id'])] = object
    cur.close()
    return objects

def LoadRelationshipEntities():
    objects = {}
    cur = connect.cursor()
    cur.execute('SELECT id,version FROM relationship WHERE model_id=%s AND version<=%s;', (g_model_id, g_version))
    rows = cur.fetchall()
    idmap = {}
    for i in range(len(rows)):
        if not idmap.has_key(str(rows[i][0])):
            idmap[str(rows[i][0])] = []
        idmap[str(rows[i][0])].append(rows[i][1])
    xml = ''
    for id in idmap.keys():
        idmap[id].sort()
        idmap[id].reverse()
        latest_version = idmap[id][0]
        cur.execute('SELECT id,meta_id,src,dest,version,ver_type,points FROM relationship WHERE model_id=%s AND id=%s AND version=%s;', (g_model_id, int(id), latest_version))
        obj_rows = cur.fetchall()
        if not obj_rows[0][5] == 2:
            object = {}
            meta_id = int(obj_rows[0][1])
            object['id'] = int(obj_rows[0][0])
            object['meta_id'] = meta_id
            object['src'] = int(obj_rows[0][2])
            object['dest'] = int(obj_rows[0][3])
            object['points'] = []
            object['ve'] = {}
            object['ve']['ver_type'] = 'none'
            object['ve']['version'] = int(obj_rows[0][5])
            cur.execute('SELECT property_id FROM has_property WHERE parent_id=%s AND model_id=%s AND version=%s;', (object['id'], g_model_id, latest_version))
            property_rows = cur.fetchall()
            object['properties'] = []
            proplist = {}
            for i in range(len(property_rows)):
                property_id = int(property_rows[i][0])
                meta_id = g_model['properties'][str(property_id)]['meta_id']
                if proplist.has_key(meta_id):
                    proplist[meta_id].append(property_id)
                else:
                    proplist[meta_id] = [property_id]
            for key in proplist.keys():
                object['properties'].append({'meta_id':key,'children':proplist[key]})
            objects[str(object['id'])] = object
    cur.close()
    return objects

def LoadDiagram(id, project_id, ver):
    diagram = {}
    cur = connect.cursor()
    cur.execute('SELECT id,meta_id,version,model_id FROM diagram WHERE id=%s AND model_id=%s AND version<=%s;', (id, project_id, ver))
    rows = cur.fetchall()
    xml=''
    if len(rows) == 0:
        return None
    meta_id = int(rows[0][1])
    diagram['id'] = int(rows[0][0])
    diagram['meta_id'] = int(rows[0][1])
    diagram['ve'] = {}
    diagram['ve']['ver_type'] = 'none'
    diagram['ve']['version'] = int(rows[0][2])
    diagram['objects'] = LoadObjects(id, project_id, ver)
    diagram['relationships'] = LoadRelationships(id, project_id, ver)
    cur.close()
    return diagram

def LoadPropertyEntities():
    properties = {}
    cur = connect.cursor()
    cur.execute('SELECT id,version FROM property WHERE model_id=%s AND version<=%s;', (g_model_id, g_version))
    rows = cur.fetchall()
    idmap = {}
    for i in range(len(rows)):
        if not idmap.has_key(str(rows[i][0])):
            idmap[str(rows[i][0])] = []
        idmap[str(rows[i][0])].append(rows[i][1])
    for id in idmap.keys():
        idmap[id].sort()
        idmap[id].reverse()
        cur.execute('SELECT id,meta_id,content,version,ver_type FROM property WHERE id=%s AND model_id=%s AND version=%s;', (str(id), g_model_id, idmap[id][0]))
        prop_rows = cur.fetchall()
        meta_id = int(prop_rows[0][1])
        property = {}
        property['id'] = int(prop_rows[0][0])
        property['meta_id'] = meta_id
        property['value'] = prop_rows[0][2]
        property['ve'] = {}
        property['ve']['ver_type'] = 'none'
        property['ve']['version'] = int(prop_rows[0][3])
        properties[str(property['id'])] = property
    cur.close()
    return properties
