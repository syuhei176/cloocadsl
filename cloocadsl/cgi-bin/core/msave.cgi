#!/usr/bin/python

import cgi
import os
import sys
import json
from util import excgi
from MetaModelService import *

print 'Content-type: text/javascript; charset=utf-8'

form = excgi.getForm()
id = form["id"]
xml= form["xml"]

print ''
print json.dumps(saveMetaModel(id, xml))
