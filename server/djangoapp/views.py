from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import logout, login, authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import json
import logging
from .models import CarMake, CarModel
from .populate import initiate

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