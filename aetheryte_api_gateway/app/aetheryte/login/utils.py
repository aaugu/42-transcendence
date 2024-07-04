from rest_framework_simplejwt.authentication import JWTAuthentication



import requests
from colorama import Fore, Style

from .serializers import CustomTokenObtainPairSerializer

def dprint(msg):
    full_msg = "DEBUG ==> " + str(msg)
    colored_msg = Fore.YELLOW + full_msg + Style.RESET_ALL
    print(colored_msg)

def check_autentication(request):
    access_token = request.COOKIES.get('access_token')
    if access_token:
        request.META['HTTP_AUTHORIZATION'] = 'Bearer ' + access_token
    else:
        return False

    jwt_auth = JWTAuthentication()
    user, _ = jwt_auth.authenticate(request)

    if user is not None:
        return True
    else:
        return False

custom_headers = {
    'etherite': 'Les capibara ne sont pas si mignon que ca',
}

def make_request(type, url, payload):
    if type == 'GET':
        return requests.get(url, headers=custom_headers)
    
    elif type == 'POST':
        return requests.post(url, json=payload, headers=custom_headers)
    
    elif type == 'PUT':
        return requests.put(url, json=payload, headers=custom_headers)
    
    elif type == 'PATCH':
        return requests.patch(url, json=payload, headers=custom_headers)
    
    elif type == 'DELETE':
        return requests.delete(url, headers=custom_headers)
    
    else:
        return False


    
def create_payload(user, data):
    pnickname = data.get('nickname') if data.get('nickname') else user.json().get('nickname')
    pusername = data.get('username') if data.get('username') else user.json().get('username')
    pemail = data.get('email') if data.get('email') else user.json().get('email')
    
    payload = {
        "username": pusername,
        "nickname" : pnickname,
        "email" : pemail
    }
    return payload

# example json user micro
{
    "nickname": "afavre",
    "username": "arnaud",
    "email": "afavre@ffxiv.ch",
    "password": "q"
}