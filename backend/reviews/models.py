from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Review(models.Model):
    """Admin-managed reviews (verified, published)."""
    student_name = models.CharField(max_length=200)
    text_ky = models.TextField(blank=True)
    text_ru = models.TextField(blank=True)
    text_en = models.TextField(blank=True)
    score = models.PositiveIntegerField(help_text="ЖРТ/ОРТ score achieved")
    video_url = models.URLField(blank=True)
    photo = models.ImageField(upload_to="reviews/", blank=True)
    year = models.PositiveIntegerField()
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-year", "-score"]

    def __str__(self):
        return f"{self.student_name} - {self.score} балл"


class StudentFeedback(models.Model):
    """Public feedback submitted by students (requires admin approval)."""
    STATUS_CHOICES = [
        ("pending", "Күтүүдө / Pending"),
        ("approved", "Жарыяланды / Approved"),
        ("rejected", "Четке кагылды / Rejected"),
    ]

    student_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    text = models.TextField()
    rating = models.PositiveIntegerField(
        default=5,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="1-5 stars",
    )
    course_taken = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    admin_notes = models.TextField(blank=True, help_text="Internal notes, not shown publicly")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Student Feedback"
        verbose_name_plural = "Student Feedbacks"

    def __str__(self):
        return f"{self.student_name} ({self.get_status_display()})"


class Achievement(models.Model):
    title_ky = models.CharField(max_length=200)
    title_ru = models.CharField(max_length=200)
    title_en = models.CharField(max_length=200, blank=True)
    description_ky = models.TextField(blank=True)
    description_ru = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    image = models.ImageField(upload_to="achievements/", blank=True)
    value = models.CharField(max_length=50, help_text="e.g. '200+', '8+', '50'")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title_ru
