from rest_framework_simplejwt.authentication import JWTAuthentication
from colorama import Fore, Style

from login.models import *
from login.serializers import *
from rest_framework.response import Response

def check_authentication(request):
    access_token = request.COOKIES.get('csrf_token')
    if access_token:
        request.META['HTTP_AUTHORIZATION'] = 'Bearer ' + access_token
    else:
        return False

    # Utiliser JWTAuthentication pour authentifier la requête
    jwt_auth = JWTAuthentication()
    user, _ = jwt_auth.authenticate(request)

    if user is not None:
        return True
    else:
        return False

#example user creation
{
	"username":"afavre",
	"nickname":"arnaud",
	"email":"arnaud.favree@gmail.com",
	"password":"q",
    "avatar":"default avatar"
}