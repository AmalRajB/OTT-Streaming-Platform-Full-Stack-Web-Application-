from .models import Movieadd,WatchList,WatchHistory
from rest_framework import serializers
from django.utils import timezone

class WatchHistorySerializer(serializers.ModelSerializer):
    watched_at = serializers.SerializerMethodField()

    class Meta:
        model = WatchHistory
        fields = ['id', 'movie', 'watched_at']

    def get_watched_at(self, obj):
        local_time = timezone.localtime(obj.watched_at)
        return local_time.strftime("%B %d, %Y %I:%M %p")


class MovielistSerializers(serializers.ModelSerializer):
    class Meta:
        model = Movieadd
        fields = '__all__'

class MoviewatchlistSerializers(serializers.ModelSerializer):
    movie = MovielistSerializers(read_only=True)
    class Meta:
        model = WatchList  
        fields = ['id', 'movie']  

class WatchhistorySerializers(serializers.ModelSerializer):
    movie = MovielistSerializers(read_only=True)
    watched_at = serializers.SerializerMethodField()

    
    class Meta:
        model = WatchHistory
        fields = ['id', 'movie', 'watched_at']
    def get_watched_at(self, obj):
        local_time = timezone.localtime(obj.watched_at)
        return local_time.strftime("%B %d, %Y %I:%M %p")
