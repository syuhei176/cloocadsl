# -*- coding: utf-8 -*-

"""
ツールの作成
"""
def create(connect, user, tool_key, tool_name):
    cur = connect.cursor()
    cur.execute('SELECT COUNT(*) FROM tool_info WHERE tool_uri=%s;', (tool_key, ))
    tool_count = cur.fetchone()[0]
    if tool_count != 0:
        cur.close()
        return False
    cur.execute('INSERT INTO tool_info (tool_uri,name,created_date,head_version,owner) VALUES(%s,%s,%s,%s,%s);',(tool_key, tool_name, d.strftime("%Y-%m-%d"), 1, user['id']))
    connect.commit()
    cur.close()
    return True

"""
ワークスペースからツールデータを読み込む
ワークスペースが存在する場合は読み込み
ワークスペースが存在しない場合は、リポジトリからチェックアウト
"""
def load_from_ws(connect, user, tool_key):
    cur = connect.cursor()
    cur.execute('SELECT metamodel,notation,wellcome_message FROM tool_workspace WHERE tool_uri = %s AND user_id = %s;', (tool_key, user['id'],))
    rows = cur.fetchall()
    cur.close()
    if len(rows) == 0:
        tool = checkout(connect, user, tool_key)
        return tool
    tool = {}
    tool['metamodel'] = rows[0][0]
    tool['notaion'] = rows[0][1]
    tool['wellcome_message'] = rows[0][2]
    return tool

"""
"""
def checkout(connect, user, tool_key):
    tool = {}
    cur = connect.cursor()
    cur.execute('SELECT COUNT(*) FROM has_tool WHERE user_id=%s AND tool_uri=%s;', (user['id'], tool_key, ))
    has_tool_count = cur.fetchone()[0]
    if has_tool_count == 0:
        cur.close()
        return None
    cur.execute('SELECT name FROM tool_info WHERE tool_uri = %s;', (tool_key, ))
    rows = cur.fetchall()
    d = datetime.datetime.today()
    cur.execute('INSERT INTO tool_workspace (user_id,tool_uri,checkout_date) VALUES(%s,%s,%s);',(user['id'], tool_key, d.strftime("%Y-%m-%d"), ))
    connect.commit()
    cur.close()
    return tool

"""
"""
def save_to_ws(connect, user, tool_key, metamodel):
    cur = connect.cursor()
    num_of_affected_row = cur.execute('UPDATE tool_workspace SET metamodel=%s WHERE tool_uri=%s AND user_id=%s;', (metamodel, tool_key, user['id'], ))
    connect.commit()
    cur.close()
    return num_of_affected_row != 0

"""
ツールワークスペースを削除する
"""
def uncheckout(connect, user, tool_key):
    cur = connect.cursor()
    cur.execute('DELETE FROM tool_workspace WHERE tool_uri=%s AND user_id=%s;', (tool_key, user['id'], ))
    connect.commit()
    cur.close()
    return True

"""
ツールを削除する
"""
def delete(connect, user, tool_key):
    cur = connect.cursor()
    cur.execute('SELECT COUNT(*) FROM has_tool WHERE user_id=%s AND tool_uri=%s;', (user['id'], tool_key, ))
    has_tool_count = cur.fetchone()[0]
    if has_tool_count == 0:
        cur.close()
        return False
    cur.execute('DELETE FROM tool_info WHERE tool_uri=%s;', (tool_key, ))
    connect.commit()
    cur.close()
    return True

"""
"""
def commit(tool_key):
    cur.execute('SELECT COUNT(*) FROM has_tool WHERE user_id=%s AND tool_uri=%s;', (user['id'], tool_key, ))
    has_tool_count = cur.fetchone()[0]
    if has_tool_count == 0:
        cur.close()
        return None
    return True

"""
"""
def update(tool_key):
    return True

"""
"""
def update_to(tool_key, version):
    return True

"""
"""
def revert(tool_key, version_id):
    return {}
