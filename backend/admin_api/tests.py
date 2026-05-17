from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from contacts.models import SitePromo


class JWTAuthFlowTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser("admin", "a@b.com", "TestPass123!")
        self.user = User.objects.create_user("student", "s@b.com", "TestPass123!")

    def test_obtain_token(self):
        response = self.client.post("/api/admin/token/", {
            "username": "admin",
            "password": "TestPass123!",
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_obtain_token_wrong_password(self):
        response = self.client.post("/api/admin/token/", {
            "username": "admin",
            "password": "wrong",
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_token(self):
        login = self.client.post("/api/admin/token/", {
            "username": "admin",
            "password": "TestPass123!",
        })
        refresh = login.data["refresh"]
        response = self.client.post("/api/admin/token/refresh/", {
            "refresh": refresh,
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_access_with_token(self):
        login = self.client.post("/api/admin/token/", {
            "username": "admin",
            "password": "TestPass123!",
        })
        token = login.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        response = self.client.get("/api/admin/me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "admin")

    def test_access_without_token(self):
        response = self.client.get("/api/admin/me/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_non_staff_user_forbidden(self):
        login = self.client.post("/api/admin/token/", {
            "username": "student",
            "password": "TestPass123!",
        })
        token = login.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        response = self.client.get("/api/admin/dashboard/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_dashboard_stats(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/admin/dashboard/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("courses_count", response.data)
        self.assertIn("teachers_count", response.data)
        self.assertIn("pending_feedbacks", response.data)


class SitePromoAdminAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser("spromo", "sp@b.com", "TestPass123!")
        self.client.force_authenticate(user=self.admin)

    def test_get_and_patch_site_promo(self):
        r = self.client.get("/api/admin/site-promo/")
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertIn("ticker_enabled", r.data)

        r2 = self.client.patch("/api/admin/site-promo/", {
            "discount_ru": "Скидка 15%",
            "ticker_enabled": True,
        })
        self.assertEqual(r2.status_code, status.HTTP_200_OK)
        self.assertEqual(r2.data.get("discount_ru"), "Скидка 15%")
        row = SitePromo.objects.get(pk=1)
        self.assertEqual(row.discount_ru, "Скидка 15%")


class RatingValidationTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_rating_above_5_rejected(self):
        response = self.client.post("/api/feedback/", {
            "student_name": "Test",
            "text": "Good!",
            "rating": 10,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_rating_zero_rejected(self):
        response = self.client.post("/api/feedback/", {
            "student_name": "Test",
            "text": "Bad!",
            "rating": 0,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_valid_rating_accepted(self):
        response = self.client.post("/api/feedback/", {
            "student_name": "Test",
            "text": "Great!",
            "rating": 4,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
