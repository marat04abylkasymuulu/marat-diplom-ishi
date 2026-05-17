from django.db import models


class SitePromo(models.Model):
    """Singleton row (pk=1): home page kinetic ticker text overrides."""

    discount_ky = models.CharField(max_length=220, blank=True)
    discount_ru = models.CharField(max_length=220, blank=True)
    discount_en = models.CharField(max_length=220, blank=True)
    limited_ky = models.CharField(max_length=220, blank=True)
    limited_ru = models.CharField(max_length=220, blank=True)
    limited_en = models.CharField(max_length=220, blank=True)
    ticker_enabled = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site promo (home ticker)"
        verbose_name_plural = "Site promo (home ticker)"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def __str__(self):
        return "Home ticker / promo"


class Branch(models.Model):
    name_ky = models.CharField(max_length=200)
    name_ru = models.CharField(max_length=200)
    name_en = models.CharField(max_length=200, blank=True)
    address_ky = models.TextField()
    address_ru = models.TextField()
    address_en = models.TextField(blank=True)
    phone = models.CharField(max_length=20)
    whatsapp = models.CharField(max_length=20)
    instagram_url = models.URLField(blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    google_maps_embed_url = models.TextField(
        blank=True,
        help_text="Google Maps → Share → Embed a map → copy the iframe src URL",
    )
    two_gis_embed_url = models.TextField(
        blank=True,
        help_text="2GIS widget/embed: copy the iframe src URL",
    )
    is_main = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Branches"

    def __str__(self):
        return self.name_ru


class ContactSubmission(models.Model):
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    message = models.TextField(blank=True)
    course_interest = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_processed = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} - {self.phone}"
