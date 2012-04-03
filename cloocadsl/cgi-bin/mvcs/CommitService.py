# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import re
import sys
sys.path.append('../')
from xml.etree.ElementTree import *
import config

'''
グローバル変数
'''
#データベースとの接続
connect = None
#モデルリポジトリのID
project_id = None
#次のバージョン
next_version = None


def CreateRepository(project_id, rep_id):
    #select project xml
    global connect
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT projectname FROM projectinfo WHERE id=%s;', (project_id,))
    rows = cur.fetchall()
    cur.execute('UPDATE projectinfo SET rep_id=%s WHERE id=%s;', (rep_id, project_id))
    cur.execute('INSERT INTO model (id,meta_id,name,root,version) VALUES(%s,%s,%s,%s,%s);', (rep_id,1,rows[0][0],0,1))
    connect.commit()
    cur.close()
    connect.close()

'''
 ワークスペースからモデルリポジトリにコミットする。
'''
def commit(project_id):
    #select project xml
    global connect
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT id,name,xml,metamodel_id,rep_id FROM ProjectInfo WHERE id=%s;', (project_id,))
    rows = cur.fetchall()
    cur.close()
    if len(rows) == 0:
        return None
    #xml to rep (xml include version infomation)
    xml = rows[0][2]
    InsertXML2REP(xml, rows[0][4])
    connect.close()


def InsertXML2REP(xml, model_id):
    global project_id
    project_id = model_id
    parse_model(xml)

def parse_model(xml):
    elem = fromstring(xml)
    if elem.tag == 'Model':
        id = elem.get('id')
        version = int(elem.get('current_version'))
        global next_version
        next_version = version + 1
        for e in elem.findall(".//Diagram"):
            root = parseDiagram(e)
        cur = connect.cursor()
        cur.execute('UPDATE model SET root=%s,current_version=%s WHERE id=%s;', (root,next_version,project_id,))
        connect.commit()
        cur.close()
        """
        if edited_type == 'update':
            cur = connect.cursor()
            cur.execute('INSERT INTO model (id,meta_id,name,root,version) VALUES(%s,%s,%s,%s,%s);', (project_id,1,name,root,version))
            connect.commit()
            cur.close()
        elif edited_type == 'add':
            cur = connect.cursor()
#            cur.execute('INSERT INTO model (id,meta_id,name,root,version) VALUES(%s,%s,%s,%s,%s);', (project_id,1,name,root,version))
            cur.execute('UPDATE model SET root=%s,version=%s WHERE id=%s;', (root,next_version,project_id,))
            connect.commit()
            cur.close()
        elif edited_type == 'delete':
            cur = connect.cursor()
            cur.execute('INSERT INTO model (id,meta_id,name,root,version) VALUES(%s,%s,%s,%s,%s);', (project_id,1,name,root,version))
            connect.commit()
            cur.close()
        else:
            pass
            """

def parseDiagram(elem):
    children_edited = False
    id = elem.get('id')
    meta_id = elem.get('meta_id')
    versionelement = elem.find('VersionElement')
    edited_type = versionelement.get('ver_type')
    version = int(versionelement.get('version'))
    for e in elem.findall(".//Object"):
        if parseObject(e, id, version):
            children_edited = True
    for e in elem.findall(".//Relationship"):
        if parseRelationship(e, id, version):
            children_edited = True
    if edited_type == 'update':
        cur = connect.cursor()
        cur.execute('DELETE FROM diagram where id=%s AND model_id=%s AND version=%s;', (id,project_id,next_version))
        connect.commit()
#        cur.execute('INSERT INTO object_has_diagram (id,diagram_id,project_id) VALUES(%s,%s,%s);', (id,parent_id,project_id))
        cur.execute('INSERT INTO diagram (id,meta_id,model_id,version) VALUES(%s,%s,%s,%s);', (id,meta_id,project_id,next_version))
        connect.commit()
        cur.close()
    elif edited_type == 'add':
        cur = connect.cursor()
        cur.execute('DELETE FROM diagram where id=%s AND model_id=%s AND version=%s;', (id,project_id,next_version))
        connect.commit()
#        cur.execute('INSERT INTO object_has_diagram (id,diagram_id,project_id) VALUES(%s,%s,%s);', (id,parent_id,project_id))
        cur.execute('INSERT INTO diagram (id,meta_id,model_id,version) VALUES(%s,%s,%s,%s);', (id,meta_id,project_id,next_version))
        connect.commit()
        cur.close()
    elif edited_type == 'delete':
        cur = connect.cursor()
        cur.execute('INSERT INTO object_has_diagram (id,diagram_id,model_id) VALUES(%s,%s,%s);', (id,parent_id,project_id))
        cur.execute('INSERT INTO diagram (id,meta_id,model_id,version) VALUES(%s,%s,%s,%s);', (id,meta_id,project_id,next_version))
        connect.commit()
        cur.close()
    elif children_edited:
        cur = connect.cursor()
#        cur.execute('INSERT INTO object_has_diagram (id,diagram_id,project_id) VALUES(%s,%s,%s);', (id,parent_id,project_id))
        cur.execute('INSERT INTO diagram (id,meta_id,model_id,version) VALUES(%s,%s,%s,%s);', (id,meta_id,project_id,next_version))
        connect.commit()
        cur.close()
    else:
        pass
    return id

def parseObject(elem, parent_id, parent_ver):
    children_edited = False
    id = elem.get('id')
    meta_id = elem.get('meta_id')
    x = elem.get('x')
    y = elem.get('y')
    versionelement = elem.find('VersionElement')
    edited_type = versionelement.get('ver_type')
    version = int(versionelement.get('version'))
    if not edited_type == 'delete':
        for e in elem.findall(".//Property"):
            if parseProperty(e, id):
                children_edited = True
    if edited_type == 'update':
        cur = connect.cursor()
        cur.execute('DELETE FROM object where id=%s AND model_id=%s AND version=%s;', (id,project_id,next_version))
        connect.commit()
        cur.execute('INSERT INTO object (id,meta_id,x,y,diagram_id,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s,%s,%s);', (id,meta_id,x,y,parent_id,project_id,next_version,0))
        connect.commit()
        cur.close()
        return True
    elif edited_type == 'add':
        cur = connect.cursor()
        cur.execute('INSERT INTO object (id,meta_id,x,y,diagram_id,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s,%s,%s);', (id,meta_id,x,y,parent_id,project_id,next_version,1))
        connect.commit()
        cur.close()
        return True
    elif edited_type == 'delete':
        cur = connect.cursor()
        cur.execute('INSERT INTO object (id,meta_id,x,y,diagram_id,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s,%s,%s);', (id,meta_id,x,y,parent_id,project_id,next_version,2))
        connect.commit()
        cur.close()
        return True
    elif children_edited:
        cur = connect.cursor()
        cur.execute('DELETE FROM object where id=%s AND model_id=%s AND version=%s;', (id,project_id,next_version))
        connect.commit()
        cur.execute('INSERT INTO object (id,meta_id,x,y,diagram_id,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s,%s,%s);', (id,meta_id,x,y,parent_id,project_id,next_version,0))
        connect.commit()
        cur.close()
        return True
    else:
        return False

def parseRelationship(elem, parent_id, parent_ver):
    id = elem.get('id')
    meta_id = elem.get('meta_id')
    src = elem.get('src')
    dest = elem.get('dest')
    versionelement = elem.find('VersionElement')
    edited_type = versionelement.get('ver_type')
    version = int(versionelement.get('version'))
    property = ""
    for e in elem.findall(".//Property"):
        if parseProperty(e, id):
            children_edited = True
    if edited_type == 'update':
        cur = connect.cursor()
        cur.execute('DELETE FROM relationship where id=%s AND model_id=%s AND version=%s;', (id,project_id,next_version))
        connect.commit()
        cur.execute('INSERT INTO relationship (id,meta_id,src,dest,property,diagram_id,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s);', (id,meta_id,src,dest,property,parent_id,project_id,next_version,0))
        connect.commit()
        cur.close()
        return True
    elif edited_type == 'add':
        cur = connect.cursor()
        cur.execute('INSERT INTO relationship (id,meta_id,src,dest,property,diagram_id,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s);', (id,meta_id,src,dest,property,parent_id,project_id,next_version,1))
        connect.commit()
        cur.close()
        return True
    elif edited_type == 'delete':
        cur = connect.cursor()
        cur.execute('INSERT INTO relationship (id,meta_id,src,dest,property,diagram_id,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s);', (id,meta_id,src,dest,property,parent_id,project_id,next_version,2))
        connect.commit()
        cur.close()
        return True
    elif children_edited:
        cur = connect.cursor()
        cur.execute('DELETE FROM relationship where id=%s AND model_id=%s AND version=%s;', (id,project_id,next_version))
        connect.commit()
        cur.execute('INSERT INTO relationship (id,meta_id,src,dest,property,diagram_id,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s);', (id,meta_id,src,dest,property,parent_id,project_id,next_version,0))
        connect.commit()
        cur.close()
        return True
    else:
        return False


def parsePropertyList(elem, parent_id):
    children_edited = False
    for e in elem.findall(".//Property"):
        if parseProperty(e, parent_id):
            children_edited = True
    return children_edited

def parseProperty(elem, parent_id):
    children_edited = False
    content = elem.text
    meta_id = elem.get('meta_id')
    versionelement = elem.find('VersionElement')
    edited_type = versionelement.get('ver_type')
    version = int(versionelement.get('version'))
    if edited_type == 'update':
        cur = connect.cursor()
        cur.execute('DELETE FROM property where id=%s AND model_id=%s AND version=%s;', (id,project_id,next_version))
        connect.commit()
        cur.execute('INSERT INTO property (id,meta_id,content,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s);', (id,meta_id,content,project_id,next_version,0))
        connect.commit()
        cur.close()
        return True
    elif edited_type == 'add':
        cur = connect.cursor()
        cur.execute('INSERT INTO has_property (parent_id,property_id,model_id) VALUES(%s,%s,%s);', (parent_id,id,project_id))
        cur.execute('INSERT INTO property (id,meta_id,content,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s);', (id,meta_id,content,project_id,next_version,1))
        connect.commit()
        cur.close()
        return True
    elif edited_type == 'delete':
        cur = connect.cursor()
        cur.execute('INSERT INTO property (id,meta_id,content,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s);', (id,meta_id,content,project_id,next_version,2))
        connect.commit()
        cur.close()
        return True
    elif children_edited:
        cur = connect.cursor()
        cur.execute('DELETE FROM property where id=%s AND model_id=%s AND version=%s;', (id,project_id,next_version))
        connect.commit()
        cur.execute('INSERT INTO property (id,meta_id,content,model_id,version,ver_type) VALUES(%s,%s,%s,%s,%s,%s);', (id,meta_id,content,project_id,next_version,0))
        connect.commit()
        cur.close()
        return True
    else:
        return False

def InsertJSON2REP(text, model_id):
    global project_id
    project_id = model_id
    parse_model_JSON(json.loads(text))

def parse_model_JSON(model):
    id = model['id']
    version = int(model['current_version'])
    global next_version
    next_version = version + 1
    root = parseDiagramJSON(model['root'])
    cur = connect.cursor()
    cur.execute('UPDATE model SET root=%s,current_version=%s WHERE id=%s;', (root,next_version,project_id,))
    connect.commit()
    cur.close()

def parseDiagramJSON(diagram):
    children_edited = False
    id = diagram['id']
    meta_id = diagram['meta_id']
    edited_type = diagram['ve']['ver_type']
    version = int(diagram['ve']['version'])
    for e in range(len(diagram['objects'])):
        if parseObject(e, id, version):
            children_edited = True
    for e in range(len(diagram['relationships'])):
        if parseRelationship(e, id, version):
            children_edited = True
    if edited_type == 'update':
        cur = connect.cursor()
        cur.execute('DELETE FROM diagram where id=%s AND model_id=%s AND version=%s;', (id,project_id,next_version))
        connect.commit()
#        cur.execute('INSERT INTO object_has_diagram (id,diagram_id,project_id) VALUES(%s,%s,%s);', (id,parent_id,project_id))
        cur.execute('INSERT INTO diagram (id,meta_id,model_id,version) VALUES(%s,%s,%s,%s);', (id,meta_id,project_id,next_version))
        connect.commit()
        cur.close()
    elif edited_type == 'add':
        cur = connect.cursor()
        cur.execute('DELETE FROM diagram where id=%s AND model_id=%s AND version=%s;', (id,project_id,next_version))
        connect.commit()
#        cur.execute('INSERT INTO object_has_diagram (id,diagram_id,project_id) VALUES(%s,%s,%s);', (id,parent_id,project_id))
        cur.execute('INSERT INTO diagram (id,meta_id,model_id,version) VALUES(%s,%s,%s,%s);', (id,meta_id,project_id,next_version))
        connect.commit()
        cur.close()
    elif edited_type == 'delete':
        cur = connect.cursor()
        cur.execute('INSERT INTO object_has_diagram (id,diagram_id,model_id) VALUES(%s,%s,%s);', (id,parent_id,project_id))
        cur.execute('INSERT INTO diagram (id,meta_id,model_id,version) VALUES(%s,%s,%s,%s);', (id,meta_id,project_id,next_version))
        connect.commit()
        cur.close()
    elif children_edited:
        cur = connect.cursor()
#        cur.execute('INSERT INTO object_has_diagram (id,diagram_id,project_id) VALUES(%s,%s,%s);', (id,parent_id,project_id))
        cur.execute('INSERT INTO diagram (id,meta_id,model_id,version) VALUES(%s,%s,%s,%s);', (id,meta_id,project_id,next_version))
        connect.commit()
        cur.close()
    else:
        pass
    return id
