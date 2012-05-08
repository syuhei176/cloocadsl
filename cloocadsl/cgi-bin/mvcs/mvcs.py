# -*- coding: utf-8 -*-
import sys
import json
import MySQLdb
import config
import CommitService
import UpdateServiceJSON
import RepositoryService

'''
commit
return:0,1,2
'''
def commit(user, pid, comment, xml):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT id,name,xml,metamodel_id,rep_id FROM ProjectInfo WHERE id=%s;', (pid,))
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        connect.close()
        return 0
    #xml to rep (xml include version infomation)
    rep_id = rows[0][4]
    model_json = rows[0][2]
    cur.close()
    connect.close()
    return CommitService.commit(rep_id, xml, comment)

def update(user, pid):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT rep_id,xml FROM ProjectInfo WHERE id=%s;', (pid,))
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        connect.close()
        return 0
    rep_id = rows[0][0]
    oldModel = json.loads(rows[0][1])
    cur.close()
#    connect.close()
    newModel = UpdateServiceJSON.LoadHeadRevision(rep_id)
    model_json = json.dumps(merge(newModel, oldModel))
#    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('UPDATE ProjectInfo SET xml=%s WHERE id=%s;', (model_json, pid))
    connect.commit()
    cur.close()
    connect.close()
    return model_json

def update_to_version(user, pid, version):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT rep_id,xml FROM ProjectInfo WHERE id=%s;', (pid,))
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        connect.close()
        return 0
    rep_id = rows[0][0]
    oldModel = json.loads(rows[0][1])
    cur.close()
#    connect.close()
    newModel = UpdateServiceJSON.LoadRevision(rep_id, version)
    model_json = json.dumps(merge(newModel, oldModel))
#    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('UPDATE ProjectInfo SET xml=%s WHERE id=%s;', (model_json, pid))
    connect.commit()
    cur.close()
    connect.close()
    return model_json

'''
リポジトリからプロジェクトにモデルデータをコピーする。
プロジェクトとリポジトリを関連づける。
'''
def checkout(user, rep_id, pid):
    RepositoryService.checkout(rep_id, pid)
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('UPDATE ProjectInfo SET rep_id=%s WHERE id=%s;', (rep_id, pid))
    connect.commit()
    cur.close()
    connect.close()
    return update(user, pid)
    

def improt_to_rep(user, pid, rep_id):
    pass

def export_from_rep(user, pid, rep_id):
    pass

'''
リポジトリを作成する。
'''
def create_rep(user, rep_name):
    return RepositoryService.CreateRepository(user, rep_name)

def clear_rep(user, rep_id):
    return RepositoryService.clearRepository(user, rep_id)

def delete_rep(user, rep_id):
    return RepositoryService.deleteRepository(user, rep_id)

def rep_list(user):
    return RepositoryService.rep_list()

def ver_list(user, pid):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT rep_id,xml FROM ProjectInfo WHERE id=%s;', (pid,))
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        connect.close()
        return 0
    rep_id = rows[0][0]
    cur.close()
    connect.close()
    return RepositoryService.ver_list(rep_id)

def user_rep_list(user):
    pass

def group_rep_list(user):
    pass

def get_history(pid):
    connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
    cur = connect.cursor()
    cur.execute('SELECT rep_id,xml FROM ProjectInfo WHERE id=%s;', (pid,))
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        connect.close()
        return 0
    rep_id = rows[0][0]
    cur.close()
    connect.close()
    return RepositoryService.getHistory(rep_id);



'''
merge
model1:new
model2:old
'''
def merge(model1, model2):
    #model1['current_version'] = model2['current_version']
    global g_model1
    global g_model2
    g_model1 = model1
    g_model2 = model2
    g_model1['root'] = g_model2['root']
    for key in model2['diagrams']:
        if model1['diagrams'].has_key(str(key)):
            merge_diagram(model1['diagrams'][key], model2['diagrams'][key])
        else:
            model1['diagrams'][key] = model2['diagrams'][key]
    for key in model2['objects']:
        if model1['objects'].has_key(key):
            merge_object(model1['objects'][key], model2['objects'][key])
        else:
            if model2['objects'][key]['ve']['ver_type'] == 'add':
                model1['objects'][key] = model2['objects'][key]
    for key in model2['relationships']:
        if model1['relationships'].has_key(key):
            merge_relationship(model1['relationships'][key], model2['relationships'][key])
        else:
            if model2['relationships'][key]['ve']['ver_type'] == 'add':
                model1['relationships'][key] = model2['relationships'][key]
    for key in model2['properties']:
        if model1['properties'].has_key(key):
            pass    #conflict
        else:
            if model2['properties'][key]['ve']['ver_type'] == 'add':
                model1['properties'][key] = model2['properties'][key]
    return model1

def merge_diagram(diagram1, diagram2):
    for obj_id in diagram2['objects']:
        if not obj_id in diagram1['objects'] and g_model2['objects'][str(obj_id)]['ve']['ver_type'] == 'add':
            diagram1['objects'].append(obj_id)
            diagram1['ve']['ver_type'] = 'update'
    for rel_id in diagram2['relationships']:
        if not rel_id in diagram1['relationships'] and g_model2['relationships'][str(rel_id)]['ve']['ver_type'] == 'add':
            diagram1['relationships'].append(rel_id)
            diagram1['ve']['ver_type'] = 'update'

def merge_object(object1, object2):
    for plist2 in object2['properties']:
        plist = None
        for plist1 in object1['properties']:
            if plist1['meta_id'] == plist2['meta_id']:
                plist = plist1
        if not plist == None:
            merge_plist(plist, plist2, object1)
        else:
            object1['properties'].append(plist2)
#            object1['ve']['ver_type'] = 'update'

def merge_relationship(object1, object2):
    for plist2 in object2['properties']:
        plist = None
        for plist1 in object1['properties']:
            if plist1['meta_id'] == plist2['meta_id']:
                plist = plist1
        if not plist == None:
            merge_plist(plist, plist2, object1)
        else:
            object1['properties'].append(plist2)
            object1['ve']['ver_type'] = 'update'


def merge_plist(plist1, plist2, obj1):
    for prop_id in plist2['children']:
        if not prop_id in plist1['children'] and g_model2['properties'][str(prop_id)]['ve']['ver_type'] == 'add':
            plist1['children'].append(prop_id)
            obj1['ve']['ver_type'] = 'update'
