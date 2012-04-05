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
def LoadHeadRevision(project_id):
    #select model by ver
    #model to xml
    global connect
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT rep_id FROM ProjectInfo WHERE id=%s;', (project_id,))
    rows = cur.fetchall()
    cur.close()
    xml = json.dumps(LoadModelOfHead(rows[0][0]))
    cur = connect.cursor()
    cur.execute('UPDATE ProjectInfo SET xml=%s WHERE id=%s;', (xml, project_id))
    connect.commit()
    cur.close()
    connect.close()
    return xml

def LoadRevision(project_id, ver):
    #select model by ver
    #model to xml
    global connect
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT rep_id FROM ProjectInfo WHERE id=%s;', (project_id,))
    rows = cur.fetchall()
    cur.close()
    xml = json.dumps(LoadModel(rows[0][0], ver))
    cur = connect.cursor()
    cur.execute('UPDATE ProjectInfo SET xml=%s WHERE id=%s;', (xml, project_id))
    connect.commit()
    cur.close()
    connect.close()
    return xml

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
    cur = connect.cursor()
    cur.execute('SELECT id,current_version,root FROM model WHERE id=%s;', (id,))
    rows = cur.fetchall()
    if len(rows) == 0:
        return None
    model = {}
    model['id'] = rows[0][0]
    model['current_version'] = str(ver)
    model['root'] = LoadDiagram(rows[0][2], id, ver)
    cur.close()
    return model

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

def LoadObjects(diagram_id, project_id, ver):
    objects = []
    cur = connect.cursor()
    cur.execute('SELECT id,version FROM object WHERE diagram_id=%s AND model_id=%s AND version<=%s;', (diagram_id, project_id, ver))
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
        cur.execute('SELECT id,meta_id,x,y,version,ver_type FROM object WHERE diagram_id=%s AND model_id=%s AND id=%s AND version=%s;', (diagram_id, project_id, int(id), idmap[id][0]))
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
            cur.execute('SELECT property_id FROM has_property WHERE parent_id=%s AND model_id=%s;', (obj_rows[0][0], project_id))
            property_rows = cur.fetchall()
            object['properties'] = []
            proplist = {}
            for i in range(len(property_rows)):
                prop = LoadProperty(property_rows[i][0], project_id, ver)
                if prop.has_key('meta_id'):
                    if proplist.has_key(prop['meta_id']):
                        proplist[prop['meta_id']].append(prop)
                    else:
                        proplist[prop['meta_id']] = [prop]
            for key in proplist.keys():
                object['properties'].append({'meta_id':key,'children':proplist[key]})
#            cur.execute('SELECT diagram_id FROM has_diagram WHERE object_id=%s AND project_id=%s;', (obj_rows[0][0], project_id))
#            diagram_rows = cur.fetchall()
#            if not len(diagram_rows) == 0:
#                xml += LoadDiagram(diagram_rows[0][0], project_id, ver)
            objects.append(object)
    cur.close()
    return objects

def LoadRelationships(diagram_id, project_id, ver):
    objects = []
    cur = connect.cursor()
    cur.execute('SELECT id,version FROM relationship WHERE diagram_id=%s AND model_id=%s AND version<=%s;', (diagram_id, project_id, ver))
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
        cur.execute('SELECT id,meta_id,src,dest,version,ver_type,points FROM relationship WHERE diagram_id=%s AND model_id=%s AND id=%s AND version=%s;', (diagram_id, project_id, int(id), idmap[id][0]))
        obj_rows = cur.fetchall()
        if not obj_rows[0][5] == 2:
            object = {}
            meta_id = int(obj_rows[0][1])
            object['id'] = int(obj_rows[0][0])
            object['meta_id'] = meta_id
            object['src'] = int(obj_rows[0][2])
            object['dest'] = int(obj_rows[0][3])
            object['points'] = obj_rows[0][6]
            object['ve'] = {}
            object['ve']['ver_type'] = 'none'
            object['ve']['version'] = int(obj_rows[0][5])
            cur.execute('SELECT property_id FROM has_property WHERE object_id=%s AND model_id=%s;', (obj_rows[0][0], project_id))
            property_rows = cur.fetchall()
            object['properties'] = []
            proplist = {}
            for i in range(len(property_rows)):
                prop = LoadProperty(property_rows[i][0], project_id, ver)
                if prop.has_key['meta_id']:
                    if proplist.has_key(prop['meta_id']):
                        proplist[prop['meta_id']].append(prop)
                    else:
                        proplist[prop['meta_id']] = [prop]
            for key in proplist.keys():
                object['properties'].append({'meta_id':key,'children':proplist[key]})
            objects.append(object)
    cur.close()
    return objects

def LoadProperty(property_id, project_id, ver):
    cur = connect.cursor()
    cur.execute('SELECT id,meta_id,content,version,ver_type FROM property WHERE id=%s AND model_id=%s AND version<=%s;', (property_id, project_id, ver))
    rows = cur.fetchall()
    ver_map = []
    for i in range(len(rows)):
        ver_map.append(rows[i][3])
    xml = ''
    ver_map.sort()
    ver_map.reverse()
    cur.execute('SELECT id,meta_id,content,version,ver_type FROM property WHERE id=%s AND model_id=%s AND version=%s;', (property_id, project_id, ver_map[0]))
    obj_rows = cur.fetchall()
    property = {}
    if not obj_rows[0][4] == 2:
        meta_id = int(obj_rows[0][1])
        property['id'] = obj_rows[0][0]
        property['meta_id'] = meta_id
        property['value'] = obj_rows[0][2]
        property['ve'] = {}
        property['ve']['ver_type'] = 'none'
        property['ve']['version'] = int(obj_rows[0][3])
    cur.close()
    return property
