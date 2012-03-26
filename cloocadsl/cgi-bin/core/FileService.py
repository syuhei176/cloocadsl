import os
import MySQLdb
import md5
import re
import sys
import config


#private method

def GetTemplateDirectory(id):
    temp_path = config.CLOOCA_CGI + '/template/t' + id
    if os.path.exists(temp_path) == False:
        os.mkdir(temp_path)
    return temp_path

#public method
#path = /d/d

def CreateNewFile(user, id, filename):
    projectpath = GetTemplateDirectory(id)
    if os.path.exists(projectpath+'/'+filename):
        return False
    if not projectpath+'/'+os.path.dirname(filename):
        return False
    f = open(projectpath+'/'+filename, 'w')
    return True

def DeleteFileOrDirectory(user, id, filename):
    projectpath = GetTemplateDirectory(id)
    if not os.path.exists(projectpath+'/'+filename):
        return False
    if os.path.isdir(projectpath+'/'+filename):
        os.rmdir(projectpath+'/'+filename)
    else:
        os.remove(projectpath+'/'+filename)
    return True

#@param path : "/"
def GetFileTree(user, id):
    projectpath = GetTemplateDirectory(id)
    files = []
    for f in os.listdir(projectpath):
        filepath = projectpath + '/' + f
        if os.path.isfile(filepath):
            fd = open(filepath, 'r')
            content = ''
            for line in fd:
                content += line
            fd.close()
            files.append({'name' : f, 'content' : content})
#    if os.path.isdir(searchpath + '/' + f):
#       files.append(PrivateGetFileTree(searchpath + '/' + f, f))
    return files

def SaveFile(user, pname, path, content):
    projectpath = GetProjectDirectory(user.username, pname)
    f = open(projectpath+'/'+path, 'w')
    f.write(content)
    f.close()
    return True

def LoadFile(user, pname, path):
    projectpath = GetProjectDirectory(user.username, pname)
    f = open(projectpath+'/'+path, 'r')
    content = ''
    for line in f:
        content += line
    f.close()
    return content
