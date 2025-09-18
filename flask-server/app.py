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
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM Keyy WHERE company = %s', ('Microsoft',))
    data = cur.fetchone()
    cur.close()
    conn.close()
    
    if data:
        return jsonify({
            'currentprice': data[0],
            'dividendrate': data[1],
            'bidaskspread': data[2],
            'fiftytwoweekhigh': data[3],
            'fiftytwoweeklow': data[4],
            'marketcap': data[5],
            'roe': data[6],
            'pegratio': data[7]
        })
    return jsonify({})

@app.route('/key/<company>', methods=['GET'])
def key_by_company(company):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute('SELECT * FROM Keyy WHERE company = %s', (company,))
        data = cur.fetchone()
    finally:
        cur.close()
        conn.close()

    if data:
        return jsonify({
            'currentprice': data[0],
            'dividendrate': data[1],
            'bidaskspread': data[2],
            'fiftytwoweekhigh': data[3],
            'fiftytwoweeklow': data[4],
            'marketcap': data[5],
            'roe': data[6],
            'pegratio': data[7]
        })
    return jsonify({}), 404

@app.route('/Curr',methods=['GET'])
def curr():
    return 'Index Page'

@app.route('/NonCurr',methods=['GET'])
def noncurr():
    return 'Index Page'

@app.route('/Flow',methods=['GET'])
def flow():
    return 'Index Page'

@app.route('/prices/<company>', methods=['GET'])
def prices_by_company(company):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute('SELECT Year, Price FROM Pricees WHERE Company = %s ORDER BY Year', (company,))
        rows = cur.fetchall()
    finally:
        cur.close()
        conn.close()

    series = [{ 'year': r[0], 'price': float(r[1]) } for r in rows]
    return jsonify(series)

@app.route('/BlackRock',methods=['GET'])
def blackrock():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM Keyy WHERE company = %s', ('BlackRock',))
    data = cur.fetchone()
    cur.close()
    conn.close()
    
    if data:
        return jsonify({
            'currentprice': data[0],
            'dividendrate': data[1],
            'bidaskspread': data[2],
            'fiftytwoweekhigh': data[3],
            'fiftytwoweeklow': data[4],
            'marketcap': data[5],
            'roe': data[6],
            'pegratio': data[7]
        })
    return jsonify({})

@app.route('/Pepsico',methods=['GET'])
def pepsico():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM Keyy WHERE company = %s', ('Pepsico',))
    data = cur.fetchone()
    cur.close()
    conn.close()
    
    if data:
        return jsonify({
            'currentprice': data[0],
            'dividendrate': data[1],
            'bidaskspread': data[2],
            'fiftytwoweekhigh': data[3],
            'fiftytwoweeklow': data[4],
            'marketcap': data[5],
            'roe': data[6],
            'pegratio': data[7]
        })
    return jsonify({})

if __name__ == "__main__":
    app.run(debug=True)
