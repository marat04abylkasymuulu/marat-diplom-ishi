from rest_framework import serializers

from .models import Course, CourseCategory, Schedule


class ScheduleSerializer(serializers.ModelSerializer):
    day_display = serializers.CharField(source="get_day_display", read_only=True)

    class Meta:
        model = Schedule
        fields = ["id", "day", "day_display", "start_time", "end_time", "room"]


class CourseSerializer(serializers.ModelSerializer):
    schedules = ScheduleSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source="category.name_ru", read_only=True)

    class Meta:
        model = Course
        fields = [
            "id", "category", "category_name",
            "title_ky", "title_ru", "title_en",
            "description_ky", "description_ru", "description_en",
            "image", "duration", "price", "start_date", "is_active",
            "schedules",
        ]


class CourseCategorySerializer(serializers.ModelSerializer):
    courses_count = serializers.IntegerField(source="courses.count", read_only=True)

    class Meta:
        model = CourseCategory
        fields = ["id", "name_ky", "name_ru", "name_en", "slug", "courses_count"]
