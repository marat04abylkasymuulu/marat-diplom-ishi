from django.contrib.auth.models import User
from rest_framework import serializers

from contacts.models import Branch, ContactSubmission, SitePromo
from courses.models import Course, CourseCategory, Schedule
from news.models import NewsArticle
from reviews.models import Achievement, Review, StudentFeedback
from teachers.models import Teacher


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email", "is_staff"]


class CourseCategoryAdminSerializer(serializers.ModelSerializer):
    courses_count = serializers.SerializerMethodField()
    slug = serializers.SlugField(required=False)

    class Meta:
        model = CourseCategory
        fields = "__all__"

    def get_courses_count(self, obj):
        return obj.courses.count()

    def create(self, validated_data):
        if not validated_data.get("slug"):
            from django.utils.text import slugify
            base = validated_data.get("name_ru") or validated_data.get("name_ky", "")
            validated_data["slug"] = slugify(base, allow_unicode=True)
        return super().create(validated_data)


class ScheduleAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = "__all__"


class CourseAdminSerializer(serializers.ModelSerializer):
    schedules = ScheduleAdminSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source="category.name_ru", read_only=True)

    class Meta:
        model = Course
        fields = "__all__"


class TeacherAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = "__all__"


class ReviewAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"


class StudentFeedbackAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentFeedback
        fields = "__all__"


class AchievementAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = "__all__"


class NewsArticleAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsArticle
        fields = "__all__"


class BranchAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = "__all__"


class SitePromoAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = SitePromo
        fields = [
            "discount_ky", "discount_ru", "discount_en",
            "limited_ky", "limited_ru", "limited_en",
            "ticker_enabled",
        ]


class ContactSubmissionAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = "__all__"
