# -*- coding: utf-8 -*-

"""
"""
def findItem(connect, user, token, start, num):
    cur = connect.cursor()
    cur.execute('SELECT user_id,email,fullname FROM account_info WHERE fullname like %s LIMIT %s,%s;', (token.encode('utf-8') + '%', start, num, ))
    #cur.execute('SELECT user_id,email,fullname,account_relationship.is_friend,account_relationship.is_friend_pre FROM account_info RIGHT JOIN account_relationship ON account_info.user_id = account_relationship.src AND account_relationship.dest=%s AND fullname like %s LIMIT %s;', (user['id'], token.encode('utf-8') + '%', num, ))
    rows = cur.fetchall()
    cur.close()
    users = []
    for i in range(len(rows)):
    	if not rows[i][0] == user['id']:
	        user = {}
	        user['id'] = rows[i][0]
	        user['email'] = rows[i][1]
	        user['fullname'] = rows[i][2].decode('utf-8')
	        user['name'] = rows[i][2].decode('utf-8')
	        #user['is_friend'] = rows[i][3]
	        #user['is_friend_pre'] = rows[i][4]
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
    return True

"""
"""
def acceptFriend(connect, user, requesting_user_id):
    cur = connect.cursor()
    cur.execute('SELECT is_friend_pre,is_friend FROM account_relationship WHERE dest=%s AND src=%s;', (user['id'], requesting_user_id, ))
    row = cur.fetchone()
    if not row == None:
        if int(row[0]) == 1:
            num_of_affected_row = cur.execute('UPDATE account_relationship SET is_friend=%s,is_friend_pre=%s WHERE dest=%s AND src=%s;', (1, 0, user['id'], requesting_user_id, ))
            connect.commit()
            return num_of_affected_row == 1
    cur.close()
    return False

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

def getUserProfile(connect, user, user_id):
    cur = connect.cursor()
    cur.execute('SELECT user_id,email,password,registration_date,fullname FROM account_info WHERE user_id = %s;', (user_id, ))
    rows = cur.fetchall()
    if len(rows) == 0:
        cur.close()
        return None
    user = {}
    user['id'] = rows[0][0]
    user['email'] = rows[0][1]
    user['password'] = '********'
    user['registration_date'] = rows[0][3]
    user['fullname'] = rows[0][4].decode('utf-8')
    cur.close()
    return user

