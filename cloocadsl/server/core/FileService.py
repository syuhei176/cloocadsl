# -*- coding: utf-8 -*-
import os
import re
import sys
import codecs
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
            files.append({'name' : f, 'list' : [], 'type' : 'file', 'content' : content})
        if os.path.isdir(filepath):
            files.append(PrivateGetFileTree(filepath, f))
    return files

def PrivateGetFileTree(path, name):
  dict = {}
  dict['name'] = name
  dict['list'] = []
  dict['type'] = 'dir'
  for f in os.listdir(path):
    filepath = os.path.normpath(path + '/' + f)
    if os.path.isfile(filepath):
      fd = open(filepath, 'r')
      content = ''
      for line in fd:
        content += line
      fd.close()
      dict['list'].append({'name' : f, 'list' : [], 'type' : 'file', 'content' : content})
    if os.path.isdir(filepath):
       dict['list'].append(PrivateGetFileTree(filepath, f))
  return dict

def SaveFile(user, id, path, content):
    projectpath = GetTemplateDirectory(id)
#    f = open(projectpath+'/'+path, 'w')
    f = codecs.open(projectpath+'/'+path, 'w', encoding='utf-8')
    f.write(content)
    f.close()
    return True

def LoadFile(user, pnaidme, path):
    projectpath = GetTemplateDirectory(id)
    f = open(projectpath+'/'+path, 'r')
    content = ''
    for line in f:
        content += line
    f.close()
    return content
