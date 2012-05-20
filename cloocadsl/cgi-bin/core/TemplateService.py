# -*- coding: utf-8 -*-
import os
import sys
import json
import MySQLdb
sys.path.append('../')
import config

def create(metamodel_id, name, path, connect):
    cur = connect.cursor()
    cur.execute('SELECT name FROM Template WHERE metamodel_id=%s AND name=%s',(metamodel_id, name, ))
    rows = cur.fetchall()
    if not len(rows) == 0:
        return False
    cur.execute('INSERT INTO Template (name,path,content,metamodel_id) VALUES(%s,%s,%s,%s);',(name, path, '', metamodel_id, ))
    connect.commit()
    cur.close()
    return True

def delete(metamodel_id, name, connect):
    cur = connect.cursor()
    cur.execute('INSERT INTO Template (name,path,content,metamodel_id) VALUES(%s,%s,%s,%s);',(name, name, content, metamodel_id, ))
    connect.commit()
    cur.close()
    return True

def save(metamodel_id, name, content, connect):
    cur = connect.cursor()
    affect_row_count = cur.execute('UPDATE Template SET content=%s WHERE name=%s AND metamodel_id=%s;', (content.encode('utf-8'), name, metamodel_id, ))
    connect.commit()
    cur.close()
    if affect_row_count > 0:
        return True
    return False

def tree(metamodel_id, connect):
    cur = connect.cursor()
    cur.execute('SELECT name,path,content FROM Template WHERE metamodel_id=%s;',(metamodel_id, ))
    rows = cur.fetchall()
    cur.close()
    files = []
    for i in range(len(rows)):
        name = rows[i][0]
        path = rows[i][1]
        content = rows[i][2]
        files.append({'name' : name, 'path' : path, 'content' : content.decode('utf-8')})
    return files

def load(metamodel_id, name, connect):
    pass

def Export(metamodel_id, connect):
    return json.dumps(tree(metamodel_id, connect))
    
def Import(metamodel_id, text, connect):
    files = json.loads(text)
    for f in files:
        create(metamodel_id, f['name'], connect)
        save(metamodel_id, f['name'], f['content'], connect)
#        cur = connect.cursor()
#        affect_row_count = cur.execute('UPDATE Template SET content=%s WHERE path=%s AND metamodel_id = %s;',(f['content'], f['name'], metamodel_id, ))
#        connect.commit()
#        cur.close()
    return True
