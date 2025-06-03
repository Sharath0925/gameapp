from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

from datetime import datetime
from django.contrib.auth.forms import AuthenticationForm
import os
from urllib.parse import quote_plus
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# MongoDB Setup
username = quote_plus("Sharathreddy")
password = quote_plus("Sharath")
MONGO_URI = f"mongodb+srv://{username}:{password}@cluster0.bz0bvc4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(MONGO_URI)
db = client["brain_games_db"]
scores_collection = db["scores"]
users_collection = db["users"]  # For extra user info only (not passwords)

# -------------------------------
# Public Views
# -------------------------------

def home(request):
    return render(request, 'home.html')

def reaction_test(request):
    return render(request, 'reaction_test.html')

def math_quiz(request):
    return render(request, "math_quiz.html")

def memory_game_view(request):
    return render(request, 'memory_game.html')

# -------------------------------
# Authentication Views
# -------------------------------

def signup_view(request):
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '').strip()
        email = request.POST.get('email', '').strip()
        phone = request.POST.get('phone', '').strip()

        print("username",username)
        
        if not username or not password or not email or not phone:
            return render(request, 'signup.html', {'error': 'All fields are required'})

        if users_collection.find_one({'username': username,'email':email}):
            return render(request, 'signup.html', {'error': 'Username already taken'})
        
        print("hello")
        
        users_collection.insert_one({
            'username': username,
            'password': password, 
            'email': email,
            'phone': phone
        })

        messages.success(request, 'Signup successful. Please log in.')
        return redirect('login')

    return render(request, 'signup.html')

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '').strip()

        if not username or not password:
            return render(request, 'login.html', {'error': 'Username and password are required'})

       
        
        user = users_collection.find_one({
            'username': username,
            'password': password  
        })

        if user:
            return redirect('check_pending_score')
        else:
            return render(request, 'login.html', {'error': 'Invalid username or password'})

    return render(request, 'login.html')


def logout_view(request):
    logout(request)
    return redirect('login')

# -------------------------------
# Score Logic
# -------------------------------

@login_required
def check_pending_score(request):
    return render(request, 'check_score.html')

@login_required
def submit_score(request):
    if request.method == "POST":
        score = request.POST.get("score")
        game_name = request.POST.get("game", "Unknown")

        if not score or not game_name:
            return JsonResponse({"status": "error", "message": "Missing score or game name"}, status=400)

        try:
            score = int(score)
        except ValueError:
            return JsonResponse({"status": "error", "message": "Score must be an integer"}, status=400)

        try:
            scores_collection.insert_one({
                "user": request.user.username,
                "game": game_name,
                "score": score,
                "timestamp": datetime.now()
            })
            return JsonResponse({"status": "success"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid method"}, status=405)

@login_required
def view_scores(request):
    username = request.user.username
    scores = list(scores_collection.find({"user": username}).sort("timestamp", -1))

    # Remove MongoDB internal _id before rendering
    for score in scores:
        score.pop('_id', None)

    return render(request, 'view_scores.html', {'scores': scores})
