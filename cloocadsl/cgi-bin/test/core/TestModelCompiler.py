import os
import sys
sys.path.append('../../')
sys.path.append('../../../')
import random
import unittest
import json
from core import ModelCompiler

class TestModelCompiler(unittest.TestCase):
    def setUp(self):
        self.user = {}
        self.user['id'] = 1
        self.user['uname'] = 'syuhei'
    
    def tearDown(self):
        pass

    def test_GenerateCode(self):
        """test for GenerateCode"""
        generator = ModelCompiler.BaseGenerator()
        generator.GenerateCode(self.user, 10);
    #        self.assertEqual(True, result)

# do unittest
suite = unittest.TestLoader().loadTestsFromTestCase(TestModelCompiler)

unittest.TextTestRunner(verbosity=2).run(suite)
