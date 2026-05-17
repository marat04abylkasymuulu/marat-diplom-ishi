from rest_framework import serializers

from .models import NewsArticle


class NewsArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsArticle
        fields = [
            "id", "title_ky", "title_ru", "title_en",
            "content_ky", "content_ru", "content_en",
            "category", "image", "is_published", "published_at",
        ]
