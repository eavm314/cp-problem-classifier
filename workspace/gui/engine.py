import numpy as np
import tensorflow as tf
from tensorflow import keras
from gensim.models import Word2Vec
import re

import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('punkt_tab')

model_path = '../models/super_best_model_128_sg.keras'
word2vec_path = '../models/sg_128.model'


def clean_text(text):
    text=text.replace('+',' plus ')
    text=text.replace('-',' minus ')
    text=text.replace('*',' times ')
    text=text.replace('^',' power ')
    text=text.replace('/',' divide ')
    text=text.replace('<',' le ')
    text=text.replace('>',' ge ')
    text=text.replace('≤',' leq ')
    text=text.replace('<=',' leq ')
    text=text.replace('≥',' geq ')
    text=text.replace('>=',' geq ')
    text=text.replace('=',' equal ')
    text=text.replace('#',' numerical ')
    
    text = re.sub(r'[_\'\"]', '', text)

    text = re.sub(r'\W', ' ', text)
    return text

def transform(input_text):
    # Transform the plain text into a format that the model can understand
    stop_words = set(stopwords.words('english'))
    tokens = [word.lower() for word in word_tokenize(input_text) if word not in stop_words]
    input_size = 500
    tokens = tokens[:input_size]
    for _ in range(input_size-len(tokens)):
        tokens.append('')
    return tokens

def predict(input_text):
    clean = clean_text(input_text)
    tokens = transform(clean)

    word2vec = Word2Vec.load(word2vec_path)
    model = keras.models.load_model(model_path)
    
    emb_size = word2vec.vector_size

    input_data = np.array(list(map(lambda word: word2vec.wv[word] if word in word2vec.wv else np.zeros(emb_size), tokens)))
    
    prediction = model.predict(np.array([input_data]))
    return prediction