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

dashboard = {}

dashboard['metamodels'] = loadMyMetaModelList(user)
dashboard['projects'] = loadMyProjectList(user)

print(json.dumps(dashboard))
