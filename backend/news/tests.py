from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

from .models import NewsArticle


class NewsModelTest(TestCase):
    def test_create_article(self):
        article = NewsArticle.objects.create(
            title_ky="Жаңылык", title_ru="Новость",
            content_ky="Мазмун", content_ru="Содержание",
            category="promo",
        )
        self.assertEqual(str(article), "Новость")
        self.assertTrue(article.is_published)


class NewsAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        NewsArticle.objects.create(
            title_ky="Тест", title_ru="Тест",
            content_ky="X", content_ru="X", category="general"
        )
        NewsArticle.objects.create(
            title_ky="Hidden", title_ru="Hidden",
            content_ky="X", content_ru="X", is_published=False
        )

    def test_list_news(self):
        response = self.client.get("/api/news/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unpublished_hidden(self):
        response = self.client.get("/api/news/")
        data = response.json()
        results = data.get("results", data)
        titles = [a["title_ky"] for a in results]
        self.assertNotIn("Hidden", titles)

    def test_filter_by_category(self):
        NewsArticle.objects.create(
            title_ky="Promo", title_ru="Promo",
            content_ky="X", content_ru="X", category="promo"
        )
        response = self.client.get("/api/news/?category=promo")
        data = response.json()
        results = data.get("results", data)
        for article in results:
            self.assertEqual(article["category"], "promo")


class NewsAdminAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser("admin", "a@b.com", "pass123")
        self.client.force_authenticate(user=self.admin)

    def test_create_news(self):
        response = self.client.post("/api/admin/news/", {
            "title_ky": "Жаңы акция",
            "title_ru": "Новая акция",
            "content_ky": "Мазмун",
            "content_ru": "Содержание",
            "category": "promo",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_toggle_publish(self):
        article = NewsArticle.objects.create(
            title_ky="X", title_ru="X", content_ky="X", content_ru="X"
        )
        response = self.client.patch(f"/api/admin/news/{article.id}/", {
            "is_published": False,
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        article.refresh_from_db()
        self.assertFalse(article.is_published)
