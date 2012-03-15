#!/usr/bin/python

import cgi
import os
import sys
import json
sys.path.append('../')
from util import excgi
from UserService import *
from MetaModelService import *
from ProjectService import *

excgi.Header()

form = excgi.getForm()

excgi.Content()

user = GetUser()

if user == None:
    print('null')
    sys.exit()
    
dashboard = {}

dashboard['mymetamodels'] = loadMyMetaModelList(user)
dashboard['projects'] = loadMyProjectList(user)
dashboard['metamodels'] = loadMetaModelList()
print(json.dumps(dashboard))
