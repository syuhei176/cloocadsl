# -*- coding: utf-8 -*-

"""
"""
def findItem(connect, user, token, num):
    cur = connect.cursor()
    cur.execute('SELECT user_id,email,fullname FROM account_info WHERE fullname like %s LIMIT %s;', (token.encode('utf-8') + '%', num, ))
    rows = cur.fetchall()
    cur.close()
    users = []
    for i in range(len(rows)):
        user = {}
        user['id'] = rows[i][0]
        user['email'] = rows[i][1]
        user['fullname'] = rows[i][2].decode('utf-8')
        user['name'] = rows[i][2].decode('utf-8')
        users.append(user)
    return users

"""
"""
def getUserInfoById(connect, user, user_id):
    pass

"""
"""
def getUserInfoByEmail(connect, user, email):
    pass

"""
"""
def requestFriend(connect, user, requested_user_id):
    cur = connect.cursor()
    cur.execute('SELECT id FROM account_relationship WHERE src=%s AND dest=%s;', (user['id'], requested_user_id, ))
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.execute('INSERT INTO account_relationship (is_friend,is_friend_pre,src,dest) VALUES(%s,%s,%s,%s);',(0, 1, user['id'], requested_user_id, ))
        connect.commit()
    cur.close()

"""
"""
def acceptFriend(connect, user, requesting_user_id):
    cur = connect.cursor()
    cur.execute('SELECT is_friend_pre FROM account_relationship WHERE src=%s AND dest=%s;', (user['id'], requested_user_id, ))
    rows = cur.fetchall()
    if len(rows) != 0:
        if rows[0][0] == 1:
            num_of_affected_row = cur.execute('UPDATE account_relationship SET is_friend=%s,is_friend_pre=%s WHERE src=%s AND dest=%s;', (1, 0, user['id'], requested_user_id, ))
            connect.commit()
    cur.close()

"""
友達リクエストのリスト
"""
def getRequestedList(connect, user, num):
    cur = connect.cursor()
    cur.execute('SELECT user_id,email,fullname FROM account_info INNER JOIN account_relationship ON account_info.user_id = account_relationship.src AND account_relationship.dest=%s AND account_relationship.is_friend_pre=1 LIMIT %s;', (user['id'], num, ))
    rows = cur.fetchall()
    cur.close()
    users = []
    for i in range(len(rows)):
        user = {}
        user['id'] = rows[i][0]
        user['email'] = rows[i][1]
        user['fullname'] = rows[i][2].decode('utf-8')
        user['name'] = rows[i][2].decode('utf-8')
        users.append(user)
    return users

"""
"""
def getFriendList(connect, user, num):
    cur = connect.cursor()
    cur.execute('SELECT user_id,email,fullname FROM account_info INNER JOIN account_relationship ON account_info.user_id = account_relationship.src AND account_relationship.dest=%s AND account_relationship.is_friend=1 LIMIT %s;', (user['id'], num, ))
    rows = cur.fetchall()
    cur.close()
    users = []
    for i in range(len(rows)):
        user = {}
        user['id'] = rows[i][0]
        user['email'] = rows[i][1]
        user['fullname'] = rows[i][2].decode('utf-8')
        user['name'] = rows[i][2].decode('utf-8')
        users.append(user)
    return users
