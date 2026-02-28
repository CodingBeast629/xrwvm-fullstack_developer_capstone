import requests

backend_url = "http://localhost:3030"
sentiment_analyzer_url = "http://localhost:5050/"


def get_request(endpoint, **kwargs):
    params = ""
    if kwargs:
        for key, value in kwargs.items():
            params += f"{key}={value}&"

    request_url = backend_url + endpoint
    if params:
        request_url += "?" + params

    print("GET from {}".format(request_url))

    try:
        response = requests.get(request_url)
        return response.json()
    except Exception as e:
        print("Network exception occurred:", e)
        return []


def analyze_review_sentiments(text):
    try:
        encoded_text = requests.utils.quote(text)
        request_url = sentiment_analyzer_url + "analyze/" + encoded_text

        print("Analyzing sentiment via {}".format(request_url))

        response = requests.get(request_url)
        return response.json()
    except Exception as e:
        print("Network exception occurred:", e)
        return None


def post_review(data_dict):
    request_url = backend_url + "/insert_review"

    print("POST to {}".format(request_url))

    try:
        response = requests.post(request_url, json=data_dict)
        return response.json()
    except Exception as e:
        print("Network exception occurred:", e)
        return None