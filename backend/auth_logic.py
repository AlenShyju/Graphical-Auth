# Example: backend/auth_logic.py
from sklearn.svm import OneClassSVM

def train_behavior_model(user_data):
    # Train on user's historical pressure/speed data
    model = OneClassSVM(nu=0.1)
    model.fit(user_data)
    return model

def check_anomaly(model, new_data):
    return model.predict(new_data) == -1  # -1 = anomaly

