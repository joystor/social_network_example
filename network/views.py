import json
from django import forms
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.core.paginator import Paginator
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse

from .models import User, Post, PostLike, UserFollows

def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@login_required
def new_post(request):
    if request.method == "POST":
        data = json.loads(request.body)
        txt = data.get('txt', '')
        if txt is not "":
            post = Post(
                user=request.user,
                text=txt
            )
            post.save()
            return JsonResponse({
                "ok":1,
                "error": ""
            }, status=200)
    return JsonResponse({
        "ok":0,
        "error": "method not allowed"
    }, status=400)
    
@login_required
def edit_post(request):
    if request.method == "POST":
        data = json.loads(request.body)
        txt = data.get('txt', '')
        id = data.get('id', '')
        if txt is not "" and id is not "":
            post = Post.objects.get(
                id=id
            )
            if post is not None:
                post.text = txt
                post.save()
            return JsonResponse({
                "ok":1,
                "error": ""
            }, status=200)
    return JsonResponse({
        "ok":0,
        "error": "method not allowed"
    }, status=400)
            
def post(request):
    if request.method == "GET":
        pag_num = 1
        try:
            pag_num = forms.IntegerField().clean(request.GET.get('pag',1))
        except ValidationError:
            pag_num = 1
        if pag_num < 1:
            pag_num = 1
            
        profile_user = request.GET.get('p',-1)
        following = request.GET.get('f',-1)
        
        if profile_user == -1 and following == -1:
            # all posta
            posts_all = Post.objects.all().order_by('-timestamp')
        else:
            if following == -1:
                # only post of the user
                posts_all = Post.objects.filter(user = profile_user).order_by('-timestamp')
            else:
                # post of followin users
                users = UserFollows.objects.filter(user = request.user)
                users_following = []
                for u in users:
                    users_following.append(u.user_follow.id)
                posts_all = Post.objects.filter(user__in = users_following).order_by('-timestamp')
        
        paginator = Paginator(posts_all, 10)
        
        if pag_num > paginator.num_pages:
            pag_num = paginator.num_pages
        page_post = paginator.page(pag_num)
        
        post_list = []
        for p in page_post.object_list:
            post_likes = PostLike.objects.filter(post=p)
            post_likeslist = []
            for pl in post_likes:
                post_likeslist.append({
                    "user_id":pl.user.id,
                    "username": pl.user.username,
                })
            post_list.append({
                "post_id":p.id,
                "user_id":p.user.id,
                "username": p.user.username,
                "timestamp":p.timestamp.strftime("%Y/%m/%d %H:%M:%S"),
                "txt":p.text,
                "post_likes":post_likeslist
            })
        # post_list = serializers.serialize('json', posts)
        return JsonResponse({
                "ok":1,
                "error": "",
                "page":pag_num,
                "num_pages":paginator.num_pages,
                "post_count":paginator.count,
                "posts":post_list
            }, status=200, safe=False)
    return JsonResponse({
        "ok":0,
        "error": "method not allowed"
    }, status=400)

@login_required
def post_like(request):
    return_obj = {
        "ok":0,
        "error": "method not allowed"
    }
    if request.method == "POST":
        data = json.loads(request.body)
        id_post = data.get('id',-1)
        if id_post != -1:
            try:
                post = Post.objects.get(id=id_post)
            except Post.DoesNotExist:
                post = None
            if post != None:
                try:
                    post_like = PostLike.objects.get(
                        user = request.user.id, 
                        post = post.id)
                except PostLike.DoesNotExist:
                    post_like = None
                if post_like == None:
                    post_like =  PostLike(
                        user = request.user,
                        post = post 
                    )
                    post_like.save()
                else:
                    post_like.delete()
                    
                post_likes = PostLike.objects.filter(post=post)
                post_likeslist = []
                for pl in post_likes:
                    post_likeslist.append({
                        "user_id":pl.user.id,
                        "username": pl.user.username,
                    })
                    
                post = Post.objects.get(id=id_post)
                return_obj = {
                    "ok":1,
                    "error": "",
                    "post": {
                        "post_id":post.id,
                        "user_id":post.user.id,
                        "username": post.user.username,
                        "timestamp":post.timestamp.strftime("%Y/%m/%d %H:%M:%S"),
                        "txt":post.text,
                        "post_likes":post_likeslist
                    }
                }
        else:
            return_obj = {
                    "ok":0,
                    "error": "Post not found {}".format(id_post)
            }
    return JsonResponse(return_obj, status=200)



def get_user_info(search_user_id, actual_user_id, is_authenticated):
    return_obj = {
        "ok":0,
        "error": "User not found",
    }
    if search_user_id != -1:
            user = User.objects.get(id=search_user_id)
            
            count_posts = Post.objects.filter(user=search_user_id).count()
            count_following = UserFollows.objects.filter(user=search_user_id).count()
            count_followers = UserFollows.objects.filter(user_follow=search_user_id).count()
            is_following = 0
            if is_authenticated:
                is_following = UserFollows.objects.filter(user= actual_user_id, user_follow=search_user_id).count()

            return_obj = {
                "ok":1,
                "error": "",
                "usid": user.id,
                "username": user.username,
                "posts": count_posts,
                "follower": count_followers,
                "following": count_following,
                "actual_usr": (actual_user_id if actual_user_id != None else  -1),
                "is_following": is_following
            }
    return return_obj
    
def user_info(request):
    return_obj = {
        "ok":0,
        "error": "method not allowed"
    }
    
    if request.method == "GET":
        user_id = request.GET.get('u',-1)
        return_obj = get_user_info(user_id, request.user.id, request.user.is_authenticated)
        
    
    return JsonResponse(return_obj, status=200)



def tog_follow(request):
    return_obj = {
        "ok":0,
        "error": "User not found",
    }
    if request.method == "POST":
        data = json.loads(request.body)
        user_id = data.get('id',-1)
        
        is_following = UserFollows.objects.filter(user= request.user.id, user_follow=user_id).count()
        user2follow = User.objects.get(id=user_id)
        if is_following == 0:
            userFollow = UserFollows(user= request.user, user_follow=user2follow)
            userFollow.save()
        else:
            userFollow = UserFollows.objects.get(user= request.user, user_follow=user2follow)
            userFollow.delete()
        
        return_obj = get_user_info(user_id, request.user.id, request.user.is_authenticated)
    
    return JsonResponse(return_obj, status=200)