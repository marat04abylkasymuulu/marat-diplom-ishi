from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

from .models import Achievement, Review, StudentFeedback


class ReviewModelTest(TestCase):
    def test_create_review(self):
        review = Review.objects.create(
            student_name="Алиев Нурлан", score=224, year=2025
        )
        self.assertIn("224", str(review))

    def test_ordering_by_score(self):
        Review.objects.create(student_name="A", score=200, year=2025)
        Review.objects.create(student_name="B", score=220, year=2025)
        first = Review.objects.first()
        self.assertEqual(first.score, 220)


class StudentFeedbackModelTest(TestCase):
    def test_default_status_pending(self):
        fb = StudentFeedback.objects.create(
            student_name="Test", text="Great!", rating=5
        )
        self.assertEqual(fb.status, "pending")


class ReviewAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        Review.objects.create(
            student_name="Test", score=210, year=2025,
            text_ky="Жакшы", is_featured=True
        )

    def test_list_reviews(self):
        response = self.client.get("/api/reviews/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_filter_featured(self):
        Review.objects.create(student_name="B", score=180, year=2024, is_featured=False)
        response = self.client.get("/api/reviews/?featured=true")
        data = response.json()
        results = data.get("results", data)
        self.assertEqual(len(results), 1)

    def test_list_achievements(self):
        Achievement.objects.create(
            title_ky="Жыл", title_ru="Лет", value="8+"
        )
        response = self.client.get("/api/achievements/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class StudentFeedbackAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_submit_feedback(self):
        response = self.client.post("/api/feedback/", {
            "student_name": "Тест Окуучу",
            "text": "Абдан жакшы борбор!",
            "rating": 5,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        fb = StudentFeedback.objects.first()
        self.assertEqual(fb.status, "pending")

    def test_only_approved_visible(self):
        StudentFeedback.objects.create(
            student_name="Pending", text="X", rating=4, status="pending"
        )
        StudentFeedback.objects.create(
            student_name="Approved", text="Y", rating=5, status="approved"
        )
        response = self.client.get("/api/feedback/")
        data = response.json()
        results = data.get("results", data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["student_name"], "Approved")


class FeedbackAdminAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser("admin", "a@b.com", "pass123")
        self.client.force_authenticate(user=self.admin)

    def test_approve_feedback(self):
        fb = StudentFeedback.objects.create(
            student_name="X", text="Good", rating=5, status="pending"
        )
        response = self.client.post(f"/api/admin/feedbacks/{fb.id}/approve/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        fb.refresh_from_db()
        self.assertEqual(fb.status, "approved")

    def test_reject_feedback(self):
        fb = StudentFeedback.objects.create(
            student_name="X", text="Bad", rating=1, status="pending"
        )
        response = self.client.post(f"/api/admin/feedbacks/{fb.id}/reject/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        fb.refresh_from_db()
        self.assertEqual(fb.status, "rejected")
