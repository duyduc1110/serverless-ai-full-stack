from flask import Flask, jsonify, make_response, request
import sklearn

app = Flask(__name__)


@app.route("/", )
def hello_from_root():
    return jsonify(message='Hello from root! Duc')


@app.route("/hello")
def hello():
    return jsonify(message='Hello from path!')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    print(data)
    return jsonify(data)


@app.errorhandler(404)
def resource_not_found(e):
    return make_response(jsonify(error='Not found!'), 404)

