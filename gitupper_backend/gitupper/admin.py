from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .forms import CustomUserChangeForm, CustomUserCreationForm
from .models import User

class UserManager(UserAdmin):    
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User
    
    ordering = ('email',)

    list_display = ('email', 'gitupper_id','pk', 'last_login', 'is_admin', 'is_staff')
    search_fields = ('email', 'gitupper_id')
    
    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()

admin.site.register(User, UserManager)