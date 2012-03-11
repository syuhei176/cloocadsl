import sys
import os
from mako.template import Template
from mako.lookup import TemplateLookup
from mako.runtime import Context
from StringIO import StringIO
import config
from core.Controller.ModelService import *

def CreateClass():
    class klass: pass
    setattr(klass, 'name', None)
    return klass

def GenerateClass(dict):
    class klass: pass
    for k in dict.keys():
        setattr(klass, k, None)

class BaseGenerator(object):
    
    def __init__(self, outpath):
        self.outpath = config.CLOOCA_CGI + '/out/' + outpath
    
    def GenerateCode(self):
        model = GetModel(1)
#        self.FileGen(model, config.CLOOCA_CGI + '/template/t1.mako', self.outpath)
        self.FileGen(model, 'template/t1.mako', self.outpath)
    
    def FileGen(self, model, in_path, outpath):
        mylookup = TemplateLookup(directories=["../"], output_encoding="utf-8", encoding_errors='replace')
        tmpl = mylookup.get_template(in_path)
        buf = StringIO()
        ctx = Context(buf, root = model)
        tmpl.render_context(ctx)
        hf = open(outpath, 'w')
        hf.write(buf.getvalue())
        hf.close()

    