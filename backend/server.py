import os
import pandas as pd
from nba_api.stats.static import players

from flask import Flask, request, jsonify, render_template
from flask_pymongo import pymongo
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__, template_folder='../frontend/templates', static_folder='../frontend/static')

# Initialize CORS with your Flask app
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:8001"}})

team = []
active_players_data = players.get_active_players()
active_players = [{"name": player['full_name']} for player in active_players_data if player['is_active']]

# Serve the index.html file
@app.route('/')
def index():
    return render_template('index.html')  # Serve the HTML file

# API route to add a player
@app.route('/add_player', methods=["POST"])
def add_player():
    player_name = request.json.get('name')
    print(team)
    if player_name:
        team.append({"name": player_name})
        return jsonify({"name": player_name}), 201
    return jsonify({"message": "Player name is required!"}), 400

# API route to delete a player
@app.route('/delete_player/<string:name>', methods=["DELETE"])
def delete_player(name):
    global team
    team = [entry for entry in team if entry['name'] != name]
    return jsonify({"message": f"Player {name} deleted"}), 200

# API route to get team
@app.route('/get_team', methods=["GET"])
def get_team():
    print(team)
    return jsonify(team), 200

# API route to get the list of all active players for search
@app.route('/get_active_players', methods=["GET"])
def get_active_players():
    return jsonify(active_players), 200

if __name__ == '__main__':
    app.run(debug=True)
