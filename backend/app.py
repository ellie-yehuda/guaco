from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/grocery-data/csv', methods=['GET'])
def get_grocery_csv():
    csv_path = os.path.join(os.path.dirname(__file__), 'data', 'GroceryDataset', 'GroceryDataset4Guaco.csv')
    return send_file(csv_path, mimetype='text/csv')

if __name__ == '__main__':
    app.run(debug=True, port=8000) 