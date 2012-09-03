import sys, json

def diff(a,b):
    return compareTree(a, b)

def getType(a):
    if isinstance(a, dict):
        return 'object'
    if isinstance(a, list):
        return 'array'
    if isinstance(a, str):
        return 'string'
    if isinstance(a, int):
        return 'number'
    return 'null'

def compareTree(a, b):
    diff = {'_sys_diff':{}}
    a_type = getType(a)
    b_type = getType(b)
    if a_type == b_type:
        if a_type == 'object' or a_type == 'array':
            pass
        else:
            if a == b:
                return a
            else:
                return {'+':a,'-':b}
    else:
        return {'+':a,'-':b}
    for key in a:
        diff[key] = None
    for key in b:
        diff[key] = None
    for key in diff:
        if key in a and key in b:
            diff[key] = compareTree(a[key], b[key])
        elif key in a:
            diff['_sys_diff'][key] = '+'
            diff[key] = a[key]
        elif key in b:
            diff['_sys_diff'][key] = '-'
            diff[key] = b[key]
        else:
            pass
    return diff
