from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

from .models import Teacher


class TeacherModelTest(TestCase):
    def test_create_teacher(self):
        teacher = Teacher.objects.create(
            full_name_ky="Нишанов Шекербек",
            full_name_ru="Нишанов Шекербек",
            subject_ky="Математика",
            subject_ru="Математика",
            experience_years=8,
        )
        self.assertEqual(str(teacher), "Нишанов Шекербек")
        self.assertTrue(teacher.is_active)

    def test_default_ordering(self):
        Teacher.objects.create(
            full_name_ky="B", full_name_ru="B", subject_ky="X", subject_ru="X", order=2
        )
        Teacher.objects.create(
            full_name_ky="A", full_name_ru="A", subject_ky="Y", subject_ru="Y", order=1
        )
        teachers = Teacher.objects.all()
        self.assertEqual(teachers[0].full_name_ky, "A")


class TeacherAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        Teacher.objects.create(
            full_name_ky="Тест", full_name_ru="Тест",
            subject_ky="Мат", subject_ru="Мат", experience_years=5
        )

    def test_list_teachers(self):
        response = self.client.get("/api/teachers/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_inactive_teachers_hidden(self):
        Teacher.objects.create(
            full_name_ky="Hidden", full_name_ru="Hidden",
            subject_ky="X", subject_ru="X", is_active=False
        )
        response = self.client.get("/api/teachers/")
        data = response.json()
        results = data.get("results", data)
        names = [t["full_name_ky"] for t in results]
        self.assertNotIn("Hidden", names)


class TeacherAdminAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser("admin", "a@b.com", "pass123")
        self.client.force_authenticate(user=self.admin)

    def test_create_teacher(self):
        response = self.client.post("/api/admin/teachers/", {
            "full_name_ky": "Жаңы мугалим",
            "full_name_ru": "Новый учитель",
            "subject_ky": "Кыргыз тили",
            "subject_ru": "Кыргызский язык",
            "experience_years": 3,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_teacher(self):
        teacher = Teacher.objects.create(
            full_name_ky="X", full_name_ru="X", subject_ky="Y", subject_ru="Y"
        )
        response = self.client.patch(f"/api/admin/teachers/{teacher.id}/", {
            "experience_years": 10,
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        teacher.refresh_from_db()
        self.assertEqual(teacher.experience_years, 10)

    def test_non_staff_denied(self):
        user = User.objects.create_user("student", "s@b.com", "pass123")
        self.client.force_authenticate(user=user)
        response = self.client.get("/api/admin/teachers/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
