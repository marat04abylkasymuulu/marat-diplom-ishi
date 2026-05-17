from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

from .models import Branch, ContactSubmission


class BranchModelTest(TestCase):
    def test_create_branch(self):
        branch = Branch.objects.create(
            name_ky="Рекорд Ош", name_ru="Рекорд Ош",
            address_ky="Ош шаары", address_ru="г. Ош",
            phone="+996555000000", whatsapp="+996555000000",
            is_main=True,
        )
        self.assertEqual(str(branch), "Рекорд Ош")
        self.assertTrue(branch.is_main)


class ContactSubmissionModelTest(TestCase):
    def test_create_submission(self):
        sub = ContactSubmission.objects.create(
            full_name="Тест Окуучу", phone="+996700123456"
        )
        self.assertFalse(sub.is_processed)
        self.assertIn("Тест", str(sub))


class SitePromoPublicAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_site_promo_public_ok(self):
        response = self.client.get("/api/site-promo/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn("ticker_enabled", data)
        self.assertIn("discount_ky", data)


class BranchMapFieldsAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_branch_list_includes_map_embed_fields(self):
        Branch.objects.create(
            name_ky="Тест", name_ru="Тест",
            address_ky="А", address_ru="А",
            phone="1", whatsapp="1",
            google_maps_embed_url="https://www.google.com/maps/embed?pb=1",
            two_gis_embed_url="",
        )
        response = self.client.get("/api/branches/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = response.json()
        rows = payload.get("results", payload)
        self.assertTrue(any(r.get("google_maps_embed_url") for r in rows))


class ResolveMapLinkAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_resolve_missing_url(self):
        r = self.client.get("/api/resolve-map-link/")
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_resolve_rejects_disallowed_host(self):
        r = self.client.get("/api/resolve-map-link/", {"url": "https://example.com/map"})
        self.assertEqual(r.status_code, status.HTTP_422_UNPROCESSABLE_ENTITY)

    def test_resolve_google_maps_at_url_without_fetch(self):
        url = "https://www.google.com/maps/@47.4831427,19.0848337,6340m/data=!3m1!1e3"
        r = self.client.get("/api/resolve-map-link/", {"url": url})
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        data = r.json()
        self.assertAlmostEqual(data["latitude"], 47.4831427, places=4)
        self.assertAlmostEqual(data["longitude"], 19.0848337, places=4)


class ContactAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        Branch.objects.create(
            name_ky="Ош", name_ru="Ош", address_ky="X", address_ru="X",
            phone="123", whatsapp="123"
        )

    def test_list_branches(self):
        response = self.client.get("/api/branches/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_submit_contact(self):
        response = self.client.post("/api/contact/", {
            "full_name": "Айбек",
            "phone": "+996555111222",
            "course_interest": "Математика",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactSubmission.objects.count(), 1)

    def test_submit_contact_validation(self):
        response = self.client.post("/api/contact/", {
            "full_name": "",
            "phone": "",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ContactAdminAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser("admin", "a@b.com", "pass123")
        self.client.force_authenticate(user=self.admin)

    def test_mark_processed(self):
        sub = ContactSubmission.objects.create(
            full_name="Test", phone="123"
        )
        response = self.client.post(f"/api/admin/contacts/{sub.id}/mark_processed/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        sub.refresh_from_db()
        self.assertTrue(sub.is_processed)

    def test_list_all_contacts(self):
        ContactSubmission.objects.create(full_name="A", phone="1")
        ContactSubmission.objects.create(full_name="B", phone="2")
        response = self.client.get("/api/admin/contacts/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
