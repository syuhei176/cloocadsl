import os
import MySQLdb
import md5
import re
import sys
import datetime
sys.path.append('../')
import config

reg_username = re.compile('\w+')

connect = None

def GetMetaModel(metamodel_id):
    metamodel = {}
    global connect
    connect = MySQLdb.connect(db=config.DB_METAMODEL_NAME, host=config.DB2_HOST, port=config.DB2_PORT, user=config.DB_METAMODEL_USER, passwd=config.DB2_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT * FROM metamodel WHERE id=%s;',(metamodel_id, ))
    rows = cur.fetchall()
    cur.close()
    if len(rows) == 0:
        return None
    metamodel['id'] = rows[0][0]
    metamodel['name'] = rows[0][1]
    metamodel['root'] = GetMetaDiagram(rows[0][2])
    connect.close()
    return metamodel

def GetMetaDiagram(diagram_id):
    diagram = {}
    diagram['diagram'] = SelectMetaDiagram(diagram_id)
    cur = connect.cursor()
    cur.execute('SELECT * FROM has_metaobject WHERE metadiagram_id=%s;',(diagram_id, ))
    rows = cur.fetchall()
    diagram['object'] = []
    for i in range(len(rows)):
        diagram['object'].append(SelectMetaObject(rows[i][1]))
    cur.execute('SELECT * FROM has_metarelationship WHERE metadiagram_id=%s;',(diagram_id, ))
    rows = cur.fetchall()
    diagram['relationship'] = []
    for i in range(len(rows)):
        diagram['relationship'].append(SelectMetaRelationship(rows[i][1]))
    cur.close()
    return diagram

def SelectMetaDiagram(diagram_id):
    cur = connect.cursor()
    cur.execute('SELECT * FROM metadiagram WHERE id=%s;',(diagram_id, ))
    rows = cur.fetchall()
    cur.close()
    if len(rows) == 0:
        return None
    diagram = {}
    diagram['id'] = rows[0][0]
    diagram['name'] = rows[0][1]
    return diagram

def SelectMetaObject(metaobject_id):
    cur = connect.cursor()
    cur.execute('SELECT * FROM metaobject WHERE id=%s;',(metaobject_id, ))
    rows = cur.fetchall()
    cur.execute('SELECT metaproperty_id FROM metaobject_has_metaproperty WHERE metaobject_id=%s;',(metaobject_id, ))
    prop = cur.fetchall()
    cur.close()
    object = {}
    object['id'] = rows[0][0]
    object['name'] = rows[0][1]
    object['graphic'] = rows[0][2]
    object['property'] = []
    for i in range(len(prop)):
        object['property'].append(SelectMetaProperty(prop[i][0]))
    return object

def SelectMetaRelationship(metarelationship_id):
    cur = connect.cursor()
    cur.execute('SELECT * FROM metarelationship WHERE id=%s;',(metarelationship_id, ))
    rows = cur.fetchall()
    cur.execute('SELECT * FROM binding WHERE metarelationship_id=%s;',(metarelationship_id, ))
    bindings = cur.fetchall()
    cur.execute('SELECT metaproperty_id FROM metaobject_has_metaproperty WHERE metaobject_id=%s;',(metarelationship_id, ))
    prop = cur.fetchall()
    cur.close()
    relationship = {}
    relationship['id'] = rows[0][0]
    relationship['name'] = rows[0][1]
    relationship['arrow'] = rows[0][2]
    relationship['bindings'] = []
    for i in range(len(bindings)):
        relationship['bindings'].append({'src' : bindings[i][1], 'dest' : bindings[i][2]})
    relationship['property'] = []
    for i in range(len(prop)):
        relationship['property'].append(SelectMetaProperty(prop[i][0]))
    return relationship

def SelectMetaProperty(metaproperty_id):
    cur = connect.cursor()
    cur.execute('SELECT * FROM metaproperty WHERE id=%s;',(metaproperty_id, ))
    rows = cur.fetchall()
    cur.close()
    property = {}
    property['id'] = rows[0][0]
    property['name'] = rows[0][1]
    property['type'] = rows[0][2]
    return property
