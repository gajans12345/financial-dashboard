from flask import Flask # imports

app = Flask(__name__) # instance of flask class

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
