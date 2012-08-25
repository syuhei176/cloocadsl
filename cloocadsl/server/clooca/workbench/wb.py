# -*- coding: utf-8 -*-
import os
import MySQLdb
import md5
import re
import sys
import datetime
import config
import random

"""
"""
def save_to_ws(connect, user, tool_key, metamodel):
    cur = connect.cursor()
    num_of_affected_row = cur.execute('UPDATE tool_workspace SET metamodel=%s WHERE tool_uri=%s AND user_id=%s;', (metamodel, tool_key, user['id'], ))
    connect.commit()
    cur.close()
    return num_of_affected_row != 0

"""
"""
def get_templates(connect, user, tool_key):
    dict = {'templates':[]}
    cur = connect.cursor()
    cur.execute('SELECT name,package_uri,content,version,is_modified FROM template_workspace WHERE user_id=%s AND tool_uri=%s;', (user['id'], tool_key))
    rows = cur.fetchall()
    cur.close()
    pre = ['','>']
    for i in range(len(rows)):
        is_modified = rows[i][4]
        template = {}
        template['name'] = rows[i][0]
        template['package_uri'] = rows[i][1]
        template['content'] = rows[i][2].decode('utf-8')
        template['text'] = pre[is_modified] + str(rows[i][0]) + ':' + str(rows[i][3])
        template['leaf'] = True
        dict['templates'].append(template)
    return dict

"""
"""
def create_template(connect, user, tool_key, name, package_uri):
    cur = connect.cursor()
    cur.execute('INSERT INTO template_workspace (user_id,tool_uri,name,package_uri,content) VALUES(%s,%s,%s,%s,%s);',(user['id'], tool_key, name, package_uri, '', ))
    connect.commit()
    cur.close()
    return True

"""
"""
def save_template(connect, user, tool_key, name, package_uri, content):
    cur = connect.cursor()
    num_of_affected_row = cur.execute('UPDATE template_workspace SET package_uri=%s,content=%s,is_modified=%s WHERE user_id=%s AND tool_uri=%s AND name=%s;', (package_uri, content.encode('utf-8'), 1,user['id'], tool_key, name, ))
    connect.commit()
    cur.close()
    return num_of_affected_row != 0

"""
"""
def delete_template(connect, user, tool_key, name):
    cur = connect.cursor()
    num_of_affected_row = cur.execute('DELETE FROM template_workspace WHERE user_id=%s AND tool_uri=%s name=%s;', (user['id'], tool_key, name, ))
    connect.commit()
    cur.close()
    return num_of_affected_row != 0
