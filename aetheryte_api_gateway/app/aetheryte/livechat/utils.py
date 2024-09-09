from django.db.models import Q
from livechat.models import CustomUser

# Check if user is valid based on id
def user_valid(user_id):
    user = CustomUser.objects.filter(id=user_id)
    if user:
        return True
    return False

# Check if user exists based on nickname
def user_exists(nickname):
    user = CustomUser.objects.filter(nickname=nickname)
    if user:
        return True
    return False