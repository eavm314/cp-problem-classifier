import numpy as np
import tensorflow as tf
from tensorflow import keras
from gensim.models import Word2Vec

import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('punkt_tab')

model_path = '../models/best_model.keras'
word2vec_path = '../models/cbow_model.model'

def transform(input_text):
    # Transform the plain text into a format that the model can understand
    stop_words = set(stopwords.words('english'))
    latex = ['rho', 'cot', 'kappa', 'mod', 'leftrightarrow', 'gg', 'ast', 'sqcap', 'star', 'rightharpoonup', 'angle', 'equiv', 'Sigma', 'cos', 'flat', 'Leftrightarrow', 'because', 'mu', 'zeta', 'Omega', 'chi', 'leftarrow', 'bigwedge', 'Uparrow', 'imath', 'inf', 'gamma', 'partial', 'triangleright', 'rightsquigarrow', 'exp', 'Xi', 'sinh', 'neq', 'sec', 'Theta', 'diamond', 'bigtriangleright', 'omega', 'cap', 'bot', 'bigcup', 'oslash', 'arg', 'biguplus', 'succ', 'argmax', 'eta', 'simeq', 'Box', 'circle', 'sup', 'odot', 'lozenge', 'geq', 'diamondsuit', 'Lambda', 'top', 'Re', 'coprod', 'sum', 'oint', 'min', 'Im', 'omicron', 'notin', 'otimes', 'hookrightarrow', 'natural', 'owns', 'dashv', 'prod', 'subset', 'Updownarrow', 'Rightarrowtail', 'alpha', 'Leftarrow', 'le', 'amalg', 'nparallel', 'clubsuit', 'longmapsto', 'spadesuit', 'land', 'delta', 'Delta', 'hookleftarrow', 'csc', 'nsubseteq', 'infty', 'vee', 'int', 'sim', 'circ', 'bullet', 'succeq', 'nexists', 'epsilon', 'longleftarrow', 'models', 'lambda', 'updownarrow', 'dagger', 'pi', 'asymp', 'phi', 'lim', 'triangleleft', 'leq', 'longrightarrow', 'neg', 'supset', 'leftharpoonup', 'bigcap', 'rightharpoondown', 'square', 'sphericalangle', 'Upsilon', 'Pi', 'downarrow', 'parallel', 'lor', 'dim', 'beth', 'times', 'gimel', 'jmath', 'oplus', 'bigtriangledown', 'Rightarrow', 'iota', 'tan', 'Longleftarrow', 'll', 'leftharpoondown', 'bigtriangleleft', 'wp', 'smallsetminus', 'prec', 'xi', 'longleftrightarrow', 'bigtriangleup', 'ge', 'approx', 'sharp', 'ell', 'argmin', 'triangle', 'uplus', 'dashrightarrow', 'log', 'max', 'psi', 'mp', 'cosh', 'tanh', 'cup', 'subseteq', 'daleth', 'theta', 'supsetneq', 'rightarrow', 'leadsto', 'setminus', 'leftrightsquigarrow', 'Longrightarrow', 'degree', 'deg', 'preceq', 'bigsqcup', 'perp', 'ddagger', 'ln', 'Psi', 'det', 'surd', 'Phi', 'in', 'forall', 'subsetneq', 'blacksquare', 'nsupseteq', 'ni', 'tau', 'upsilon', 'cdot', 'measuredangle', 'bigcirc', 'div', 'lnot', 'uparrow', 'sin', 'propto', 'therefore', 'triangleq', 'sigma', 'heartsuit', 'exists', 'supseteq', 'Gamma', 'backslash', 'wedge', 'lcm', 'aleph', 'ominus', 'hbar', 'Downarrow', 'nu', 'mapsto', 'gcd', 'Diamond', 'sqcup', 'beta', 'bigvee', 'cong', 'vdash', 'mid', 'Longleftrightarrow', 'nabla', 'pm']

    tokens = [word.lower() for word in word_tokenize(input_text) if word not in stop_words and word not in latex]
    input_size = 750
    tokens = tokens[:input_size]
    for i in range(input_size-len(tokens)):
        tokens.append('')
    return tokens

def predict(input_text):
    tokens = transform(input_text)

    word2vec = Word2Vec.load(word2vec_path)
    model = keras.models.load_model(model_path)
    
    emb_size = word2vec.vector_size

    input_data = np.array(list(map(lambda word: word2vec.wv[word] if word in word2vec.wv else np.zeros(emb_size), tokens)))
    # input_size = 750
    # if input_data.size < input_size:
    #     # If the array is smaller, fill the difference with the fill_value
    #     input_data = np.pad(input_data, (0, input_size - input_data.size), mode='constant', constant_values=np.zeros(emb_size))
    # else:
    #     # If the array is larger, slice it to the target size
    #     input_data = input_data[:input_size]

    
    prediction = model.predict(np.array([input_data]))
    return prediction