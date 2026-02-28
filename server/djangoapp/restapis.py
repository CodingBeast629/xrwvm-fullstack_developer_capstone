import requests
import os
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv(
    'backend_url', default="http://localhost:3030")
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5050/")


def get_request(endpoint, **kwargs):
    params = ""
    if kwargs:
        for key, value in kwargs.items():
            params = params + key + "=" + str(value) + "&"

    request_url = backend_url + endpoint + "?" + params

    print("GET from {} ".format(request_url))

    try:
        response = requests.get(request_url)
        return response.json()
    except:
        print("Network exception occurred")


def analyze_review_sentiments(text):
    try:
        # Encode text so spaces/special characters don’t break URL
        encoded_text = requests.utils.quote(text)
        request_url = sentiment_analyzer_url + "analyze/" + encoded_text

        print("Analyzing sentiment via {}".format(request_url))

        response = requests.get(request_url)
        return response.json()
    except:
        print("Network exception occurred")


def post_review(data_dict):
    # Lab requires /insert_review endpoint
    request_url = backend_url + "/insert_review"

    print("POST to {}".format(request_url))

    try:
        response = requests.post(request_url, json=data_dict)
        return response.json()
    except:
        print("Network exception occurred")