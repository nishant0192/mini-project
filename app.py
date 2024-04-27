from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.preprocessing import StandardScaler
import pickle

with open("Copy_of_ML_MP.pkl", 'rb') as file:
    loaded_model = pickle.load(file)

df = pd.read_csv("waterQuality.csv")
df.replace('#NUM!', pd.NA, inplace=True)
df = df.apply(pd.to_numeric, errors='ignore')

numeric_cols = ['aluminium', 'ammonia', 'arsenic', 'barium', 'cadmium', 'chloramine',
       'chromium', 'copper', 'flouride', 'bacteria', 'viruses', 'lead',
       'nitrates', 'nitrites', 'mercury', 'perchlorate', 'radium', 'selenium',
       'silver', 'uranium']

numeric_transformer = StandardScaler()

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    input_data = pd.DataFrame([data])

    input_data = input_data.apply(pd.to_numeric, errors='coerce')
    input_data = input_data.fillna(input_data.mean())
    input_data = input_data.astype(float)

    prediction = loaded_model.predict(input_data)
    return jsonify({'prediction': format(prediction)})

if __name__ == '__main__':
    app.run(debug=True)
