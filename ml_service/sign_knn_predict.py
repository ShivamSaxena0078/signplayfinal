import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import cv2
import mediapipe as mp
import numpy as np
import pickle
from collections import deque

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(max_num_hands=1)
mp_draw = mp.solutions.drawing_utils

# load model
with open("sign_knn_model.pkl", "rb") as f:
    knn = pickle.load(f)

print("👋 Model loaded successfully. Stabilized prediction mode.")
print("Press 'q' to exit.\n")

prediction_queue = deque(maxlen=5)
last_prediction = None

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = hands.process(rgb)

    if result.multi_hand_landmarks:
        for hand_landmarks in result.multi_hand_landmarks:
            mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            landmarks = []
            for lm in hand_landmarks.landmark:
                landmarks.extend([lm.x, lm.y, lm.z])

            # normalize for prediction
            base_x, base_y, base_z = landmarks[0], landmarks[1], landmarks[2]
            norm_landmarks = []
            for i in range(0, len(landmarks), 3):
                norm_landmarks.append(landmarks[i] - base_x)
                norm_landmarks.append(landmarks[i+1] - base_y)
                norm_landmarks.append(landmarks[i+2] - base_z)

            pred = knn.predict([norm_landmarks])[0]
            prediction_queue.append(pred)

            if len(prediction_queue) == prediction_queue.maxlen:
                smoothed_pred = max(set(prediction_queue), key=prediction_queue.count)
                last_prediction = smoothed_pred
            else:
                smoothed_pred = pred

            cv2.putText(frame, f"Prediction: {smoothed_pred}", (10, 60),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 255), 3)

    else:
        if last_prediction is not None:
            cv2.putText(frame, f"Prediction: {last_prediction}", (10, 60),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 0), 3)

    cv2.imshow("Sign Prediction (Stabilized)", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
