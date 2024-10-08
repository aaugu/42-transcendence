import random
import jwt
import json
import os
from django.http import HttpRequest
from rest_framework_simplejwt.authentication import JWTAuthentication
from jwt import ExpiredSignatureError, InvalidTokenError

from colorama import Fore, Style

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
        dc = jwt.decode(access_token, secret_key, algorithms=['HS256'])
        return dc['user_id']
    else:
        return -1

def get_jwt_user_id(token):
    try:
        decoded_token = jwt.decode(token, os.environ.get('AETHERYTE_DJANGO_JWT_PASS'), algorithms=["HS256"])

        user_id = decoded_token.get('user_id')

        if user_id:
            return user_id
        else:
            return None

    except ExpiredSignatureError:
        return None

    except InvalidTokenError:
        return None

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
    print(f"User ID from JWT: {user_id_jwt} and User ID from URL: {user_id}, request path: {request.path}")
    if user_id == user_id_jwt:
        print(f"In check user jwt vs user url, returning True")
        return True
    else:
        print(f"In check user jwt vs user url, returning False")
        return False


