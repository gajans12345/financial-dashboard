from flask import Flask, jsonify, request # imports
from flask_cors import CORS # Allows access to frontend
import psycopg2


app = Flask(__name__) # instance of flask class

CORS(app) # Allow react on different port to access flask

# DB INFO
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "airflow"
DB_USER = "airflow"
DB_PASSWORD = "airflow"

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )




@app.route('/Prices',methods=['GET']) # Decorator, tells flask to run this function if root url is accessed
def prices():
    return "<p>Gajan, Worldd!</p>"

@app.route('/Stacked',methods=['GET'])
def stacked():
    return 'Index Page'

@app.route('/Ratio',methods=['GET'])
def ratio():
    return 'Index Page'

@app.route('/Key',methods=['GET'])
def key():
    return 'Index Page'

@app.route('/Curr',methods=['GET'])
def curr():
    return 'Index Page'

@app.route('/NonCurr',methods=['GET'])
def noncurr():
    return 'Index Page'

@app.route('/Flow',methods=['GET'])
def flow():
    return 'Index Page'

if __name__ == "__main__":
    app.run(debug=True)
