from rest_framework import serializers

from .models import Teacher


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = [
            "id", "full_name_ky", "full_name_ru", "full_name_en",
            "bio_ky", "bio_ru", "bio_en",
            "subject_ky", "subject_ru", "subject_en",
            "photo", "experience_years",
        ]
