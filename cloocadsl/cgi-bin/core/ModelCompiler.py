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
import codecs
from ProjectService import *
from MetaModelService import *
import TemplateService
from string import Template as stringTemplate
from mako.exceptions import RichTraceback

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
        self.templates = {}
    
    def GenerateCode(self, user, pid):
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        project = loadProject(user, pid, connect)
        metamodel = loadMetaModel(connect, user, project['metamodel_id'], check=False)
        files = TemplateService.tree(project['metamodel_id'], connect)
        connect.close()
        for f in files:
            self.templates[f['name']] = f['content']
        self.input = self.input + '/t' + str(metamodel['id'])
        self.userpath = self.outpath + '/' + user['uname']
        self.projectpath = self.userpath + '/p' + str(project['id'])
        if not os.path.exists(self.userpath):
            os.mkdir(self.userpath)
        if not os.path.exists(self.projectpath):
            os.mkdir(self.projectpath)
        self.model = parseJSON(project['xml'], metamodel['xml'])
        global message
        message = ''
        self.parseXML(metamodel['template'])
        return message
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
        for e in elem.findall(".//TemplateForDiagram"):
            self.parseTemplateForDiagram(e)
        for e in elem.findall(".//Copy"):
            self.parseCopy(e)
    
    def parseTemplate(self, elem):
        src = elem.get('src')
        dest = elem.get('dest')
        self.FileGen(src, dest)

    def parseTemplateForDiagram(self, elem):
        src = elem.get('src')
        dest = elem.get('dest')
        dname = elem.get('diagram')
        for key in self.model.diagrams:
            if str(self.model.diagrams[key].meta_id) == str(dname):
                template = stringTemplate(dest)
                d = {'id': self.model.diagrams[key].id}
                self.FileGenByDiagram(src, template.substitute(d), self.model.diagrams[key])
    
    def parseCopy(self, elem):
        src = elem.get('src')
        dest = elem.get('dest')
        shutil.copy(self.input + '/' + src, self.projectpath + '/' + dest)
    
    def FileGen(self, src, dest):
        try:
            tmpl = Template(u''+self.templates[src], input_encoding='utf-8')
            buf = StringIO()
            model = self.model
            ctx = Context(buf, root = model)
            tmpl.render_context(ctx)
            hf = codecs.open(self.projectpath + '/' + dest, 'w', encoding='utf-8')
            hf.write(buf.getvalue())
            hf.close()
        except Exception as e:
            global message
            message += e.message
    
    def FileGenByDiagram(self, src, dest, diagram):
        try:
            tmpl = Template(self.templates[src], input_encoding='utf-8')
            buf = StringIO()
            model = diagram
            ctx = Context(buf, root = model)
            tmpl.render_context(ctx)
            hf = codecs.open(self.projectpath + '/' + dest, 'w', encoding='utf-8')
            hf.write(buf.getvalue())
            hf.close()
        except Exception as e:
            global message
            message += e.message
        
def parseJSON(xml, meta_text):
    global g_metamodel_dict
    global g_model_dict
    g_metamodel_dict = json.loads(meta_text)
    g_model_dict = json.loads(xml)
    ConfigureEntity()
    ConfigureReference()
    return g_model

"""
"""
def ConfigureEntity():
    global g_model
    class klass: pass
    setattr(klass, 'diagrams', {})
    setattr(klass, 'objects', {})
    setattr(klass, 'relationships', {})
    setattr(klass, 'properties', {})
    g_model = klass()
    for key in g_model_dict['diagrams']:
        g_model.diagrams[key] = dict2object(g_model_dict['diagrams'][key])
    for key in g_model_dict['objects']:
        g_model.objects[key] = dict2object(g_model_dict['objects'][key])
    for key in g_model_dict['relationships']:
        g_model.relationships[key] = dict2object(g_model_dict['relationships'][key])
    for key in g_model_dict['properties']:
        g_model.properties[key] = dict2object(g_model_dict['properties'][key])

def dict2object(d):
    class klass: pass
    for key in d:
        if isinstance(d[key], dict):
            setattr(klass, key, dict2object(d[key]))
        elif isinstance(d[key], list):
            setattr(klass, key, list2object(d[key]))
        else:
            setattr(klass, key, d[key])
    return klass()

def list2object(l):
    ret = []
    for e in l:
        if isinstance(e, dict):
            ret.append(dict2object(e))
        elif isinstance(e, list):
            ret.append(list2object(e))
        else:
            ret.append(e)
    return ret


def ConfigureReference():
    diagram = g_model.diagrams[str(g_model_dict['root'])]
    meta_diagram = g_metamodel_dict['metadiagrams'][diagram.meta_id]
    setattr(g_model, meta_diagram['name'], diagram)
    for key in g_model.diagrams:
        for obj_id in g_model.diagrams[key].objects:
            obj = g_model.objects[str(obj_id)]
            meta_name = g_metamodel_dict['metaobjects'][obj.meta_id]['name']
            if not hasattr(g_model.diagrams[key], meta_name):
                setattr(g_model.diagrams[key], meta_name, [])
            getattr(g_model.diagrams[key], meta_name).append(obj)
        for rel_id in g_model.diagrams[key].relationships:
            rel = g_model.relationships[str(rel_id)]
            meta_name = g_metamodel_dict['metarelations'][rel.meta_id]['name']
            if not hasattr(g_model.diagrams[key], meta_name):
                setattr(g_model.diagrams[key], meta_name, [])
            getattr(g_model.diagrams[key], meta_name).append(rel)
    for key in g_model.objects:
        if not g_model.objects[key].diagram == None:
            g_model.objects[key].diagram = g_model.diagrams[str(g_model.objects[key].diagram)]
        for plist in g_model.objects[key].properties:
            for prop_id in plist.children:
                prop = g_model.properties[str(prop_id)]
                meta_name = g_metamodel_dict['metaproperties'][plist.meta_id]['name']
                if not hasattr(g_model.objects[key], meta_name):
                    setattr(g_model.objects[key], meta_name, [])
                getattr(g_model.objects[key], meta_name).append(prop)
    for key in g_model.relationships:
        g_model.relationships[key].src = g_model.objects[str(g_model.relationships[key].src)]
        g_model.relationships[key].dest = g_model.objects[str(g_model.relationships[key].dest)]
        for plist in g_model.relationships[key].properties:
            for prop_id in plist.children:
                prop = g_model.properties[str(prop_id)]
                meta_name = g_metamodel_dict['metaproperties'][plist.meta_id]['name']
                if not hasattr(g_model.relationships[key], meta_name):
                    setattr(g_model.relationships[key], meta_name, [])
                getattr(g_model.relationships[key], meta_name).append(prop)


def parse_model_JSON(model_dict, metamodel_dict):
    global g_metamodel_dict
    global g_model_dict
    g_metamodel_dict = metamodel_dict
    g_model_dict = model_dict
    diagram = model_dict['diagrams'][str(model_dict['root'])]
    meta_diagram = metamodel_dict['metadiagrams'][diagram['meta_id']]
    class Model: pass
    setattr(Model, meta_diagram['name'], None)
    global g_model
    g_model = Model()
    setattr(g_model, 'objects', {})
    for key in g_model_dict['objects']:
        obj = g_model_dict['objects'][key]
        meta_obj = g_metamodel_dict['metaobjects'][obj['meta_id']]
        g_model.objects[key] = parse_object_JSON(obj, meta_obj)
    setattr(g_model, meta_diagram['name'], parse_diagram_JSON(diagram, meta_diagram))
    setattr(g_model, 'diagrams', {})
    for key in g_metamodel_dict['metadiagrams']:
        if key == None:
            continue
        meta_diagram = key
        getattr(g_model, 'diagrams')[meta_diagram['name']] = []
    for key in g_model_dict['diagrams']:
        if key == None:
            continue
        diagram = g_model_dict['diagrams'][key]
        meta_diagram = g_metamodel_dict['metadiagrams'][diagram['meta_id']]
        getattr(g_model, 'diagrams')[meta_diagram['name']].append(parse_diagram_JSON(diagram, meta_diagram))
    return g_model

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
    diagram_id = dict['diagram']
    if not diagram_id == None:
        diagram = g_model_dict['diagrams'][str(diagram_id)]
        meta_diagram = g_metamodel_dict['metadiagrams'][diagram['meta_id']]
        setattr(klass, meta_diagram['name'], parse_diagram_JSON(diagram,meta_diagram))
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
    setattr(klass, 'src_id', dict['src'])
    setattr(klass, 'dest_id', dict['dest'])
#    setattr(klass, 'src', g_model.objects[str(dict['src'])])
#    setattr(klass, 'dest', g_model.objects[str(dict['dest'])])
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

def parse_JSON_metamodel(xml):
    return parse_metamodel_JSON(json.loads(xml))

def parse_metamodel_JSON(metamodel_dict):
    class Model: pass
    setattr(Model, 'root', None)
    ret = Model()
    ret.root = parse_diagram_JSON(metamodel_dict['metadiagram'])
    return ret
