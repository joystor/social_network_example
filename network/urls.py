
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    #posts
    path("newPost", views.new_post, name="newPost"),
    path("editPost", views.edit_post, name="editPost"),
    path("post", views.post, name="post"),
    path("post_like", views.post_like, name="post_like"),
    path("user_info", views.user_info, name="user_info"),
    path("tog_follow", views.tog_follow, name="tog_follow"),
]
