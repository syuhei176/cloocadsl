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
        self.model = parseJSON(project['xml'], metamodel['xml'])
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

def parseJSON(xml, meta_text):
    return parse_model_JSON(json.loads(xml), json.loads(meta_text))

def parse_model_JSON(model_dict, metamodel_dict):
    global g_metamodel_dict
    global g_model_dict
    g_metamodel_dict = metamodel_dict
    g_model_dict = model_dict
    diagram = model_dict['diagrams'][str(model_dict['root'])]
    meta_diagram = metamodel_dict['metadiagrams'][diagram['meta_id']]
    class Model: pass
    setattr(Model, meta_diagram['name'], None)
    ret = Model()
    setattr(ret, meta_diagram['name'], parse_diagram_JSON(diagram, meta_diagram))
    return ret

def parse_diagram_JSON(diagram, metadiagram_dict):
    class klass: pass
    id = diagram['id']
    setattr(klass, 'id', id)
    setattr(klass, 'objects', [])
    setattr(klass, 'relationships', [])
    for i in range(len(metadiagram_dict['metaobjects'])):
        metaobj = g_metamodel_dict['metaobjects'][metadiagram_dict['metaobjects'][i]]
        setattr(klass, metaobj['name'], [])
    for i in range(len(metadiagram_dict['metarelations'])):
        metarel = g_metamodel_dict['metarelations'][metadiagram_dict['metarelations'][i]]
        setattr(klass, metarel['name'], [])
    ret = klass()
    for i in range(len(diagram['objects'])):
        obj_dict = g_model_dict['objects'][str(diagram['objects'][i])]
        if obj_dict['ve']['ver_type'] == 'delete':
            continue
        meta_id = obj_dict['meta_id']
        obj = parse_object_JSON(obj_dict, g_metamodel_dict['metaobjects'][meta_id])
        getattr(ret, g_metamodel_dict['metaobjects'][meta_id]['name']).append(obj)
        ret.objects.append(obj)
    for i in range(len(diagram['relationships'])):
        rel_dict = g_model_dict['relationships'][str(diagram['relationships'][i])]
        if rel_dict['ve']['ver_type'] == 'delete':
            continue
        meta_id = rel_dict['meta_id']
        rel = parse_relationship_JSON(rel_dict)
        getattr(ret, g_metamodel_dict['metarelations'][meta_id]['name']).append(rel)
        ret.relationships.append(rel)
    return ret

def parse_object_JSON(dict, metaobject_dict):
    class klass: pass
    id = dict['id']
    meta_id = dict['meta_id']
    x = dict['bound']['x']
    y = dict['bound']['y']
    setattr(klass, 'id', id)
    setattr(klass, 'meta_id', meta_id)
    setattr(klass, 'x', x)
    setattr(klass, 'y', y)
#    for k in range(len(metaobject_dict['properties'])):
#        meta_prop = g_metamodel_dict['metaproperties'][metaobject_dict['properties'][k]]
#        setattr(klass, meta_prop['name'], None)
    setattr(klass, 'properties', [])
    ret = klass()
    for i in range(len(dict['properties'])):
        meta_prop = g_metamodel_dict['metaproperties'][dict['properties'][i]['meta_id']]
        prop = parse_propertylist_JSON(dict['properties'][i])
        setattr(klass, meta_prop['name'], prop)
        ret.properties.append(prop)
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
        ret.children.append(parse_property_JSON(i, g_model_dict['properties'][str(plist['children'][i])]))
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

def parse_JSON_metamodel(xml):
    return parse_metamodel_JSON(json.loads(xml))

def parse_metamodel_JSON(metamodel_dict):
    class Model: pass
    setattr(Model, 'root', None)
    ret = Model()
    ret.root = parse_diagram_JSON(metamodel_dict['metadiagram'])
    return ret
