from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import logout, login, authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import json
import logging
from .models import CarMake, CarModel
from .populate import initiate

# REST helpers
from .restapis import get_request, analyze_review_sentiments, post_review

logger = logging.getLogger(__name__)


# =======================
# LOGIN
# =======================
@csrf_exempt
def login_user(request):
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']

    user = authenticate(username=username, password=password)
    response = {"userName": username}

    if user is not None:
        login(request, user)
        response = {"userName": username, "status": "Authenticated"}

    return JsonResponse(response)


# =======================
# LOGOUT
# =======================
def logout_request(request):
    logout(request)
    return JsonResponse({"userName": ""})


# =======================
# REGISTER
# =======================
@csrf_exempt
def registration(request):
    data = json.loads(request.body)

    username = data['userName']
    password = data['password']
    first_name = data['firstName']
    last_name = data['lastName']
    email = data['email']

    # If user already exists
    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Already Registered"})

    # Create user
    user = User.objects.create_user(
        username=username,
        password=password,
        first_name=first_name,
        last_name=last_name,
        email=email
    )

    login(request, user)

    return JsonResponse({"userName": username, "status": "Authenticated"})


# =======================
# GET CARS (LAB REQUIREMENT)
# =======================
def get_cars(request):
    # Populate only if CarModels do not exist yet
    if CarModel.objects.count() == 0:
        initiate()

    car_models = CarModel.objects.select_related('car_make')
    cars = []

    for car_model in car_models:
        cars.append({
            "CarModel": car_model.name,
            "CarMake": car_model.car_make.name
        })

    return JsonResponse({"CarModels": cars})


# =======================
# DEALERSHIPS (LAB REQUIREMENT)
# =======================
def get_dealerships(request, state="ALL"):
    """
    Returns list of dealerships.
    - /fetchDealers for all
    - /fetchDealers/<state> for a specific state
    """
    if state == "ALL":
        endpoint = "/fetchDealers"
    else:
        endpoint = "/fetchDealers/" + state

    dealerships = get_request(endpoint)
    return JsonResponse({"status": 200, "dealers": dealerships})


def get_dealer_details(request, dealer_id):
    """
    Returns a single dealer by id using /fetchDealer/<dealer_id>
    """
    endpoint = "/fetchDealer/" + dealer_id
    dealer = get_request(endpoint)
    return JsonResponse({"status": 200, "dealer": dealer})


def get_dealer_reviews(request, dealer_id):
    """
    Returns reviews for a dealer using /fetchReviews/dealer/<dealer_id>
    Adds sentiment for each review using the sentiment analyzer microservice.
    """
    endpoint = "/fetchReviews/dealer/" + dealer_id
    reviews = get_request(endpoint)

    # If backend returns None or something unexpected, avoid crashing
    if not reviews:
        reviews = []

    for review in reviews:
        review_text = review.get("review", "")
        sentiment_response = analyze_review_sentiments(review_text)

        # sentiment_response might be None if network error
        if sentiment_response and isinstance(sentiment_response, dict):
            review["sentiment"] = sentiment_response.get("sentiment")
        else:
            review["sentiment"] = None

    return JsonResponse({"status": 200, "reviews": reviews})


# =======================
# ADD REVIEW (LAB REQUIREMENT)
# =======================
@csrf_exempt
def add_review(request):
    if request.user.is_anonymous == False:
        data = json.loads(request.body)
        try:
            post_review(data)
            return JsonResponse({"status": 200})
        except:
            return JsonResponse({"status": 401, "message": "Error in posting review"})
    else:
        return JsonResponse({"status": 403, "message": "Unauthorized"})