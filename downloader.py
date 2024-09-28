import os
import requests
from bs4 import BeautifulSoup

# Set the static folder where Flask will serve the assets from
static_folder = "static/assets"
html_file = "templates/index_created.html"  # Your Flask app's HTML file should be inside 'templates'

# Ensure the static assets directory exists
os.makedirs(static_folder, exist_ok=True)

# Function to download file and save locally in the static folder
def download_file(url, local_path):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Check for HTTP errors

        # Create directory structure if not exist
        os.makedirs(os.path.dirname(local_path), exist_ok=True)

        # Write content to the local file
        with open(local_path, 'wb') as file:
            file.write(response.content)
        print(f"Downloaded: {url}")
    except Exception as e:
        print(f"Failed to download {url}. Error: {e}")

# Function to replace URLs in the HTML to point to the Flask 'static' folder
def replace_asset_links(soup, tag, attribute):
    for element in soup.find_all(tag):
        if element.has_attr(attribute):
            url = element[attribute]

            # Check if it's an external link
            if url.startswith('http'):
                # Create local path based on URL structure
                file_name = url.split("/")[-1].split("?")[0]  # Get file name from URL
                local_path = os.path.join(static_folder, file_name)

                # Download the file to static/assets
                download_file(url, local_path)

                # Update the HTML tag's attribute to point to Flask's static folder using url_for
                element[attribute] = "{{ url_for('static', filename='assets/" + file_name + "') }}"

# Read the HTML file (index.html should be located in the 'templates' folder for Flask)
with open(html_file, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# Replace links in <link> tags (CSS files)
replace_asset_links(soup, 'link', 'href')

# Replace links in <script> tags (JavaScript files)
replace_asset_links(soup, 'script', 'src')

# Replace image links in <img> tags (Images)
replace_asset_links(soup, 'img', 'src')

# Save the modified HTML to a new file inside the templates folder
with open(html_file, "w", encoding='utf-8') as f:
    f.write(str(soup))

print("All assets downloaded and index.html updated.")

