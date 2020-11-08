from django.forms import ModelForm
from django.contrib.postgres.forms import SimpleArrayField
from django.forms.fields import CharField
from django.forms.widgets import Textarea

from .models import Lyric

class LyricForm(ModelForm):
    lines = SimpleArrayField(CharField(), delimiter='|', widget=Textarea())

    def __init__(self, *args, **kwargs):
        super(LyricForm, self).__init__(*args, **kwargs)
        
        if self.instance.lines:
            self.instance.lines = '\r\n'.join(self.instance.lines)

        super(LyricForm, self).__init__(*args, **kwargs)
