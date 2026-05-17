from django.db import models


class NewsArticle(models.Model):
    CATEGORY_CHOICES = [
        ("promo", "Акция / Promotion"),
        ("course", "Жаңы курс / New Course"),
        ("exam", "ЖРТ жаңылыктары / Exam News"),
        ("general", "Жалпы / General"),
    ]

    title_ky = models.CharField(max_length=300)
    title_ru = models.CharField(max_length=300)
    title_en = models.CharField(max_length=300, blank=True)
    content_ky = models.TextField()
    content_ru = models.TextField()
    content_en = models.TextField(blank=True)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default="general")
    image = models.ImageField(upload_to="news/", blank=True)
    is_published = models.BooleanField(default=True)
    published_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-published_at"]
        verbose_name_plural = "News Articles"

    def __str__(self):
        return self.title_ru
