from flask import Flask, render_template, request, redirect, send_from_directory, url_for
from inference_sdk import InferenceHTTPClient
from PIL import Image, ImageDraw, ImageFont
import gunicorn
import os

app = Flask(__name__)

# Set up the InferenceHTTPClient
CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="zMmwbyFRSwxKlMTKIRGV"
)

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
        # Save the uploaded image
        filename = "uploaded_image.jpg"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Load the original image
        original_image = Image.open(file_path)
        draw = ImageDraw.Draw(original_image)

        # Perform inference on the uploaded image
        result = CLIENT.infer(file_path, model_id="car-damage-detection-final/2")
        predictions = result["predictions"]

        font = ImageFont.truetype("arial.ttf", 16)

        # Loop through each prediction and draw a rectangle around the damaged area
        for prediction in predictions:
            x, y, width, height = prediction["x"], prediction["y"], prediction["width"], prediction["height"]
            class_name = prediction["class"]
            draw.rectangle([x, y, x + width, y + height], outline="red", width=3)
            draw.text((x, y), class_name, fill="white", font=font)

        # Save the modified image
        modified_image_path = os.path.join(app.config['UPLOAD_FOLDER'], "modified_image.jpg")
        original_image.save(modified_image_path)

        return render_template('result.html', image_path=modified_image_path)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.config['UPLOAD_FOLDER'] = 'uploads'
    app.run(debug=True)
