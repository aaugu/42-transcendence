from rest_framework_simplejwt.authentication import JWTAuthentication

from colorama import Fore, Style

# debug function

def error_builder(error_msg):
    return {"error": error_msg}

# Debug functions

def dprint(msg):
    full_msg = "DEBUG ==> " + str(msg)
    colored_msg = Fore.YELLOW + full_msg + Style.RESET_ALL
    print(colored_msg)

# authentication function