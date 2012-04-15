


def checkUserJoinGroup(user, gourp_id, connect):
    cur = connect.cursor()
    cur.execute('SELECT role FROM Join WHERE user_id=%s AND group_id=%s;',(user['id'], gourp_id, ))
    has_rows = cur.fetchall()
    cur.close()
    if len(has_rows) == 0:
        return -1
    role = has_rows[0][0]
    return role

def createGroup(user, group_name, connect):
    cur.execute('INSERT INTO GroupInfo (name) VALUES(%s);',(group_name,))
    connect.commit()
    group_id = cur.lastrowid
    cur.execute('INSERT INTO Join (user_id,group_id,role) VALUES(%s,%s,%s);',(user['id'], group_id, 1, ))

def updateGroup(user, group_id, detail):
    if checkUserJoinGroup(user, group_id, connect) == 1:
        cur = connect.cursor()
        affect_row_count = cur.execute('UPDATE GroupInfo SET detail=%s WHERE id = %s;',(detail, group_id, ))
        connect.commit()
        cur.close()
        return True
    else:
        return False

def deleteGroup(user, group_id, connect):
    if checkUserJoinGroup(user, group_id, connect) == 1:
        cur = connect.cursor()
        cur.execute('DELETE FROM GroupInfo WHERE group_id=%s;',(group_id,))
        cur.execute('DELETE FROM Join WHERE group_id=%s;',(group_id,))
        connect.commit()
        cur.close()
        return True
    else:
        return False
