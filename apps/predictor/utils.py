from numpy import dot
from numpy.linalg import norm 

def state_to_num(state):
    if state == 'dislike':
        return 0
    elif state == 'neutral':
        return 1
    else:
        return 2
    
def user_likes_media(user_vector, media_vector):
    return cosine_similarity(user_vector, media_vector) > 0

def cosine_similarity(a, b):
    similarity = dot(a, b) / (norm(a) * norm(b))
    return float(similarity)