
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='static')
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    selected_images = db.Column(db.String(200))
    sequence = db.Column(db.String(50))
    pressure_threshold = db.Column(db.Float)
    gesture_speed = db.Column(db.Float)

@app.route('/')
def home():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    user = User(
        username=data['username'],
        selected_images=",".join(data['selected_images']),
        sequence=data['sequence'],
        pressure_threshold=data['pressure'],
        gesture_speed=data['speed']
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"status": "success"})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    
    if not user:
        return jsonify({"status": "fail", "reason": "user_not_found"})
    
    # Image validation
    if set(data['selected_images']) != set(user.selected_images.split(',')):
        return jsonify({"status": "fail", "reason": "image_mismatch"})
    
    # Sequence validation
    if data['sequence'] != user.sequence:
        return jsonify({"status": "fail", "reason": "sequence_mismatch"})
    
    # Behavioral check
    pressure_diff = abs(data['pressure'] - user.pressure_threshold)
    speed_diff = abs(data['speed'] - user.gesture_speed)
    if pressure_diff > 0.2 or speed_diff > 0.3:
        return jsonify({"status": "fail", "reason": "behavior_mismatch"})
    
    return jsonify({"status": "success"})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
