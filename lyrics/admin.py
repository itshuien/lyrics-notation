from django.contrib import admin

from .models import Lyric, LyricNotation, PhoneticNotation
from .forms import LyricForm

class LyricAdmin(admin.ModelAdmin):
    form = LyricForm

    def save_model(self, request, obj, form, change):
        obj.lines = form.cleaned_data['lines'][0].splitlines()
        super().save_model(request, obj, form, change)

admin.site.register(Lyric, LyricAdmin)
admin.site.register(LyricNotation)
admin.site.register(PhoneticNotation)
