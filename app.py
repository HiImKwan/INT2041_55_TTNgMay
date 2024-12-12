import json
from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# File to store user data
USERS_FILE = 'users.json'

def load_users():
    try:
        with open(USERS_FILE, 'r') as f:
            users = json.load(f)
    except FileNotFoundError:
        users = []
    return users

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=4)

def get_user_by_email(email):
    users = load_users()
    for user in users:
        if user['email'] == email:
            return user
    return None

def get_user_by_id(user_id):
    users = load_users()
    for user in users:
        if user['id'] == user_id:
            return user
    return None
    
def get_next_user_id():
    users = load_users()
    if not users:
        return 1
    return max(user['id'] for user in users) + 1

# Sign Up Route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # Check if user already exists
    if get_user_by_email(email):
        return jsonify({"message": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Create a new user
    users = load_users()
    new_user = {
        "id": get_next_user_id(),
        "name": name,
        "email": email,
        "password": hashed_password,
        "font_size": 18,
        "dark_mode": False,
        "reading_speed": 1.0
    }
    
    users.append(new_user)
    save_users(users)

    return jsonify({"message": "User created successfully"}), 201

# Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = get_user_by_email(email)
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({"message": "Invalid credentials"}), 401

    # Create JWT token
    access_token = create_access_token(identity={'id': user['id'], 'email': user['email'], 'name': user['name'],})
    return jsonify({"access_token": access_token})

# Get User Settings Route
@app.route('/settings', methods=['GET'])
@jwt_required()
def get_settings():
    current_user_info = get_jwt_identity()
    user = get_user_by_id(current_user_info['id'])

    return jsonify({
        "font_size": user['font_size'],
        "dark_mode": user['dark_mode'],
        "reading_speed": user['reading_speed']
    })

# Save User Settings Route
@app.route('/settings', methods=['POST'])
@jwt_required()
def save_settings():
    current_user_info = get_jwt_identity()
    user_id = current_user_info['id']

    users = load_users()
    user_index = -1
    for i, u in enumerate(users):
        if u['id'] == user_id:
            user_index = i
            break
    
    if user_index == -1:
        return jsonify({"message": "User not found"}), 404
        

    data = request.get_json()
    users[user_index]['font_size'] = data.get('font_size', users[user_index]['font_size'])
    users[user_index]['dark_mode'] = data.get('dark_mode', users[user_index]['dark_mode'])
    users[user_index]['reading_speed'] = data.get('reading_speed', users[user_index]['reading_speed'])

    save_users(users)

    return jsonify({"message": "Settings updated successfully"})

if __name__ == '__main__':
    app.run(debug=True, port=8080)