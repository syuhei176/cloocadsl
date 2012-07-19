import md5

"""
"""
def getMyInfo(connect, user):
    pass

"""
"""
def getUserInfo(connect, user, user_id):
    pass

"""
"""
def updateUserInfo(connect, user, fullname):
    cur = connect.cursor()
    num = cur.execute('UPDATE account_info SET fullname=%s WHERE user_id=%s;', (fullname.encode('utf-8'), user['id']))
    connect.commit()
    cur.close()
    return num > 0


"""
"""
def changePassword(connect, user, password):
    cur = connect.cursor()
    num = cur.execute('UPDATE account_info SET password=%s WHERE user_id=%s;', (md5.new(password).hexdigest(), user['id']))
    connect.commit()
    cur.close()
    if num == 0:
        return False
    return True


"""
"""
def changePasswordConfirm(connect, user):
    pass

