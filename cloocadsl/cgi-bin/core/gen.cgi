#!/usr/bin/python

import cgi
import os
import sys
import json
sys.path.append('../')
from util import excgi
from UserService import *
from ModelCompiler import *

print 'Content-type: text/javascript; charset=utf-8\n'

form = excgi.getForm()


user = GetUser()

if user == None:
    print('null')
    sys.exit()

generator = BaseGenerator()

generator.GenerateCode(user, int(form['pid']));
