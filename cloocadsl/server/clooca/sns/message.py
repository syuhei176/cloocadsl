# -*- coding: utf-8 -*-

#自分に関係する最新情報を取得する
#関連するグループやツール、プロジェクトに送られたメッセージ
#関連するツールやプロジェクトへのコミット
#友達リクエスト
def homeFeed(connect, user, num):
    cur = connect.cursor()
    #user
    cur.execute('SELECT id,content,date,type,author_id FROM message WHERE type=%s ORDER BY date DESC LIMIT %s;',(2, num, ))
    rows = cur.fetchall()
    user_mes = reduce(lambda a,b: [{'id':b[0],'content':b[1].decode('utf-8'),'date':str(b[2])}] + a, rows, [])
    #tool message
    cur.execute('SELECT message.id,message.content,message.date FROM message INNER JOIN user_has_tool ON user_has_tool.tool_uri = message.tool_id AND user_has_tool.user_id = %s ORDER BY date DESC LIMIT %s;',(user['id'], num, ))
    rows = cur.fetchall()
    tool_message = reduce(lambda a,b: [{'id':b[0],'content':b[1].decode('utf-8'),'date':str(b[2])}] + a, rows, [])
    #tool commit
    cur.execute('SELECT tool_commit.id,tool_commit.comment,tool_commit.date FROM tool_commit INNER JOIN user_has_tool ON user_has_tool.tool_uri = tool_commit.tool_key AND user_has_tool.user_id = %s AND user_has_tool.permission = 1  ORDER BY date DESC LIMIT %s;',(user['id'], num, ))
    rows = cur.fetchall()
    tool_comment = reduce(lambda a,b: [{'id':b[0],'content':'tool commit:'+b[1].decode('utf-8'),'date':str(b[2])}] + a, rows, [])
    cur.close()
    return user_mes + tool_message + tool_comment

#MyFeedを取得
def myFeed(connect, user, num):
    cur = connect.cursor()
    cur.execute('SELECT id,content,date,type,author_id FROM message WHERE type=%s AND author_id=%s ORDER BY date DESC LIMIT %s;',(0, user['id'], num, ))
    rows = cur.fetchall()
    cur.close()
    return reduce(lambda a,b: [{'id':b[0],'content':b[1],'date':str(b[2])}] + a, rows, [])

#自分に送られたメッセージを取得
def userFeed(connect, user, num):
    cur = connect.cursor()
    cur.execute('SELECT id,content,date,type,author_id FROM message WHERE type=%s AND user_id=%s ORDER BY date DESC LIMIT %s;',(1, user['id'], num, ))
    rows = cur.fetchall()
    cur.close()
    return reduce(lambda a,b: [{'id':b[0],'content':b[1],'date':str(b[2])}] + a, rows, [])

#グループに送られたメッセージを取得
def groupFeed(connect, user, group_id, num):
    #自分がグループに所属しているかチェック
    cur = connect.cursor()
    cur.execute('SELECT id,content,date,type,author_id FROM message WHERE type=%s AND group_id=%s ORDER BY date DESC LIMIT %s;',(2, group_id, num, ))
    rows = cur.fetchall()
    cur.close()
    return reduce(lambda a,b: [{'id':b[0],'content':b[1],'date':str(b[2])}] + a, rows, [])

#ツールに送られたメッセージを取得
def toolFeed(connect, user, tool_id, num):
    #チェック
    cur = connect.cursor()
    cur.execute('SELECT id,content,date,type,author_id FROM message WHERE type=%s AND tool_id=%s ORDER BY date DESC LIMIT %s;',(3, tool_id, num, ))
    rows = cur.fetchall()
    cur.close()
    return reduce(lambda a,b: [{'id':b[0],'content':b[1],'date':str(b[2])}] + a, rows, [])

#プロジェクトに送られたメッセージを取得
def projectFeed(connect, user, project_id, num):
    #チェック
    cur = connect.cursor()
    cur.execute('SELECT id,content,date,type,author_id FROM message WHERE type=%s AND project_id=%s ORDER BY date DESC LIMIT %s;',(4, project_id, num, ))
    rows = cur.fetchall()
    cur.close()
    return reduce(lambda a,b: [{'id':b[0],'content':b[1],'date':str(b[2])}] + a, rows, [])

#ツールへのコミットを取得
def toolCommit(connect, user, tool_id, num):
    #チェック
    cur = connect.cursor()
    cur.execute('SELECT tool_commit.id,tool_commit.comment,tool_commit.date FROM tool_commit INNER JOIN user_has_tool ON user_has_tool.tool_uri = tool_commit.tool_key AND user_has_tool.tool_uri=%s AND user_has_tool.user_id = %s AND user_has_tool.permission = 1  ORDER BY date DESC LIMIT %s;',(tool_id, user['id'], num, ))
    rows = cur.fetchall()
    cur.close()
    return reduce(lambda a,b: [{'id':b[0],'content':'tool commit:'+b[1].decode('utf-8'),'date':str(b[2])}] + a, rows, [])


#自分が作成したメッセージを取得する
def getMyMessage(connect, user, num):
    cur = connect.cursor()
    cur.execute('SELECT id,content,date,type,author_id FROM message WHERE type=%s AND author_id=%s LIMIT %s;',(1, user['id'], num, ))
    rows = cur.fetchall()
    cur.close()
    return reduce(lambda a,b: [{'id':b[0],'content':b[1],'date':str(b[2])}] + a, rows, [])

#MyFeedにメッセージを付ける
def sendMessageToMyFeed(connect, user, content):
    if content.encode('utf-8') >= 255:
        return False
    cur = connect.cursor()
    d = datetime.datetime.today()
    cur.execute('INSERT INTO message (content, date, type, author_id) VALUES(%s,%s,%s,%s);',(content.encode('utf-8'), d.strftime("%Y-%m-%d"), 0, user['id'], ))
    connect.commit()
    cur.close()
    return True

#ユーザにメッセージを送る
def sendMessageToUser(connect, user, user_id, content):
    if content.encode('utf-8') >= 255:
        return False
    cur = connect.cursor()
    d = datetime.datetime.today()
    cur.execute('INSERT INTO message (content, date, type, author_id, user_id) VALUES(%s,%s,%s,%s,%s);',(content.encode('utf-8'), d.strftime("%Y-%m-%d"), 1, user['id'], user_id, ))
    connect.commit()
    cur.close()
    return True

#グループにメッセージを付ける
def sendMessageToGroup(connect, user, group_id, content):
    if content.encode('utf-8') >= 255:
        return False
    cur = connect.cursor()
    d = datetime.datetime.today()
    cur.execute('INSERT INTO message (content, date, type, author_id, user_id) VALUES(%s,%s,%s,%s,%s);',(content.encode('utf-8'), d.strftime("%Y-%m-%d"), 2, user['id'], group_id, ))
    connect.commit()
    cur.close()
    return True

#ツールにメッセージを付ける
def sendMessageToTool(connect, user, tool_id, content):
    if content.encode('utf-8') >= 255:
        return False
    cur = connect.cursor()
    d = datetime.datetime.today()
    cur.execute('INSERT INTO message (content, date, type, author_id, tool_id) VALUES(%s,%s,%s,%s,%s);',(content.encode('utf-8'), d.strftime("%Y-%m-%d"), 3, user['id'], tool_id, ))
    connect.commit()
    cur.close()
    return True

#プロジェクトにメッセージをつける
def sendMessageToProject(connect, user, project_id, content):
    if content.encode('utf-8') >= 255:
        return False
    cur = connect.cursor()
    d = datetime.datetime.today()
    cur.execute('INSERT INTO message (content, date, type, author_id, project_id) VALUES(%s,%s,%s,%s,%s);',(content.encode('utf-8'), d.strftime("%Y-%m-%d"), 4, user['id'], project_id, ))
    connect.commit()
    cur.close()
    return True

#システムメッセージを発行する
def sendSystemMessage(connect, user, user_id, content):
    if content.encode('utf-8') >= 255:
        return False
    cur = connect.cursor()
    d = datetime.datetime.today()
    cur.execute('INSERT INTO message (content, date, type, author_id, user_id) VALUES(%s,%s,%s,%s,%s);',(content.encode('utf-8'), d.strftime("%Y-%m-%d"), 5, 0, user_id, ))
    connect.commit()
    cur.close()
    return True
