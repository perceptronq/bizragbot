from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/", methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        text = request.data.decode("utf-8")
        return jsonify({'text': text})
    elif request.method == 'GET':
        return jsonify({'text': ''})
    
if __name__ == '__main__':
    app.run(port=8080,debug=True)