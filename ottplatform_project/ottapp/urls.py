from django.urls import path
from . import views

urlpatterns = [
    path('admin_profile', views.admin_profile, name='admin_profile'), 
    path('movie_add',views.addmovie_form,name="movie_add"),
    path('editmovie/<int:id>/',views.movie_edit,name='editmovie'),
    path('admin_home/',views.admin_home,name='admin_home'),
    path('admin_handleuser',views.admin_handleusers,name='admin_handleuser'),
    path('admin_userhistory/<int:id>/',views.admin_userhistory,name='admin_userhistory'),
    path('admin_mostview',views.admin_mostviews,name='admin_mostview'),
    path('',views.admin_login,name='admin_login'),
    path('admin_single_movie/<int:id>/',views.admin_single_movie,name='admin_single_movie'),
    path('delete_movie/<int:id>/',views.delete_movie,name='delete_movie'),
    path('user_block/<int:id>/',views.user_status,name='user_block'),
    path('admin_logout',views.admin_logout,name='admin_logout'),
    path('admin_passchange',views.admin_pass_change,name='admin_passchange'),





    
    # restapi urls
    path('api_signup',views.api_signup,name='api_signup'),
    path('api_login',views.api_login,name='api_login'),
    path('api_movielist',views.movielist_api,name='api_movielist'),
    path('api_single_moviedata/<int:id>/',views.single_move_view,name='api_single_moviedata'),
    path('api_movie_search/',views.movie_search_api,name='api_movie_search'),
    path('api_logout',views.logout_api,name='api_logout'),
    path('api_addwatchlist/add/',views.add_watchlist,name='api_addwatchlist'),
    path('api_user_watchlist',views.user_watchlist,name='api_user_watchlist'),
    path('api_delete_watchlist/<int:id>/',views.user_watchlist_delete,name='api_delete_watchlist'),
    path('api_user_profile',views.user_profile,name='api_user_profile'),
    path('api_user_pass_change',views.user_pass_change,name='api_user_pass_change'),
    path('api_add_watchhistory',views.add_watch_history,name='api_add_watchhistory'),
    path('api_watch_history',views.view_watch_history,name='api_watch_history'),




]
