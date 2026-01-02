from django.shortcuts import render,redirect
from .forms import Addmovieform
from . models import *
from . models import User
from django.contrib import messages
from django.contrib.auth import login,logout
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.decorators import login_required


# ------------ admin pagess-------------
@login_required(login_url='admin_login')
def admin_profile(request):
    admin = request.user
    return render(request,'admin_profile.html',{'admin_email':admin.email})

@login_required(login_url='admin_login')
def admin_addmovie(request):
    return render(request,'admin_addmovie.html')

@login_required(login_url='admin_login')
def admin_home(request):

    data = Movieadd.objects.all()
    return render (request,'admin_home.html',{'data':data})

@login_required(login_url='admin_login')
def admin_handleusers(request):
    userinfo = User.objects.exclude(is_admin = True)
    return render(request,'admin_handleuser.html',{'user':userinfo})

@login_required(login_url='admin_login')
def admin_userhistory(request,id):
    user_history  = WatchHistory.objects.filter(user_id=id).select_related('movie')
    return render(request,'admin_userhistory.html',{'user_history':user_history})

@login_required(login_url='admin_login')
def admin_mostviews(request):
    return render(request,'admin_mostviews.html')

def admin_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        admin  = authenticate(request,email=email,password=password)
        if admin is None :
            messages.error(request, "Invalid credentials")
            return redirect('admin_login')
        
        if not admin.is_admin:
            messages.error(request, "You are not authorized as admin")
            return redirect('admin_login')
        else:
            login(request,admin)
            return redirect('admin_home') 
    return render(request,'admin_login.html')

@login_required(login_url='admin_login')
def admin_logout(request):
    if request.method == 'POST':
        logout(request)
        return redirect('admin_login')
    return render(request,'admin_profile.html')



@login_required(login_url='admin_login')
def admin_single_movie(request,id):
    movie_data = Movieadd.objects.get(id=id)
    return render(request,'admin_single_movie.html',{'movie_data':movie_data})

@login_required(login_url='admin_login')
def addmovie_form(request):
    if request.method == 'POST':
        form = Addmovieform(request.POST , request.FILES)
        if form.is_valid():
            form.save()
            return redirect('admin_home')
        else:
            print('form error',form.errors)
    else:
        form = Addmovieform()
    return render(request,'admin_addmovie.html',{'form':form})

@login_required(login_url='admin_login')
def movie_edit(request,id):
    data = Movieadd.objects.get(id=id)
    if request.method == 'POST':
        form = Addmovieform(request.POST, request.FILES,  instance = data)
        if form.is_valid():
            form.save()
            return redirect('admin_home')
    form = Addmovieform(instance=data)
    return render(request,'admin_editmovie.html',{'form':form})

@login_required(login_url='admin_login')
def delete_movie(request,id):
    data  = get_object_or_404(Movieadd,id=id)
    if request.method == 'POST':
        data.delete()
    return redirect('admin_home')
    

@login_required(login_url='admin_login')
def user_status(request,id):
    user = get_object_or_404(User, id=id)
    if user.is_active:
        user.is_active = False
    else:
        user.is_active = True
    user.save()
    return redirect(request.META.get('HTTP_REFERER', 'admin_handleuser'))


@login_required(login_url='admin_login')
def admin_pass_change(request):
    user = request.user
    if request.method =='POST':
        old_password = request.POST.get('old_password')
        new_password = request.POST.get('new_password')
        if not user.check_password(old_password):
            messages.error(request, "old password is incorrect")
            return redirect('admin_passchange')    
        try:
            validate_password(new_password,user=user)
        except ValidationError as e:
            for error in e.messages:
                messages.error(request, error)
                return redirect('admin_passchange')
    
        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)
        return redirect('admin_home')
    return render(request,'admin_passchange.html')












# ---------------------------------------------

# Django rest api session for user sesssion

# ------------------------------------------------



from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions
from .models import User
import re
from rest_framework.status import HTTP_200_OK,HTTP_400_BAD_REQUEST,HTTP_404_NOT_FOUND
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import Movieadd,WatchList,WatchHistory
from .serializers import MovielistSerializers,MoviewatchlistSerializers,WatchhistorySerializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404



@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def api_signup(request):
    email = request.data.get("email")
    password = request.data.get("password")


    name = request.data.get("name")
    if not name or not email or not password:
        return Response({"message":"all fields are required"})
    

    # email validation
    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not re.match(email_regex, email):
        return Response(
        {"message": "Invalid email format"},
        status=HTTP_400_BAD_REQUEST
    )

# Password validation
    if len(password) < 8:
        return Response(
        {"message": "Password must be at least 8 characters"},
        status=HTTP_400_BAD_REQUEST
    )
    


    if User.objects.filter(email=email).exists():
            return  Response({'message':'Email already exist'},status=HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(email=email,password=password)
    user.name = name
    user.save()
    return Response({'message':"user created succssfully..."},status=HTTP_200_OK)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])

def api_login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    if not email or not password:
        return Response({'message':'all fields are required.'},status=HTTP_400_BAD_REQUEST)
    user = authenticate(email = email,password = password)
    if not user:
        return Response({'message':'invalid credentials'},HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key},status=HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def movielist_api(request):
    moviedata = Movieadd.objects.all()
    serializer = MovielistSerializers(moviedata,many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def single_move_view(request, id):
    try:
        single_moviedata = Movieadd.objects.get(id=id)
    except Movieadd.DoesNotExist:
        return Response({'message': "Movie details not found"}, status=404)
    
    serializer = MovielistSerializers(single_moviedata)  
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def movie_search_api(request):
    query = request.GET.get('title',None)
    if query:
        moviedata = Movieadd.objects.filter(title__icontains=query)
        if moviedata.exists():
            serializer = MovielistSerializers(moviedata, many=True)
            return Response(serializer.data)
        else:
            return Response({'message': 'No movies found'}, status=404)



    else:
        return Response({'message':'invalid search'})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_api(request):
    try:
        request.user.auth_token.delete()
        return Response({'meaasge':'logout successfully...'})
    except:
        return Response({'message':'failed to logout..'},status=400)        

    
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_watchlist(request):
    movie_id = request.data.get('movie_id')
    if not movie_id:
        return Response({"message": "movie_id is required"},
            status=400
        )
    try:
        movie = Movieadd.objects.get(id=movie_id)
    except Movieadd.DoesNotExist:
        return Response({"message": "Movie not found"},
            status=404)
    watchlist, created = WatchList.objects.get_or_create(user=request.user,movie=movie)
    if not created:
        return Response({"message": "Movie already in watchlist"},
            status=409)
    return Response({"message": "Movie added to watchlist"},
        status=201)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_watchlist(request):
    watchlist = WatchList.objects.filter(user=request.user)
    serializer = MoviewatchlistSerializers(watchlist, many=True)  
    return Response(serializer.data) 


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def user_watchlist_delete(request,id):
    try:
        movie = WatchList.objects.get(user=request.user,movie_id=id)
    except WatchList.DoesNotExist:
        return Response( {"message": "Movie not in watchlist"},
            status=HTTP_404_NOT_FOUND)    
    movie.delete()
    return Response( {"message": "Movie removed from watchlist"},
        status=200)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_profile(request):
    user_data = request.user
    return Response({"email":user_data.email})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def user_pass_change(request):
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    if not old_password or not new_password:
        return Response({"message":"both fields are required for password change.."},status=HTTP_400_BAD_REQUEST)

    if not user.check_password(old_password):
        return Response({"message":'old password is wrong..'},status=HTTP_400_BAD_REQUEST)
    
    try:
        validate_password(new_password,user=user)
    except ValidationError as e:
        return Response(
            {"message": e.messages},
            status=HTTP_400_BAD_REQUEST
        )    

    
    user.set_password(new_password)
    user.save()
    Token.objects.filter(user=user).delete()
    return Response({"message":'password change successfully..'},status=HTTP_200_OK)
    

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_watch_history(request):
    user = request.user
    movie_id = request.data.get('movie_id')
    if not movie_id:
        return Response('movie id required..')
    movie = get_object_or_404(Movieadd,id=movie_id)

    history, created = WatchHistory.objects.get_or_create(user=user,movie=movie)

    if not created:
        history.save()
    return Response({"message": "Added to watch history"})   

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def view_watch_history(request):
    history = (
        WatchHistory.objects
        .filter(user=request.user)
        .select_related('movie')
    )
    serializer = WatchhistorySerializers(history,many=True)
    return Response(serializer.data)

 
    