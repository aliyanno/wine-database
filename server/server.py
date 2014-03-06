from flask import Flask, jsonify, request

app = Flask('wine-db-backend')

import database


@app.route('/api/wine/<int:id>', methods=['GET'])
def get_wine(id):
    wine = database.get_wine(id)
    return jsonify(**wine)

@app.route('/api/wine/<int:id>', methods=['POST'])
def update_wine(id):
    wine = request.get_json()
    wine_id = database.update_wine(id, wine)
    return jsonify(id=wine_id)

@app.route('/api/wine', methods=['PUT'])
def add_wine():
    wine = request.get_json()
    wine_id = database.insert_wine(wine)
    return jsonify(id=wine_id)

@app.route('/api/wine/list', methods=['GET'])
def list_wines():
    wine_list = database.list_wines()
    return jsonify(wines=wine_list)



if __name__ == '__main__':
    app.run(debug=True)
