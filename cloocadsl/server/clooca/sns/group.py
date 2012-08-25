# -*- coding: utf-8 -*-

def createGroup(connect, user, group_key, group_name, vis):
    cur = connect.cursor()
    d = datetime.datetime.today()
    cur.execute('INSERT INTO group_info (key,name,created_date,visibillity) VALUES(%s,%s,%s,%s);',(group_key, group_name.encode('utf-8'), d.strftime("%Y-%m-%d"), vis))
    group_id = cur.lastrowid
    cur.execute('INSERT INTO join_info (user_id,group_id,role) VALUES(%s,%s,%s);',(user['id'], group_id, 1))
    connect.commit()
    cur.close()

def myGroups(connect, user):
    cur = connect.cursor()
    cur.execute('SELECT group_info.id,group_info.key,group_info.name,join_info.role FROM join_info INNER JOIN group_info ON group_info.id = join_info.group_id AND user_id=%s;',(user['id']))
    rows = cur.fetchall()
    groups = reduce(lambda a,b: [{'id':b[0],'key':b[1],'name':b[2].decode('utf-8'),'role':int(b[3])}] + a, rows, [])
    cur.close()
    return groups

def addMember(connect, user, user_id):
    pass

