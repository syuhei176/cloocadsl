# -*- coding: utf-8 -*-

"""
プロジェクトの作成
"""
def create(connect, user, project_key, project_name, tool_uri):
    cur = connect.cursor()
    cur.execute('SELECT COUNT(*) FROM project_info WHERE project_key=%s;', (project_key, ))
    project_count = cur.fetchone()[0]
    if project_count != 0:
        cur.close()
        return False
    cur.execute('INSERT INTO project_info (project_key,name,tool_key,creation_date,head_version,owner) VALUES(%s,%s,%s,%s,%s,%s);',(project_key, project_name, tool_uri, d.strftime("%Y-%m-%d"), 1, user['id']))
    connect.commit()
    cur.close()
    return True

"""
ワークスペースからプロジェクトデータを読み込む
ワークスペースが存在する場合は読み込み
ワークスペースが存在しない場合は、リポジトリからチェックアウト
"""
def load_from_ws(connect, user, project_key):
    cur = connect.cursor()
    cur.execute('SELECT model FROM project_workspace WHERE project_key = %s AND user_id = %s;', (project_key, user['id'],))
    rows = cur.fetchall()
    cur.close()
    if len(rows) == 0:
        project = checkout(connect, user, project_key)
        return project
    project = {}
    project['model'] = rows[0][0]
    return project

"""
"""
def checkout(connect, user, project_key):
    project = {}
    cur = connect.cursor()
    cur.execute('SELECT visibbility FROM has_project WHERE user_id=%s AND project_key=%s;', (user['id'], project_key, ))
    has_project_count = cur.fetchone()[0]
    if has_project_count == 0:
        cur.close()
        return None
    cur.execute('SELECT name FROM project_info WHERE project_key = %s;', (project_key, ))
    rows = cur.fetchall()
    d = datetime.datetime.today()
    cur.execute('INSERT INTO project_workspace (user_id,project_key,checkout_date) VALUES(%s,%s,%s);',(user['id'], project_key, d.strftime("%Y-%m-%d"), ))
    connect.commit()
    cur.close()
    return project

"""
"""
def save_to_ws(connect, user, project_key, model):
    cur = connect.cursor()
    num_of_affected_row = cur.execute('UPDATE project_workspace SET model=%s WHERE project_key=%s AND user_id=%s;', (model, project_key, user['id'], ))
    connect.commit()
    cur.close()
    return num_of_affected_row != 0

"""
プロジェクトワークスペースを削除する
"""
def uncheckout(connect, user, project_key):
    cur = connect.cursor()
    cur.execute('DELETE FROM project_workspace WHERE project_key=%s AND user_id=%s;', (project_key, user['id'], ))
    connect.commit()
    cur.close()
    return True

"""
プロジェクトを削除する
"""
def delete(connect, user, project_key):
    cur = connect.cursor()
    cur.execute('SELECT COUNT(*) FROM has_project WHERE user_id=%s AND project_key=%s;', (user['id'], project_key, ))
    has_project_count = cur.fetchone()[0]
    if has_project_count == 0:
        cur.close()
        return False
    cur.execute('DELETE FROM project_info WHERE project_key=%s;', (project_key, ))
    connect.commit()
    cur.close()
    return True

"""
"""
def commit(project_key):
    cur.execute('SELECT COUNT(*) FROM has_project WHERE user_id=%s AND project_key=%s;', (user['id'], project_key, ))
    has_project_count = cur.fetchone()[0]
    if has_project_count == 0:
        cur.close()
        return None
    return True

"""
"""
def update(project_key):
    return True

"""
"""
def update_to(project_key, version):
    return True

"""
"""
def revert(project_key, version_id):
    return {}
