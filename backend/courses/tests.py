from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

from .models import Course, CourseCategory, Schedule


class CourseCategoryModelTest(TestCase):
    def test_create_category(self):
        cat = CourseCategory.objects.create(
            name_ky="ЖРТ Математика", name_ru="ОРТ Математика", slug="math"
        )
        self.assertEqual(str(cat), "ОРТ Математика")
        self.assertEqual(cat.slug, "math")


class CourseModelTest(TestCase):
    def setUp(self):
        self.category = CourseCategory.objects.create(
            name_ky="Тест", name_ru="Тест", slug="test"
        )

    def test_create_course(self):
        course = Course.objects.create(
            category=self.category,
            title_ky="Математика курсу",
            title_ru="Курс математики",
            duration="3 ай",
            price=5000,
        )
        self.assertEqual(str(course), "Курс математики")
        self.assertTrue(course.is_active)

    def test_course_ordering(self):
        Course.objects.create(
            category=self.category, title_ky="A", title_ru="A", duration="1", price=100
        )
        Course.objects.create(
            category=self.category, title_ky="B", title_ru="B", duration="1", price=200
        )
        courses = Course.objects.all()
        self.assertEqual(courses.count(), 2)


class CourseAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = CourseCategory.objects.create(
            name_ky="Математика", name_ru="Математика", slug="math"
        )
        self.course = Course.objects.create(
            category=self.category,
            title_ky="ЖРТ Мат",
            title_ru="ОРТ Мат",
            duration="3 ай",
            price=5000,
        )

    def test_list_courses(self):
        response = self.client.get("/api/courses/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_filter_courses_by_category(self):
        response = self.client.get("/api/courses/?category=math")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_categories(self):
        response = self.client.get("/api/categories/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_schedule_list(self):
        Schedule.objects.create(
            course=self.course, day="mon", start_time="09:00", end_time="11:00"
        )
        response = self.client.get("/api/schedule/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class CourseAdminAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser("admin", "a@b.com", "pass123")
        self.client.force_authenticate(user=self.admin)
        self.category = CourseCategory.objects.create(
            name_ky="Тест", name_ru="Тест", slug="test"
        )

    def test_create_course(self):
        response = self.client.post("/api/admin/courses/", {
            "title_ky": "Жаңы курс",
            "title_ru": "Новый курс",
            "category": self.category.id,
            "duration": "2 ай",
            "price": "3000",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_course(self):
        course = Course.objects.create(
            category=self.category, title_ky="X", title_ru="X", duration="1", price=100
        )
        response = self.client.patch(f"/api/admin/courses/{course.id}/", {
            "price": "2000",
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        course.refresh_from_db()
        self.assertEqual(course.price, 2000)

    def test_delete_course(self):
        course = Course.objects.create(
            category=self.category, title_ky="X", title_ru="X", duration="1", price=100
        )
        response = self.client.delete(f"/api/admin/courses/{course.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_unauthenticated_access_denied(self):
        self.client.force_authenticate(user=None)
        response = self.client.get("/api/admin/courses/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_category(self):
        response = self.client.post("/api/admin/categories/", {
            "name_ky": "Интенсив",
            "name_ru": "Интенсив",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(CourseCategory.objects.filter(name_ky="Интенсив").exists())
