from django.contrib import admin

from .models import NewsArticle


@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ["title_ru", "category", "is_published", "published_at"]
    list_filter = ["category", "is_published"]
    search_fields = ["title_ru", "title_ky"]
