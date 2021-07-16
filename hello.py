from flask import Flask, json, jsonify, request
from flask.helpers import make_response
from markupsafe import escape
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app) #to allow for permission

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route('/all', methods = ['GET'])
def all_apps():
    #connect SQL
    db = pymysql.connect(host="localhost", user="root", password="", database="flask")
    cursor = db.cursor(pymysql.cursors.DictCursor)
    cursor.execute("select * from Apps")
    db.commit()
    out = cursor.fetchall()
    return jsonify(out)


@app.route('/new', methods = ['POST'])
def new_app():
    #connect SQL
    db = pymysql.connect(host="localhost", user="root", password="", database="flask")
    cursor = db.cursor(pymysql.cursors.DictCursor)
    if request.method == 'POST':
        app_ID = request.form['app_ID']
        app_name = request.form['app_name']
        description = request.form['description']

        try:
            cursor.execute('insert into Apps values(\'%s\',\'%s\',\'%s\')' % (app_ID, app_name, description))
            db.commit()
        except Exception as e:
            db.rollback()
            app.logger.info('ERROR! CATCHED!')
            response = make_response()
            response.status = 500
            response.data = "insertion into MySQL failed."
            return response

    cursor.close()
    db.close()

    return "POST called at /new"


@app.route('/update', methods = ['POST'])
def update_app():
    #connect SQL
    db = pymysql.connect(host="localhost", user="root", password="", database="flask")
    cursor = db.cursor(pymysql.cursors.DictCursor)
    if request.method == 'POST':
        app_ID = request.form['app_ID']
        app_name = request.form['app_name']
        description = request.form['description']

        try:
            cursor.execute('update Apps set app_name = \'%s\', description = \'%s\' where app_ID = \'%s\'' % (app_name, description, app_ID))
            db.commit()
        except Exception as e:
            db.rollback()

    cursor.close()
    db.close()

    return "POST called at /update"


@app.route('/delete', methods = ['POST'])
def delete_app():
    #connect SQL
    db = pymysql.connect(host="localhost", user="root", password="", database="flask")
    cursor = db.cursor(pymysql.cursors.DictCursor)
    if request.method == 'POST':
        app_ID = request.form['app_ID']
        cursor.execute('delete from Apps where app_ID = \'%s\'' % (app_ID))
        db.commit()

    cursor.close()
    db.close()

    return "POST called at /delete"


@app.route('/<name>')
def hello_name(name):
    return f"<p>Hello, {escape(name)}</p>"

