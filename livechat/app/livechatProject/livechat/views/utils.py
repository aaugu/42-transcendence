from django.db.models import Q
from livechat.models import User

# Check if user exists
def user_exists(user_id):
    user = User.objects.filter(Q(user_id=user_id))

    if user:
        return True
    return False

# Create user
def create_user(user_id):
    user = User(user_id=user_id)
    user.save()

    user_created = User.objects.filter(user_id=user_id)
    return user_created