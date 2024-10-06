import os, jwt
from django.http import HttpRequest
from rest_framework_simplejwt.authentication import JWTAuthentication
from jwt import ExpiredSignatureError, InvalidTokenError

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