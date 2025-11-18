import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import mediapipe as mp
import numpy as np
import pickle
import base64
from io import BytesIO
from PIL import Image

app = Flask(__name__)
CORS(app)

# load KNN model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "sign_knn_model.pkl")
with open(MODEL_PATH, "rb") as f:
    knn = pickle.load(f)

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(max_num_hands=1)
mp_draw = mp.solutions.drawing_utils

def decode_base64_image(data_url: str):
    """data:image/jpeg;base64,... → np.ndarray (BGR)"""
    if "," in data_url:
        data_url = data_url.split(",")[1]
    img_bytes = base64.b64decode(data_url)
    pil_img = Image.open(BytesIO(img_bytes)).convert("RGB")
    img = np.array(pil_img)
    # RGB → BGR for OpenCV
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    return img

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        image_data = data.get("image")

        if not image_data:
            return jsonify({"error": "No image provided"}), 400

        frame = decode_base64_image(image_data)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = hands.process(rgb)

        if not result.multi_hand_landmarks:
            return jsonify({"error": "no_hand_detected"}), 200

        hand_landmarks = result.multi_hand_landmarks[0]

        # build landmark vector
        landmarks = []
        for lm in hand_landmarks.landmark:
            landmarks.extend([lm.x, lm.y, lm.z])

        # normalize relative to wrist (same as in training)
        base_x, base_y, base_z = landmarks[0], landmarks[1], landmarks[2]
        norm_landmarks = []
        for i in range(0, len(landmarks), 3):
            norm_landmarks.append(landmarks[i] - base_x)
            norm_landmarks.append(landmarks[i+1] - base_y)
            norm_landmarks.append(landmarks[i+2] - base_z)

        features = np.array(norm_landmarks).reshape(1, -1)

        pred = knn.predict(features)[0]

        return jsonify({
            "prediction": int(pred)
        })

    except Exception as e:
        print("Prediction error:", e)
        return jsonify({"error": "prediction_failed", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)