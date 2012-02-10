import os
import MySQLdb

connect = MySQLdb.connect(db=config.DB2_NAME, host=config.DB2_HOST, port=config.DB2_PORT, user=config.DB2_USER, passwd=config.DB2_PASSWD)

def getConnection():
    return connect
    
def ConnectDB():
    connect = MySQLdb.connect(db=config.DB2_NAME, host=config.DB2_HOST, port=config.DB2_PORT, user=config.DB2_USER, passwd=config.DB2_PASSWD)

def CloseDB():
    connect.close()
