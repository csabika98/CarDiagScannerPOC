from flask import Flask, render_template, request, redirect, url_for, send_file
from roboflow import Roboflow
import cv2
import os
import tempfile
import datetime
from google.cloud import storage
import numpy as np
import supervision as sv

app = Flask(__name__)

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'cred.json'
storage_client = storage.Client()
rf = Roboflow(api_key="apikey")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)
    if file:
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file_path = temp_file.name
            file.save(temp_file_path)
        bucket = storage_client.get_bucket('carscanneralpha.appspot.com')
        blob = bucket.blob(file.filename)
        with open(temp_file_path, 'rb') as f:
            blob.upload_from_file(f)
        expiration_time = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        signed_url = blob.generate_signed_url(expiration=expiration_time, method='GET')

        project = rf.workspace().project("car-damage-rlogo")
        model = project.version(1).model
        result = model.predict(temp_file_path, confidence=40).json()

        detections = sv.Detections.from_inference(result)
        print("Detections:", detections)  #
        original_image = cv2.imread(temp_file_path)
        annotated_image = annotate_image(original_image, detections)

        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_modified_file:
            temp_modified_file_path = temp_modified_file.name
            cv2.imwrite(temp_modified_file_path, annotated_image)
        modified_blob = bucket.blob('modified_' + file.filename)
        with open(temp_modified_file_path, 'rb') as f:
            modified_blob.upload_from_file(f)
        modified_signed_url = modified_blob.generate_signed_url(expiration=expiration_time, method='GET')

        make = request.form.get('make')
        model = request.form.get('model')
        year = request.form.get('year')

        damages = []
        for i in range(len(detections.confidence)):
            confidence = detections.confidence[i]
            label = detections.data['class_name'][i]  # Access class names using the data attribute
            confidence_percent = round(confidence * 100, 2)

            damages.append({
                'part': label,
                'percentage_of_damage': f"{confidence_percent}%",
                'recommendation': 'Replace' if confidence > 0.5 else 'Repair'  # Using 0.5 as threshold
            })

        os.unlink(temp_file_path)
        os.unlink(temp_modified_file_path)

        return render_template('result.html', 
                               original_image_url=signed_url, 
                               modified_image_url=modified_signed_url,
                               make=make, 
                               model=model, 
                               year=year,
                               damages=damages)

def annotate_image(original_image, detections):
    bounding_box_annotator = sv.BoundingBoxAnnotator()

    for detection in detections:
        try:
            bbox, _, confidence, _, _, info = detection  # Unpacking the tuple
            label = info['class_name'] if 'class_name' in info else 'Unknown'
            confidence_percent = int(confidence * 100)  # Convert to percentage

            # Smaller font size and thinner text
            font_scale = 0.6
            thickness = 1

            # Calculate text width & height to create a background rectangle
            text = f"{label} ({confidence_percent}%)"
            (text_width, text_height), _ = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, font_scale, thickness)

            # Set up the text background rectangle coordinates
            rect_start = (int(bbox[0]), int(bbox[1] - text_height - 4))
            rect_end = (int(bbox[0] + text_width + 2), int(bbox[1]))

            # Draw the rectangle in white with black border
            #cv2.rectangle(original_image, rect_start, rect_end, (255,255,255), -1)
            #cv2.rectangle(original_image, rect_start, rect_end, (0,0,0), 1)  # black border around the text background

            # Write text in black for contrast
            #cv2.putText(original_image, text, (int(bbox[0] + 1), int(bbox[1] - 2)), cv2.FONT_HERSHEY_SIMPLEX, font_scale, (0,0,0), thickness)

            # Draw bounding box in green (adjust color and thickness if necessary)
            cv2.rectangle(original_image, (int(bbox[0]), int(bbox[1])), (int(bbox[2]), int(bbox[3])), (0,255,0), 2)
        except Exception as e:
            print("An unexpected error occurred while annotating image:", str(e))

    return original_image


@app.route('/get_original_image')
def get_original_image():
    original_image_url = request.args.get('original_image_url')
    return send_file(original_image_url, as_attachment=True)

@app.route('/get_modified_image')
def get_modified_image():
    modified_image_url = request.args.get('modified_image_url')
    return send_file(modified_image_url, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)


