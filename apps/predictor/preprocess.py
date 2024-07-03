import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import re

def remove_punctuation(text):
    return re.sub(r'[^a-zA-Z\s]', '', text)

def remove_stopwords(text):
    stop_words = set(stopwords.words('english'))
    words = nltk.word_tokenize(text)
    filtered_words = [word for word in words if word.lower() not in stop_words]
    return ' '.join(filtered_words)

def lemmatize(text):
    lemmatizer = WordNetLemmatizer()
    words = nltk.word_tokenize(text)
    lemmatized_words = [lemmatizer.lemmatize(word) for word in words]
    return ' '.join(lemmatized_words)

def preprocess(text):
    text = remove_punctuation(text)
    text = text.lower()
    text = remove_stopwords(text)
    text = lemmatize(text)
    return text