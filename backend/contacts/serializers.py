from rest_framework import serializers

from .models import Branch, ContactSubmission, SitePromo


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = [
            "id", "name_ky", "name_ru", "name_en",
            "address_ky", "address_ru", "address_en",
            "phone", "whatsapp", "instagram_url",
            "latitude", "longitude",
            "google_maps_embed_url", "two_gis_embed_url",
            "is_main",
        ]


class SitePromoPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = SitePromo
        fields = [
            "discount_ky", "discount_ru", "discount_en",
            "limited_ky", "limited_ru", "limited_en",
            "ticker_enabled",
        ]


class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ["id", "full_name", "phone", "message", "course_interest"]
