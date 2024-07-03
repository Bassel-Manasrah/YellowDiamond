from pymongo import MongoClient
import numpy as np
import joblib
from numpy import dot
from numpy.linalg import norm 

# setup database connection
# client = MongoClient('localhost', 27017)
# db = client.usersDB
# collection = db.users

# # fetch user
# phone_numbers = ['+972524814835']
# query = {"phoneNumber": {"$in": phone_numbers}}
# users = list(collection.find(query))
# user = users[0]

# movie_profile = user['movieProfile']

# print(a + a)

# movie_vectorizer = joblib.load('movie_vectorizer.pkl')
# v = movie_vectorizer.transform(["hi my name is"]).toarray()
# print(v)

a = np.array([1,2,3])
b = np.array([1,2,3])
print(a + 2 * a)