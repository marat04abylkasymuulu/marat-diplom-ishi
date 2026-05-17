from django.contrib import admin

from .models import Achievement, Review, StudentFeedback


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ["student_name", "score", "year", "is_featured"]
    list_filter = ["year", "is_featured"]
    search_fields = ["student_name"]
    list_editable = ["is_featured"]


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ["title_ru", "value", "order"]
    list_editable = ["order", "value"]


@admin.register(StudentFeedback)
class StudentFeedbackAdmin(admin.ModelAdmin):
    list_display = ["student_name", "rating_stars", "course_taken", "status", "created_at"]
    list_filter = ["status", "rating", "created_at"]
    list_editable = ["status"]
    search_fields = ["student_name", "text"]
    readonly_fields = ["created_at"]
    actions = ["approve_feedbacks", "reject_feedbacks"]
    fieldsets = (
        ("Student Info", {
            "fields": ("student_name", "phone", "email", "course_taken"),
        }),
        ("Feedback", {
            "fields": ("text", "rating", "created_at"),
        }),
        ("Moderation", {
            "fields": ("status", "admin_notes"),
        }),
    )

    @admin.display(description="Rating")
    def rating_stars(self, obj):
        return "⭐" * obj.rating

    @admin.action(description="Approve selected feedbacks")
    def approve_feedbacks(self, request, queryset):
        updated = queryset.update(status="approved")
        self.message_user(request, f"{updated} feedback(s) approved.")

    @admin.action(description="Reject selected feedbacks")
    def reject_feedbacks(self, request, queryset):
        updated = queryset.update(status="rejected")
        self.message_user(request, f"{updated} feedback(s) rejected.")
