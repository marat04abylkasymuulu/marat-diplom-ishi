from rest_framework import serializers

from .models import Achievement, Review, StudentFeedback


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            "id", "student_name",
            "text_ky", "text_ru", "text_en",
            "score", "video_url", "photo", "year", "is_featured",
        ]


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = [
            "id", "title_ky", "title_ru", "title_en",
            "description_ky", "description_ru", "description_en",
            "image", "value", "order",
        ]


class StudentFeedbackCreateSerializer(serializers.ModelSerializer):
    """For students submitting feedback (public endpoint)."""
    rating = serializers.IntegerField(min_value=1, max_value=5)

    class Meta:
        model = StudentFeedback
        fields = ["student_name", "phone", "email", "text", "rating", "course_taken"]


class StudentFeedbackListSerializer(serializers.ModelSerializer):
    """For displaying approved feedback publicly."""
    class Meta:
        model = StudentFeedback
        fields = ["id", "student_name", "text", "rating", "course_taken", "created_at"]
