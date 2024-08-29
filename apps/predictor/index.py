from flask import Flask, request, jsonify
from db import fetch_media, fetch_users, update_user_vector, fetch_song_vector
from utils import state_to_num, user_likes_media
from vectorize import vectorize_media, vectorize_user, vectorize_movie, fetch_media_vector
from db import collection

app = Flask(__name__)

# @app.route("/")
# def fetchMediaVector():
#     media_id = "2qxmye6gAegTMjLKEBoR3d"
#     media_type = "song"
#     # media_id = "550"
#     # media_type = "movie"
#     media_vector = fetch_media_vector(media_id, media_type);
#     return media_vector

@app.route("/songVector/<string:song_id>")
def getSongVector(song_id: str):
    song = fetch_song_vector(song_id)
    return jsonify(song)

@app.route("/movieVector/<int:movie_id>")
def getMovieVector(movie_id):
    movie = fetch_media(movie_id)
    movie_vector = vectorize_movie(movie)
    movie_vector_list = movie_vector.flatten().tolist()
    return jsonify(movie_vector=movie_vector_list)  


@app.route("/feedback", methods=['POST'])
def feedback():
    data = request.get_json()
    phone_number = data.get('phoneNumber')
    media_id = data.get('mediaId')
    media_type = data.get('mediaType')
    prev_state = data.get('previousState')
    new_state = data.get('newState')

    prev_state = state_to_num(prev_state)
    new_state = state_to_num(new_state)
    multiplier = new_state - prev_state

    media_vector = fetch_media_vector(media_id, media_type)

    user = fetch_users([phone_number])[0]

    user_vector = vectorize_user(user, media_type)

    # update user media profile
    new_vector = user_vector + (multiplier * media_vector)
    update_user_vector(user, media_type, new_vector)


@app.route("/predict", methods=['POST'])
def predict():
    data = request.get_json()
    phone_numbers = data.get('phoneNumbers')
    media_id = data.get('mediaId')
    media_type = data.get('mediaType')

    if not phone_numbers or not media_id or not media_type:
        return jsonify({'error': 'Invalid input'}), 400
    
    users = fetch_users(phone_numbers)
    media_vector = fetch_media_vector(media_id, media_type)

    # media_vector = vectorize_media(media)
    predictions = []
    for user in users:
        user_vector = vectorize_user(user, media_type)
        predictions.append({
            'phoneNumber': user['phoneNumber'],
            'prediction': user_likes_media(user_vector, media_vector)
        })
    return jsonify(predictions)


@app.route("/feedbackl", methods=['POST'])
def feedbackl():
    pass