from flask import Flask, render_template, request, redirect, url_for, send_file, session, jsonify
from flask_cors import CORS
from roboflow import Roboflow
import cv2
import os
import numpy as np
import supervision as sv
import pandas as pd
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import supervision as sv

app = Flask(__name__)
CORS(app)  # This allows cross-origin requests

UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

secret_key = os.urandom(24)
app.config['SECRET_KEY'] = secret_key
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cars.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

load_dotenv()  

roboflow_key = os.getenv('ROBOFLOW_API_KEY')

rf = Roboflow(api_key=roboflow_key)

@app.after_request
def add_no_cache_headers(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

class Car(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    make = db.Column(db.String(80), nullable=False)
    model = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return f'<Car {self.make} {self.model}>'

with app.app_context():
    db.create_all()

""" @app.route('/')
def index():
    cars = Car.query.all()
    return render_template('index.html', cars=cars) """



@app.route('/cardiag/backend/api/cars', methods=['GET'])
def get_cars():
    cars = Car.query.all()
    car_list = [{'id': car.id, 'make': car.make, 'model': car.model} for car in cars]
    return jsonify(car_list), 200


@app.route('/cardiag/backend')
def index():
    get_cars()
    return redirect('http://localhost:80', code=302)

@app.route('/cardiag/backend/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return {"error": "No file part"}, 400

    file = request.files['file']
    if file.filename == '':
        return {"error": "No selected file"}, 400

    if file:
        temp_file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(temp_file_path)

        project_image = rf.workspace().project("car-damage-detection-ha5mm")
        image_model = project_image.version(1).model
        
        image_result = image_model.predict(temp_file_path, confidence=40).json()
        image_detections = sv.Detections.from_inference(image_result)
        print("Image Detections:", image_detections)

        original_image = cv2.imread(temp_file_path)
        mask_annotator = sv.MaskAnnotator()
        image_annotated_image = mask_annotator.annotate(scene=original_image, detections=image_detections)

        temp_modified_file_path = os.path.join(PROCESSED_FOLDER, 'modified_' + file.filename)
        cv2.imwrite(temp_modified_file_path, image_annotated_image)

        project_label = rf.workspace().project("automobile-damage-detection")
        label_model = project_label.version(3).model

        label_result = label_model.predict(temp_file_path, confidence=40).json()
        label_detections = sv.Detections.from_inference(label_result)
        print("Label Detections:", label_detections)

        damages = []
        for i in range(len(label_detections.confidence)):
            label = label_detections.data['class_name'][i]
            damages.append({'part': label})

        original_image_url = url_for('get_local_image', filename=file.filename)
        modified_image_url = url_for('get_local_image', filename='modified_' + file.filename)

        return {
            "original_image_url": original_image_url,
            "modified_image_url": modified_image_url,
            "damages": damages
        }, 200


@app.route('/cardiag/backend/get_image/<filename>')
def get_local_image(filename):
  
    if 'modified_' in filename:
        return send_file(os.path.join(PROCESSED_FOLDER, filename))
    else:
        return send_file(os.path.join(UPLOAD_FOLDER, filename))


label_annotator = sv.LabelAnnotator()
mask_annotator = sv.MaskAnnotator()


def annotate_image(original_image, detections):
    for i in range(len(detections.xyxy)):
        try:
            bbox = detections.xyxy[i]  # [x_min, y_min, x_max, y_max]
            label = detections.data['class_name'][i]
            confidence = detections.confidence[i]

            x_min, y_min, x_max, y_max = map(int, bbox)
            box_width = x_max - x_min
            box_height = y_max - y_min

            x_min = max(x_min - int(box_width * 0.05), 0)  
            y_min = max(y_min - int(box_height * 0.8), 0)  
            x_max = min(x_max + int(box_width * 0.05), original_image.shape[1])  
            y_max = min(y_max + int(box_height * 0.8), original_image.shape[0])

            overlay = original_image.copy()
            alpha = 0.4 
            
            cv2.rectangle(overlay, (x_min, y_min), (x_max, y_max), (255, 255, 0), -1) 
            cv2.addWeighted(overlay, alpha, original_image, 1 - alpha, 0, original_image)

            cv2.rectangle(original_image, (x_min, y_min), (x_max, y_max), (0, 255, 0), 3) 
            
            #label_text = f"{label}: {int(confidence * 100)}%"
            #cv2.putText(original_image, label_text, (x_min, y_min - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 2)  # Black text

        except Exception as e:
            print(f"An error occurred while annotating the image: {e}")

    return original_image

def simulate_mask(original_image, detections):
    mask = np.zeros(original_image.shape[:2], dtype=np.uint8)  

    for i in range(len(detections.xyxy)):
        try:
            bbox = detections.xyxy[i]
            x_min, y_min, x_max, y_max = map(int, bbox)
            
            polygon = np.array([
                [x_min + 10, y_min - 80],
                [x_max - 10, y_min - 80],
                [x_max + 50, y_max + 100],
                [x_min - 50, y_max + 100]
            ], dtype=np.int32)

            cv2.fillPoly(mask, [polygon], 255) 

        except Exception as e:
            print(f"An error occurred while simulating the mask: {e}")

    return mask

def annotate_image_with_custom_polygon(original_image, detections):
    for i in range(len(detections.xyxy)):
        try:
            bbox = detections.xyxy[i]  # [x_min, y_min, x_max, y_max]
            label = detections.data['class_name'][i]
            confidence = detections.confidence[i]

            x_min, y_min, x_max, y_max = map(int, bbox)
            polygon = np.array([
                [x_min + 20, y_min],  
                [x_max - 20, y_min], 
                [x_max, y_max],       
                [x_min, y_max]        
            ], dtype=np.int32)

            overlay = original_image.copy()
            alpha = 0.4  

            cv2.fillPoly(overlay, [polygon], (255, 255, 0))  
            cv2.addWeighted(overlay, alpha, original_image, 1 - alpha, 0, original_image)

            cv2.polylines(original_image, [polygon], isClosed=True, color=(0, 255, 0), thickness=3)  

            label_text = f"{label}: {int(confidence * 100)}%"
            cv2.putText(original_image, label_text, (x_min, y_min - 10), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 2) 

        except Exception as e:
            print(f"An error occurred while annotating the image: {e}")

    return original_image

def annotate_image_with_trapezoid_polygon(original_image, detections):
    for i in range(len(detections.xyxy)):
        try:
            bbox = detections.xyxy[i]  
            label = detections.data['class_name'][i]
            confidence = detections.confidence[i]

            x_min, y_min, x_max, y_max = map(int, bbox)
            
            y_min_extended = y_min - 170  

            y_max_extended = y_max + 30  

            polygon = np.array([
                [x_min + 10, y_min_extended], 
                [x_max - 10, y_min_extended],  
                [x_max + 50, y_max_extended], 
                [x_min - 50, y_max_extended]   
            ], dtype=np.int32)

            overlay = original_image.copy()
            alpha = 0.3  

            cv2.fillPoly(overlay, [polygon], (102, 255, 178)) 
            cv2.addWeighted(overlay, alpha, original_image, 1 - alpha, 0, original_image)

            cv2.polylines(original_image, [polygon], isClosed=True, color=(0, 150, 0), thickness=4) 

            # Optionally, add the label and confidence with better placement and readability
            #label_text = f"{label}: {int(confidence * 100)}%"
            #cv2.putText(original_image, label_text, (x_min + 10, y_min_extended - 10), 
            #            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 3, cv2.LINE_AA)  # Black text with slight offset

        except Exception as e:
            print(f"An error occurred while annotating the image: {e}")
        
    return original_image


@app.route('/cardiag/backend/upload_csv', methods=['GET', 'POST'])
def upload_csv():
    if request.method == 'POST':
        if 'csvfile' not in request.files:
            return {"error": "No file uploaded"}, 400

        csv_file = request.files.get('csvfile')
        if csv_file:
            df = pd.read_csv(csv_file)
            db.session.query(Car).delete()

            for index, row in df.iterrows():
                car = Car(make=row['MAKE'], model=row['MODEL'])
                db.session.add(car)
            db.session.commit()

            return {"message": "CSV uploaded and database updated"}, 200
        else:
            return {"error": "No file uploaded"}, 400
    return render_template('upload_csv.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)