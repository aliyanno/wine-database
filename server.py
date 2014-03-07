from flask import Flask, jsonify, request

app = Flask('wine-db-backend')

app.jinja_options.update(dict(
    block_start_string='<%',
    block_end_string='%>',
    variable_start_string='<<',
    variable_end_string='>>',
    comment_start_string='<#',
    comment_end_string='#>',
))

import database


@app.route('/')
def index():
    docs = {
        'title': 'wine-db',
        'description': 'This is a simple REST server for a wine database app.',
        'endpoints': [{
            'name': 'Lookup a wine',
            'method': 'GET',
            'url': '/api/wine/<int:id>',
            'description': 'Look up a wine',
            'returns': 'An indvidual wine with the given ID as a JSON-encoded string',
        }, {
            'name': 'Update a wine',
            'method': 'POST',
            'url': '/api/wine/<int:id>',
            'description': 'Updates a wine. Attach POST data as JSON, and set content-type as application/json.',
            'returns': 'ID of the wine as a JSON string like {"id": <id>}'
        }, {
            'name': 'Insert a wine',
            'method': 'PUT',
            'url': '/api/wine',
            'description': 'Inserts a wine. Attach data as JSON, and set content-type as application/json.',
            'returns': 'ID of the inserted wine as a JSON string like {"id": <id>}'
        }, {
            'name': 'Fetch the full list of wines',
            'method': 'GET',
            'url': '/api/wine/list',
            'description': 'List all wines',
            'returns': 'A JSON-encoded list of wine objects'
        }]
    }

    return jsonify(**docs)

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
