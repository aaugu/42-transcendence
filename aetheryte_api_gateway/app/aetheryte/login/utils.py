import random
import jwt
import json
import os
from django.http import HttpRequest
from rest_framework_simplejwt.authentication import JWTAuthentication

from colorama import Fore, Style
import logging

logger = logging.getLogger(__name__)

def generate_verification_code():
    return str(random.randint(100000, 999999))

def dprint(msg):
    full_msg = "DEBUG ==> " + str(msg)
    colored_msg = Fore.YELLOW + full_msg + Style.RESET_ALL
    print(colored_msg)


def check_authentication(request):
    access_token = request.COOKIES.get('csrf_token')
    if access_token:
        request.META['HTTP_AUTHORIZATION'] = 'Bearer ' + access_token
    else:
        return False

    jwt_auth = JWTAuthentication()
    user = jwt_auth.authenticate(request)

    if user is not None:
        return True
    else:
        return False
    
def get_user_from_jwt(request):
    access_token = request.COOKIES.get('csrf_token')
    secret_key = os.environ.get('AETHERYTE_DJANGO_JWT_PASS')
    if access_token:
        print(f"Access token found: {access_token}")
        dc = jwt.decode(access_token, secret_key, algorithms=['HS256'])
        print(f"User ID: {dc['user_id']}") 
        return dc['user_id']
    else:
        print("No access token found")
        return -1

def check_user_jwt_vs_user_body(request: HttpRequest, user_id_name: str):
    json_request = json.loads(request.body.decode('utf-8'))
    user_id_body = json_request.get(user_id_name)
    user_id_jwt = get_user_from_jwt(request)
    if user_id_body == user_id_jwt:
        return True
    else:
        return False

def check_user_jwt_vs_user_url(request: HttpRequest, user_id: int):
    user_id_jwt = get_user_from_jwt(request)
    # print(f"User ID URL: {user_id}, user ID JWT: {user_id_jwt}")
    if user_id == user_id_jwt:
        return True
    else:
        return False


# example json user micro
{
    "nickname": "arnaud",
    "username": "afavre",
    "email": "afavre@ffxiv.ch",
    "password": "q",
    "avatar": "default avatar"
}

{
    "verification_code": "" 
}