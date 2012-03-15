#!/usr/bin/python

import cgi
import os
import sys
import json
import zipfile
sys.path.append('../')
import config
from util import excgi
from UserService import *

print "Content-type: application/octet-stream;"

form = excgi.getForm()

project_id = form["pid"]

user = GetUser()

print "Content-Disposition: attachment; filename=p"+project_id+".zip;"
print '\n'

if user == None:
  print 'null'
else:
  userpath = config.CLOOCA_CGI+'/out/' + user['uname']
  projectpath = userpath + '/p' + project_id
  filepath = projectpath + '/p' + project_id + '.zip'
  if os.path.exists(projectpath) == True:
    if os.path.exists(filepath) == True:
      os.remove(filepath)
    zip = zipfile.ZipFile(filepath, 'w', zipfile.ZIP_DEFLATED)
    filelist=os.listdir(projectpath)
    for n in range(len(filelist)):
      if not filelist[n].encode('ascii') == 'p' + project_id+'.zip':
        zip.write(projectpath + '/' + filelist[n].encode('ascii'), filelist[n].encode('ascii'))
    zip.close()
    f = open(filepath, 'rb')
    print f.read()
    os.remove(filepath)
  else:
    print 'null'
