import joblib
from preprocess import preprocess
import numpy as np

# load movie vectorizer
movie_vectorizer = joblib.load('movie_vectorizer.pkl')

def vectorize_media(media):
    if(media.type == 'movie'):
        return vectorize_movie(media)
    else:
        return vectorize_song(media)

def vectorize_movie(movie):
    movie['genres'] = ' '.join(movie['genres'])
    movie['tags'] = ' '.join(movie['tags'])
    movie['dump'] = movie['genres'] + ' ' + movie['tags'] + ' ' + movie['overview']
    movie['dump'] = preprocess(movie['dump'])
    return movie_vectorizer.transform([movie['dump']]).toarray()

def vectorize_song(song):
    pass

def vectorize_user(user, media_type):
    if(media_type == 'movie'):
        return np.array(user['movieProfile'])
    else:
        return np.array(user['songProfile'])