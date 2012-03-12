import sys
import os
import MySQLdb
from mako.template import Template
from mako.lookup import TemplateLookup
from mako.runtime import Context
from StringIO import StringIO
import config
from ProjectService import *
from MetaModelService import *

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
    
    def GenerateCode(self, pid):
        project = loadProject(pid)
        metamodel = loadMetaModel(project['metamodel_id'])
        model = parse(project['xml'])
        print Template(metamodel['template']).render(root = model)
#        self.FileGen(model, config.CLOOCA_CGI + '/template/t1.mako', self.outpath)
#        self.FileGen(model, 'template/t1.mako', self.outpath)
    
    def FileGen(self, model, in_path, outpath):
        mylookup = TemplateLookup(directories=["../"], output_encoding="utf-8", encoding_errors='replace')
        tmpl = mylookup.get_template(in_path)
        buf = StringIO()
        ctx = Context(buf, root = model)
        tmpl.render_context(ctx)
        hf = open(outpath, 'w')
        hf.write(buf.getvalue())
        hf.close()

class Model: pass

def parse(xml):
    elem = fromstring(xml)
    if elem.tag == 'Model':
        return parse_model(elem)

def parse_model(elem):
    model = Model()
    id = elem.get('id')
    for e in elem.findall(".//Diagram"):
        setattr(model, 'root', None)
        model.root = parse_diagram(e)
    return model

def parse_diagram(elem):
    class klass: pass
    id = elem.get('id')
    setattr(klass, 'id', id)
    setattr(klass, 'objects', [])
    setattr(klass, 'relationships', [])
    diagram = klass()
    for e in elem.findall(".//Object"):
        diagram.objects.append(parse_object(e))
    for e in elem.findall(".//Relationship"):
        diagram.relationships.append(parse_relationship(e))
    return diagram

def parse_object(elem):
    class klass: pass
    id = elem.get('id')
    x = elem.get('x')
    y = elem.get('y')
    setattr(klass, 'id', id)
    setattr(klass, 'x', x)
    setattr(klass, 'y', y)
    setattr(klass, 'properties', [])
    obj = klass()
    for e in elem.findall(".//Property"):
        obj.properties.append(parse_property(e))
    return obj

def parse_relationship(elem):
    class klass: pass
    id = elem.get('id')
    src = elem.get('src')
    dest = elem.get('dest')
    setattr(klass, 'id', id)
    setattr(klass, 'src', src)
    setattr(klass, 'dest', dest)
    setattr(klass, 'properties', [])
    rel = klass()
    for e in elem.findall(".//Property"):
        rel.properties.append(parse_property(e))
    return rel

def parse_property(elem):
    class klass: pass
    id = elem.get('id')
    value = elem.text
    setattr(klass, 'id', id)
    setattr(klass, 'value', value)
    return klass()
