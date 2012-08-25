import json

class CloocaResponse(object):
    def __init__(self):
        self.code = 0
        self.content = ''
        self.success = False
    
    def dumps(self):
        return json.dumps({'code':self.code,'content':self.content,'success':self.success})