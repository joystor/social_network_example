from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    text = models.CharField(max_length=255)
    
    def serialize(self):
        return {
            "id": self.id,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "text": self.text
        }
    
class PostLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    
    
class UserFollows(models.Model):
    user = models.ForeignKey(User, null=True, related_name='user', on_delete=models.CASCADE)
    user_follow = models.ForeignKey(User, null=True, related_name='follow', on_delete=models.CASCADE)