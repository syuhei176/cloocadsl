# -*- coding: utf-8 -*-
import sys

def diff(a,b):
    return compareTree(a, b)

def getType(a):
    if isinstance(a, dict):
        return 'object'
    elif isinstance(a, list):
        return 'array'
    elif isinstance(a, str):
        return 'string'
    elif isinstance(a, int):
        return 'number'
    elif isinstance(a, bool):
        return 'boolean'
    return 'null'

def compareTree(a, b):
    diff = {'_sys_diff':{}}
    a_type = getType(a)
    b_type = getType(b)
    if a_type == b_type:
        if a_type == 'object':
            return compareTree_dict(a, b)
        elif a_type == 'array':
            return compareTree_list(a, b)
        else:
            if a == b:
                return a
            else:
                return {'+':a,'-':b}
    else:
        return {'+':a,'-':b}

def compareTree_dict(a, b):
    diff = {'_sys_diff':{}}
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
            print 'error ' + key
    return diff

def compareTree_list(a, b):
    diff = []
    for i in a:
        diff.append(i)
    for i in b:
        if i in diff:
            pass
        else:
            diff.append(i)
    return diff

def merge_part(a, b):
    if isinstance(a, str):
        return a
    if isinstance(a, int):
        return a
    if isinstance(a, bool):
        return a
    if isinstance(a, dict):
        pass
    if isinstance(a, list):
        return a
    result = {}
    keys = {}
    for key in a:
        keys[key] = None
    for key in b:
        keys[key] = None
    for key in keys:
        if key == '_sys_diff':
            continue
        #if key[0:4] == '_sys':
        #    continue
        state = 0
        if a.has_key('_sys_diff') and key in a['_sys_diff']:
            if a['_sys_diff'][key] == '+':
                state = 0
            elif a['_sys_diff'][key] == '-':
                state = 1
        else:
            state = 2
        if b.has_key('_sys_diff') and key in b['_sys_diff']:
            if b['_sys_diff'][key] == '+':
                state += 3 * 0
            elif b['_sys_diff'][key] == '-':
                state += 3 * 1
        else:
            state += 3 * 2
        if state == 0:
            #
            #a=+ b=+
            result[key] = merge_part(a[key], b[key])
        elif state == 1:
            #- +
            pass
        elif state == 2:
            #none +
            result[key] = b[key]
        elif state == 3:
            #+ -
            pass
        elif state == 4:
            #- -
            pass
        elif state == 5:
            #none -
            pass
        elif state == 6:
            #+ none
            result[key] = a[key]
        elif state == 7:
            #- none
            pass
        elif state == 8:
            #none none
            if a.has_key(key) and b.has_key(key):
                result[key] = merge_part(a[key], b[key])
            elif a.has_key(key):
                result[key] = a[key]
            elif b.has_key(key):
                result[key] = b[key]
        elif state == 9:
            pass
    return result

def clean_sys_diff(a):
    if isinstance(a, dict):
        if a.has_key('_sys_diff'):
            del a['_sys_diff']
        for key in a:
            clean_sys_diff(a[str(key)])
        
def merge(src, dest, base):
    src_diff = diff(src, base)
    dest_diff = diff(dest, base)
    merged_model = merge_part(src_diff, dest_diff)
    clean_sys_diff(merged_model)
    return merged_model

if __name__ == '__main__':
    import json
    jsondiff={}
    jsondict_base={'a':
                   {'b':{
                         'array':[{'x':0,'y':5}]
                         },
                    'c':{
                         'text':'aaa',
                         'bool':True,
                         'num':5
    }}}
    jsondict_a={'a':
                   {'b':{
                         'array':[{'x':0,'y':5}],
                         'bool':True
                         },
                    'c':{
                         'text':'aaa',
                         'bool':True,
                         'num':5
    }}}
    jsondict_b={'a':
                   {'b':{
                         'array':[{'x':0,'y':5}]
                         },
                    'c':{
                         'text':'aaa',
                         'bool':True
    }}}
    jsondiff = merge(jsondict_a, jsondict_b, jsondict_base)
    print json.dumps(jsondiff)
