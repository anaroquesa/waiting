from flask import Flask, request, jsonify
import json

app = Flask(__name__)

# Lista para armazenar entradas (pode ser um arquivo ou banco de dados na produção)
entries = []

@app.route('/log-entry', methods=['POST'])
def log_entry():
    data = request.get_json()  # Recebe os dados enviados do frontend
    entries.append(data)  # Adiciona a entrada à lista
    return jsonify({'message': 'Entrada registrada com sucesso!'}), 201

@app.route('/entries', methods=['GET'])
def get_entries():
    return jsonify(entries)

if __name__ == '__main__':
    app.run(debug=True)
