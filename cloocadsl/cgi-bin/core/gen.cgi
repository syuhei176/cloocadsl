#!/usr/bin/python

import cgi
import os
import sys
import json
sys.path.append('../')
from util import excgi
from ModelCompiler import *

print 'Content-type: text/javascript; charset=utf-8\n'

form = excgi.getForm()

generator = BaseGenerator('t1.txt')

generator.GenerateCode(int(form['pid']));
