from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager 
from django.conf import settings

User = settings.AUTH_USER_MODEL




class UserManager(BaseUserManager): 
    def create_user(self, email, password=None): 
        if not email: 
            raise ValueError("Users must have an email address") 
        email = self.normalize_email(email) 
        user = self.model(email=email) 
        user.set_password(password) 
        user.save(using=self._db) 
        return user 
 
    def create_superuser(self, email, password): 
        user = self.create_user(email, password) 
        user.is_admin = True 
        user.is_superuser = True 
        user.save(using=self._db) 
        return user 
 
class User(AbstractBaseUser): 
    email = models.EmailField(unique=True) 
    name = models.CharField(max_length =255) 
    is_active = models.BooleanField(default=True) 
    is_admin = models.BooleanField(default=False) 
    objects = UserManager() 
 
    USERNAME_FIELD = 'email'


class Movieadd(models.Model):
    title = models.CharField(max_length=50)
    discription = models.TextField()
    movie_file = models.FileField(upload_to='movie/')
    thumbnail = models.ImageField(upload_to='thumbnail/')

class WatchList(models.Model):
        user = models.ForeignKey(
            User,
            on_delete=models.CASCADE,
            related_name='watchlist'
        )
        movie = models.ForeignKey(
            Movieadd,
            on_delete=models.CASCADE,
            related_name='watchlisted'
        )

        class Meta:
            unique_together = ('user', 'movie')

class WatchHistory(models.Model):

    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='watch_history') 
    movie = models.ForeignKey(Movieadd,on_delete=models.CASCADE,related_name='watch_history')  
    watched_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-watched_at']
        unique_together = ('user', 'movie')

