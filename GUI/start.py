from flask import Flask, render_template
from flask_cors import CORS

from flask import request
import sqlite3
import json
from collections import deque
import subprocess
import threading
# This is the Task Queue. The worker thread will pull commands for execution from the task queue.
taskQueue = deque()
taskStatus = []


def processQueue():
    while(True):
        if(taskQueue):
            subprocess.Popen(taskQueue.popleft(), shell=True) # start 



app = Flask(__name__)
CORS(app)
db = None
def connect():
    conn = sqlite3.connect("anveshak.db")
    print("Connected to anveshak database!")
    return conn







# DATABASE MANAGEMENT

def generateSchema(conn):
    
    conn.execute("CREATE TABLE IF NOT EXISTS topics(topic TEXT NOT NULL, topic_desc TEXT NOT NULL, message_type TEXT NOT NULL)")
    conn.execute("CREATE TABLE IF NOT EXISTS nodes(nodename TEXT NOT NULL, start_command TEXT NOT NULL, kill_command TEXT NOT NULL)")
    
    conn.commit()
def deleteTopic(conn,topic):
    query = "DELETE from topics where topic='%s'" %(topic)
    conn.execute(query)
    conn.commit()
def addTopic(conn,topic,topic_desc,msgtype):
    query = "INSERT INTO topics(topic,topic_desc,message_type) VALUES('%s','%s','%s')" %(topic,topic_desc,msgtype)
    conn.execute(query)
    conn.commit()
def addNode(conn,nodename,scommand,kcommand):
    query = "INSERT INTO nodes(nodename,start_command,kill_command) VALUES('%s','%s','%s')" %(nodename,scommand,kcommand)
    conn.execute(query)
    conn.commit()




def getTopics(conn):
    cursor = conn.execute("SELECT * FROM topics")
    rows = cursor.fetchall()


    return  rows

def getNodes(conn):
    cursor = conn.execute("SELECT * FROM nodes")
    rows = cursor.fetchall()


    return  rows


# API ROUTES


@app.route('/api/addtopic/')
def addtopic():
    topic = request.args.get("topic")
    topicdesc = request.args.get("topicdesc")
    msgtype = request.args.get("msgtype")
    addTopic(connect(),topic,topicdesc,msgtype)
    return "Done"

@app.route('/api/addnode/')
def addnode():
    nodename = request.args.get("nodename")
    scommand = request.args.get("scommand")
    kcommand = request.args.get("kcommand")
    
    addNode(connect(),nodename,scommand,kcommand)
    return "Done"

@app.route('/api/startnode')
def startnode():
    conn = connect()
    nodename = request.args.get("nodename")
    query = "SELECT * FROM nodes where nodename='%s'" %(nodename)
    cursor = conn.execute(query)
    command = None
    for r in cursor:
        command = r[1]
    if(command != None):
        taskQueue.append(command)
    return "queued to start"
@app.route('/api/killnode')
def killnode():
    conn = connect()
    nodename = request.args.get("nodename")
    query = "SELECT * FROM nodes where nodename='%s'" %(nodename)
    cursor = conn.execute(query)
    command = None
    for r in cursor:
        command = r[2]
    if(command != None):
        taskQueue.append(command)
    return "queued to kill"


@app.route('/api/deletetopic/')
def deletetopic():
    topic = request.args.get("topic")
    deleteTopic(connect(),topic)
    return "Done"

@app.route('/api/nodes')
def nodes():
    return json.dumps(getNodes(connect()))


    


@app.route('/api/topics')
def topics():
    return json.dumps(getTopics(connect()))

  

@app.route('/api/<name>')
def hello_name(name):
    return "Hello {}!".format(name)

if __name__ == '__main__':
    db = connect()
    worker = threading.Thread(target=processQueue)
    worker.daemon = True
    worker.start()
    generateSchema(db)
    app.run()
