# -*- coding: utf-8 -*-

def getAvailableTool():
    cur = connect.cursor()
    cur.execute('SELECT id,tool_uri,name,created_date,head_version,owner FROM tool_info INNER JOIN has_tool ON has_tool.tool_id=tool_info.id AND has_tool.user_id = %s;', (user['id'],))
    rows = cur.fetchall()
    cur.close()
    tools = []
    for i in range(len(rows)):
        tool = {}
        tool['id'] = rows[i][0]
        tool['uri'] = rows[i][1]
        tool['name'] = rows[i][2].decode('utf-8')
        tool['created_date'] = str(rows[i][3])
        tool['head_version'] = rows[i][4]
        tool['owner'] = rows[i][5]
        tools.append(tool)
    return tools

def getDeveloppingTool():
    cur = connect.cursor()
    cur.execute('SELECT id,tool_uri,name,created_date,head_version,owner FROM tool_info INNER JOIN has_tool ON has_tool.tool_id=tool_info.id AND has_tool.user_id = %s AND has_tool.permission = 1;', (user['id'],))
    rows = cur.fetchall()
    cur.close()
    tools = []
    for i in range(len(rows)):
        tool = {}
        tool['id'] = rows[i][0]
        tool['uri'] = rows[i][1]
        tool['name'] = rows[i][2].decode('utf-8')
        tool['created_date'] = str(rows[i][3])
        tool['head_version'] = rows[i][4]
        tool['owner'] = rows[i][5]
        tools.append(tool)
    return tools
