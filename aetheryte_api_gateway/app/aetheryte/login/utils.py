import random

def generate_verification_code():
    return str(random.randint(100000, 999999))


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