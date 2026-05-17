from django.contrib import admin

from .models import Teacher


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ["full_name_ru", "subject_ru", "experience_years", "is_active", "order"]
    list_filter = ["is_active"]
    list_editable = ["order", "is_active"]
