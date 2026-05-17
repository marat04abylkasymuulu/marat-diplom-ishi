from django.db import models


class Teacher(models.Model):
    full_name_ky = models.CharField(max_length=200)
    full_name_ru = models.CharField(max_length=200)
    full_name_en = models.CharField(max_length=200, blank=True)
    bio_ky = models.TextField(blank=True)
    bio_ru = models.TextField(blank=True)
    bio_en = models.TextField(blank=True)
    subject_ky = models.CharField(max_length=100)
    subject_ru = models.CharField(max_length=100)
    subject_en = models.CharField(max_length=100, blank=True)
    photo = models.ImageField(upload_to="teachers/", blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "full_name_ru"]

    def __str__(self):
        return self.full_name_ru
