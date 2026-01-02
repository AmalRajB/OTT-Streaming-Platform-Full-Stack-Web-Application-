from django import forms
from .models import Movieadd

class Addmovieform(forms.ModelForm):
    class Meta:
        model = Movieadd
        fields ='__all__'