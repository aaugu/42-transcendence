import random
import jwt
from rest_framework_simplejwt.authentication import JWTAuthentication

def generate_verification_code():
    return str(random.randint(100000, 999999))

def check_autentication(request):
    access_token = request.COOKIES.get('access_token')
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
    access_token = request.COOKIES.get('access_token')
    secret_key = 'je mange des pingouins saveur arc en ciel tout les matins'
    if access_token:
        dc = jwt.decode(access_token, secret_key, algorithms=['HS256'])
        
        return dc['user_id']
    else:
        return -1

# example json user micro
{
    "nickname": "arnaud",
    "username": "afavre",
    "email": "afavre@ffxiv.ch",
    "password": "q",
}

{
    "verification_code": "" 
}