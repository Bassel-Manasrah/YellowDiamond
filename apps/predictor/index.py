from flask import Flask, request, jsonify
from db import fetch_media, fetch_users, update_user_vector
from utils import state_to_num, user_likes_media
from vectorize import vectorize_media, vectorize_user, vectorize_movie
from db import collection

app = Flask(__name__)

@app.route("/")
def hi():
    pass
    # user = fetch_users(['+972524814835'])[0]
    # print(type(user))
    # return "done"
    
    # movie_id = 346698
    # movie = fetch_movie(movie_id)
    # vector = vectorize_movie(movie)
    # return jsonify(vector)

    # collection.insert_one({
    #     "phoneNumber": "+972524814835",
    #     "movieProfile": [0] * 26944,
    # })

    # collection.insert_one({
    #     "phoneNumber": "+972524814836",
    #     "movieProfile": [0] * 26944,
    # })

    # return "done"

@app.route("/movieVector/<int:movie_id>")
def getMovieVector(movie_id):
    movie = fetch_media(movie_id)
    movie_vector = vectorize_movie(movie)
    movie_vector_list = movie_vector.flatten().tolist()
    return jsonify(movie_vector=movie_vector_list)  


@app.route("/feedback", methods=['POST'])
def feedback():
    data = request.json
    phone_number = data.get('phoneNumber')
    media_id = data.get('mediaId')
    media_type = data.get('mediaType')
    prev_state = data.get('previousState')
    new_state = data.get('newState')

    prev_state = state_to_num(prev_state)
    new_state = state_to_num(new_state)
    multiplier = new_state - prev_state

    # fetch media and user objects
    media = fetch_media(media_id)
    user = fetch_users([phone_number])[0]

    # vectoize media and user objects
    media_vector = vectorize_media(media)
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
    media = fetch_media(media_id, media_type)

    media_vector = vectorize_media(media)
    predictions = []
    for user in users:
        user_vector = vectorize_user(user, media_type)
        predictions.append({
            'phoneNumber': user['phoneNumber'],
            'prediction': user_likes_media(user_vector, media_vector)
        })
    return jsonify(predictions)

