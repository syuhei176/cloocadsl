#!/usr/bin/python

import cgi
import os
import sys
import json
from util import excgi
from ProjectService import *

print('Content-type: text/javascript; charset=utf-8')

form = excgi.getForm()
project_id = form["pid"]

print('')
project = loadProject(project_id)
print(json.dumps(project))
