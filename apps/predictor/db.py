import os
from pymongo import MongoClient
import requests
from copy import copy

# setup database connection
db_uri = os.environ.get('USERS_DB_URI')
db_name = os.environ.get('USERS_DB_NAME')
client = MongoClient(db_uri)
db = client[db_name]
collection = db['users']

def fetch_media(media_id):
    return fetch_movie(media_id)

def fetch_users(phone_numbers):
    query = {"phoneNumber": {"$in": phone_numbers}}
    result = list(collection.find(query))
    return result

def fetch_movie(movie_id):
    url = f"http://recommendation-service:3001/movie/{movie_id}?tags=true"
    try:
        response = requests.get(url)
        response.raise_for_status() 
        movie = response.json()
        print(movie)
        return movie
    except requests.exceptions.RequestException as e:
        print(f"Error fetching movie data: {e}")
    return None

def fetch_song_vector(song_id):
    url = f"http://recommendation-service:3001/songAudioFeatures/{song_id}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        song = response.json()
        song = list(song.values())
        print(song)
        return song
    except requests.exceptions.RequestException as e:
        print(f"Error fetching movie data: {e}")
    return None

def update_user_vector(user, media_type, new_vector):

    updated_user = copy(user)
    profile = media_type + 'Profile'
    updated_user[profile] = new_vector.flatten()

    query = {'phoneNumber': updated_user['phoneNumber']}
    collection.replace_one(query, updated_user)