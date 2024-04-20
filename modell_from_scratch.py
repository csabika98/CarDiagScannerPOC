from inference_sdk import InferenceHTTPClient
from PIL import Image, ImageDraw, ImageFont

# Load the original image
original_image = Image.open("original.jpg")

# Create a drawing object
draw = ImageDraw.Draw(original_image)

CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="//API_KEY//"
)

result = CLIENT.infer("original.jpg", model_id="car-damage-detection-final/2")

# Get the predictions from the result
predictions = result["predictions"]

font = ImageFont.truetype("arial.ttf", 16)

# Loop through each prediction and draw a rectangle around the damaged area
for prediction in predictions:
    x, y, width, height = prediction["x"], prediction["y"], prediction["width"], prediction["height"]
    class_name = prediction["class"]
    draw.rectangle([x, y, x + width, y + height], outline="red", width=3)
    draw.text((x, y), class_name, fill="white", font=font)

# Show the image
original_image.show()
