from flask import Flask, render_template, request, jsonify
import requests, os
import json
import base64
from PIL import Image
from io import BytesIO

# Define the API endpoint for Huggingface Diffusion model
API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1-base"
TOKEN = os.getenv('HUGGINGFACE_API')
headers = {"Authorization": f"Bearer {TOKEN}"}

# Create a Flask app
app = Flask(__name__, template_folder='./templates', static_folder='./static')

# Define a route for the web page
@app.route("/")
def index():
    # Render the index.html template
    return render_template("index.html")

# Define a route for the image generation
@app.route("/generate", methods=["POST"])
def generate():
    # Get the brand and audience data from the form data
    brand = request.form.get("brand")
    audience = request.form.getlist("audience[]")

    # Check if the brand and audience fields are not empty
    if not brand or not audience:
        return render_template("index.html", error="Please enter a brand/product description and at least one audience description.")

    # Create a list of prompts using the brand and audience data
    prompts = [f"The product is {brand} with targeted audience look like {ad} , please write an advertisement banner to promote this" for ad in audience]
    
    images = []
    
    # Send a POST request to the Huggingface API with each prompt as data
    try:
        for prompt in prompts:
            payload = {"inputs": prompt}
            data = json.dumps(payload)
            response = requests.request("POST", API_URL, headers=headers, data=data)

            # Check if the response is successful
            if response.status_code == 200:
                # Get the image data from the response
                image_data = response.content

                # Encode the bytes to base64 and prepend the data URI scheme
                image_data = base64.b64encode(image_data).decode("utf-8")
                images.append(image_data)
            else:
                # Handle the error
                return render_template("index.html", error="Something went wrong. Please try again.")
        
        # Render the index.html template with the image data
        return jsonify({"images": images})
    except Exception as error:
        # Handle the error
        return render_template("index.html", error=error.message)

