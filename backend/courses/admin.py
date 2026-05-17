from django.contrib import admin

from .models import Course, CourseCategory, Schedule


class ScheduleInline(admin.TabularInline):
    model = Schedule
    extra = 1


@admin.register(CourseCategory)
class CourseCategoryAdmin(admin.ModelAdmin):
    list_display = ["name_ru", "name_ky", "name_en", "slug", "courses_count"]
    prepopulated_fields = {"slug": ("name_en",)}

    @admin.display(description="Courses")
    def courses_count(self, obj):
        return obj.courses.count()


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ["title_ru", "category", "duration", "price", "start_date", "is_active"]
    list_filter = ["category", "is_active", "start_date"]
    list_editable = ["is_active", "price"]
    search_fields = ["title_ru", "title_ky", "title_en"]
    inlines = [ScheduleInline]
    fieldsets = (
        ("Titles", {
            "fields": ("title_ky", "title_ru", "title_en"),
        }),
        ("Descriptions", {
            "fields": ("description_ky", "description_ru", "description_en"),
            "classes": ("collapse",),
        }),
        ("Details", {
            "fields": ("category", "image", "duration", "price", "start_date", "is_active"),
        }),
    )


@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ["course", "day", "start_time", "end_time", "room"]
    list_filter = ["day", "course"]
    list_editable = ["start_time", "end_time", "room"]
