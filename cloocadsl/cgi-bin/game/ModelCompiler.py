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
from core.MetaModelService import *
from core import TemplateService
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
    
    def GenerateCode(self, user, pid, target):
        connect = MySQLdb.connect(db=config.DB_NAME, host=config.DB_HOST, port=config.DB_PORT, user=config.DB_USER, passwd=config.DB_PASSWD)
        project = loadProject(connect, user, pid)
        metamodel = loadMetaModel(connect, user, project['metamodel_id'], check=False)
        files = TemplateService.tree(project['metamodel_id'], connect)
        connect.close()
        for f in files:
            if f['path'] == target:
                self.templates[f['name']] = f['content']
        self.input = self.input + '/t' + str(metamodel['id'])
        self.userpath = self.outpath + '/' + user['uname']
        self.projectpath = self.userpath + '/p' + str(project['id'])
        if not os.path.exists(self.userpath):
            os.mkdir(self.userpath)
        #clear directory
        if os.path.exists(self.projectpath):
            shutil.rmtree(self.projectpath)
        if not os.path.exists(self.projectpath):
            os.mkdir(self.projectpath)
        #
        self.model = parseJSON(project['xml'], metamodel['xml'])
        global message
        message = ''
        global output_text
        output_text = ''
        wbconf = json.loads(metamodel['config']);
        for t in wbconf['targets']:
            if t['name'] == target:
                self.parseXML(t)
        return output_text
    
    def parseXML(self, target_conf):
        for m in target_conf['mapping']:
            self.parseDirTemp(m)
    
    def parseDirTemp(self, m):
        if m['type'] == 'template':
            self.parseTemplate(m)
        if m['type'] == 'template_diagram':
            self.parseTemplateForDiagram(m)
        if m['type'] == 'copy':
            self.parseCopy(m)
    
    def parseTemplate(self, m):
        src = m['src']
        dest = m['dest']
        self.FileGen(src, dest)

    def parseTemplateForDiagram(self, m):
        src = m['src']
        dest = m['dest']
        diagram = m['diagram']
        for key in self.model.diagrams:
            if str(self.model.diagrams[key].meta_id) == str(diagram):
                template = stringTemplate(dest)
                d = {'id': self.model.diagrams[key].id}
                self.FileGenByDiagram(src, template.substitute(d), self.model.diagrams[key])
    
    def parseCopy(self, m):
        src = m['src']
        dest = m['dest']
        self.templates[src]
        hf = codecs.open(self.projectpath + '/' + dest, 'w', encoding='utf-8')
        hf.write(self.templates[src])
        hf.close()
    
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
        global output_text
        try:
            tmpl = Template(self.templates[src], input_encoding='utf-8')
            buf = StringIO()
            model = diagram
            ctx = Context(buf, root = model)
            tmpl.render_context(ctx)
            #hf = codecs.open(self.projectpath + '/' + dest, 'w', encoding='utf-8')
            #hf.write(buf.getvalue())
            #hf.close()
            output_text += buf.getvalue()
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
    meta_diagram = g_metamodel_dict['metadiagrams'][str(diagram.meta_id)]
    setattr(g_model, meta_diagram['name'], diagram)
    for key in g_model.diagrams:
        for obj_id in g_model.diagrams[key].objects:
            obj = g_model.objects[str(obj_id)]
            meta_name = g_metamodel_dict['metaobjects'][str(obj.meta_id)]['name']
            if not hasattr(g_model.diagrams[key], meta_name):
                setattr(g_model.diagrams[key], meta_name, [])
            getattr(g_model.diagrams[key], meta_name).append(obj)
        for rel_id in g_model.diagrams[key].relationships:
            rel = g_model.relationships[str(rel_id)]
            meta_name = g_metamodel_dict['metarelations'][str(rel.meta_id)]['name']
            if not hasattr(g_model.diagrams[key], meta_name):
                setattr(g_model.diagrams[key], meta_name, [])
            getattr(g_model.diagrams[key], meta_name).append(rel)
    for key in g_model.objects:
        if not g_model.objects[key].diagram == None:
            g_model.objects[key].diagram = g_model.diagrams[str(g_model.objects[key].diagram)]
        for plist in g_model.objects[key].properties:
            for prop_id in plist.children:
                prop = g_model.properties[str(prop_id)]
                meta_name = g_metamodel_dict['metaproperties'][str(plist.meta_id)]['name']
                if not hasattr(g_model.objects[key], meta_name):
                    setattr(g_model.objects[key], meta_name, [])
                getattr(g_model.objects[key], meta_name).append(prop)
    for key in g_model.relationships:
        g_model.relationships[key].src = g_model.objects[str(g_model.relationships[key].src)]
        g_model.relationships[key].dest = g_model.objects[str(g_model.relationships[key].dest)]
        for plist in g_model.relationships[key].properties:
            for prop_id in plist.children:
                prop = g_model.properties[str(prop_id)]
                meta_name = g_metamodel_dict['metaproperties'][str(plist.meta_id)]['name']
                if not hasattr(g_model.relationships[key], meta_name):
                    setattr(g_model.relationships[key], meta_name, [])
                getattr(g_model.relationships[key], meta_name).append(prop)
