from flask import Flask, render_template, request, redirect, url_for, send_file, session
from roboflow import Roboflow
import cv2
from flask import Flask, render_template, request, redirect, url_for, send_file, session
from roboflow import Roboflow
import cv2
import os
import numpy as np
import supervision as sv
import pandas as pd
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

app = Flask(__name__)

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

class Car(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    make = db.Column(db.String(80), nullable=False)
    model = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return f'<Car {self.make} {self.model}>'

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    cars = Car.query.all()
    return render_template('index.html', cars=cars)
    cars = Car.query.all()
    return render_template('index.html', cars=cars)

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)
    if file:
       
        temp_file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(temp_file_path)

        
        project = rf.workspace().project("car-damage-rlogo")
        model = project.version(1).model
        result = model.predict(temp_file_path, confidence=40).json()

        detections = sv.Detections.from_inference(result)
        print("Detections:", detections)

        original_image = cv2.imread(temp_file_path)
        annotated_image = annotate_image(original_image, detections)

        # Save the processed image locally
        temp_modified_file_path = os.path.join(PROCESSED_FOLDER, 'modified_' + file.filename)
        cv2.imwrite(temp_modified_file_path, annotated_image)

        make = request.form.get('make')
        model = request.form.get('model')
        year = request.form.get('year')

        damages = []
        for i in range(len(detections.confidence)):
            label = detections.data['class_name'][i]  

            damages.append({
                'part': label
            })

        # Provide local URLs to access the images
        original_image_url = url_for('get_local_image', filename=file.filename)
        modified_image_url = url_for('get_local_image', filename='modified_' + file.filename)

        return render_template('result.html', 
                               original_image_url=original_image_url, 
                               modified_image_url=modified_image_url,
                               make=make, 
                               model=model, 
                               year=year,
                               damages=damages)

@app.route('/get_image/<filename>')
def get_local_image(filename):
  
    if 'modified_' in filename:
        return send_file(os.path.join(PROCESSED_FOLDER, filename))
    else:
        return send_file(os.path.join(UPLOAD_FOLDER, filename))

def annotate_image(original_image, detections):
    bounding_box_annotator = sv.BoundingBoxAnnotator()

    for detection in detections:
        try:
            bbox, _, confidence, _, _, info = detection  # Unpacking the tuple
            label = info['class_name'] if 'class_name' in info else 'Unknown'
            confidence_percent = int(confidence * 100)  # Convert to percentage

            # Draw bounding box in green (adjust color and thickness if necessary)
            cv2.rectangle(original_image, (int(bbox[0]), int(bbox[1])), (int(bbox[2]), int(bbox[3])), (0,255,0), 2)
        except Exception as e:
            print("An unexpected error occurred while annotating image:", str(e))

    return original_image

@app.route('/upload_csv', methods=['GET', 'POST'])
def upload_csv():
    if request.method == 'POST':
        csv_file = request.files.get('csvfile')
        if csv_file:
         
            df = pd.read_csv(csv_file)
         
            db.session.query(Car).delete()
          
            for index, row in df.iterrows():
                car = Car(make=row['MAKE'], model=row['MODEL'])
                db.session.add(car)
            db.session.commit()
            return redirect(url_for('index'))
        else:
            return "No file uploaded", 400
    return render_template('upload_csv.html')

if __name__ == '__main__':
    app.run(debug=True)




