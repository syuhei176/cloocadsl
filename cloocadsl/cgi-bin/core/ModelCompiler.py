import sys
import os
import shutil
import MySQLdb
import json
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
    
    def __init__(self):
        self.input = config.CLOOCA_CGI + '/template'
        self.outpath = config.CLOOCA_CGI + '/out'
        self.userpath = None
        self.projectpath = None
        self.model = None
    
    def GenerateCode(self, user, pid):
        project = loadProject(user, pid)
        metamodel = loadMetaModel(user, project['metamodel_id'])
        self.input = self.input + '/t' + str(metamodel['id'])
        self.userpath = self.outpath + '/' + user['uname']
        self.projectpath = self.userpath + '/p' + str(project['id'])
        if not os.path.exists(self.userpath):
            os.mkdir(self.userpath)
        if not os.path.exists(self.projectpath):
            os.mkdir(self.projectpath)
        self.model = parseJSON(project['xml'])
        self.parseXML(metamodel['template'])
#        print Template(metamodel['template']).render(root = model)
#        self.FileGen(model, config.CLOOCA_CGI + '/template/t1.mako', self.outpath)
#        self.FileGen(model, 'template/t1.mako', self.outpath)
    
    def parseXML(self, xml):
        elem = fromstring(xml)
        if elem.tag == 'DirTemp':
            return self.parseDirTemp(elem)
    
    def parseDirTemp(self, elem):
        for e in elem.findall(".//Template"):
            self.parseTemplate(e)
        for e in elem.findall(".//Copy"):
            self.parseCopy(e)
    
    def parseTemplate(self, elem):
        src = elem.get('src')
        dest = elem.get('dest')
        self.FileGen(src, dest)
    
    def parseCopy(self, elem):
        src = elem.get('src')
        dest = elem.get('dest')
        shutil.copy(self.input + '/' + src, self.projectpath + '/' + dest)
    
    def FileGen(self, src, dest):
        mylookup = TemplateLookup(directories=[self.input], output_encoding="utf-8", encoding_errors='replace')
        tmpl = mylookup.get_template(src)
        buf = StringIO()
        model = self.model
        ctx = Context(buf, root = model)
        tmpl.render_context(ctx)
        hf = open(self.projectpath + '/' + dest, 'w')
        hf.write(buf.getvalue())
        hf.close()

def parseJSON(xml):
    return parse_model_JSON(json.loads(xml))

def parse_model_JSON(model_dict):
    class Model: pass
    setattr(Model, 'root', None)
    ret = Model()
    ret.root = parse_diagram_JSON(model_dict['root'])
    return ret

def parse_diagram_JSON(diagram):
    class klass: pass
    id = diagram['id']
    setattr(klass, 'id', id)
    setattr(klass, 'objects', [])
    setattr(klass, 'relationships', [])
    ret = klass()
    for i in range(len(diagram['objects'])):
        ret.objects.append(parse_object_JSON(diagram['objects'][i]))
    for i in range(len(diagram['relationships'])):
        ret.relationships.append(parse_relationship_JSON(diagram['relationships'][i]))
    return ret

def parse_object_JSON(dict):
    class klass: pass
    id = dict['id']
    meta_id = dict['meta_id']
    x = dict['bound']['x']
    y = dict['bound']['y']
    setattr(klass, 'id', id)
    setattr(klass, 'meta_id', meta_id)
    setattr(klass, 'x', x)
    setattr(klass, 'y', y)
    setattr(klass, 'properties', [])
    ret = klass()
    for i in range(len(dict['properties'])):
        ret.properties.append(parse_propertylist_JSON(dict['properties'][i]))
    return ret

def parse_relationship_JSON(dict):
    class klass: pass
    setattr(klass, 'id', dict['id'])
    setattr(klass, 'meta_id', dict['meta_id'])
    setattr(klass, 'src', dict['src'])
    setattr(klass, 'dest', dict['dest'])
    setattr(klass, 'properties', [])
    ret = klass()
    for i in range(len(dict['properties'])):
        ret.properties.append(parse_propertylist_JSON(dict['properties'][i]))
    return ret

def parse_propertylist_JSON(plist):
    class klass: pass
    setattr(klass, 'meta_id', plist['meta_id'])
    setattr(klass, 'children', [])
    ret = klass()
    for i in range(len(plist['children'])):
        ret.children.append(parse_property_JSON(i, plist['children'][i]))
    return ret

def parse_property_JSON(i, prop):
    class klass: pass
#    setattr(klass, 'id', prop['id'])
    setattr(klass, 'value', '')
    ret = klass();
    ret.value = prop['value']
    return ret

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
    meta_id = elem.get('meta_id')
    x = elem.get('x')
    y = elem.get('y')
    setattr(klass, 'id', id)
    setattr(klass, 'meta_id', meta_id)
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
