from django.db.models import Q
from livechat.models import User

# Check if user exists
def user_exists(user_id):
    user = User.objects.filter(Q(user_id=user_id))

    if user:
        return True
    return False