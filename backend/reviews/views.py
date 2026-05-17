import logging

from django.conf import settings
from django.core.mail import send_mail
from rest_framework import mixins, status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Achievement, Review, StudentFeedback
from .serializers import (
    AchievementSerializer,
    ReviewSerializer,
    StudentFeedbackCreateSerializer,
    StudentFeedbackListSerializer,
)

logger = logging.getLogger("record")


class ReviewViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Review.objects.all()
        featured = self.request.query_params.get("featured")
        if featured == "true":
            qs = qs.filter(is_featured=True)
        return qs


class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [AllowAny]


class StudentFeedbackViewSet(
    mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    permission_classes = [AllowAny]

    def get_queryset(self):
        return StudentFeedback.objects.filter(status="approved")

    def get_serializer_class(self):
        if self.action == "create":
            return StudentFeedbackCreateSerializer
        return StudentFeedbackListSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        feedback = serializer.save()

        self._notify_admin(feedback)

        return Response(
            {"message": "Feedback submitted successfully. It will appear after moderation."},
            status=status.HTTP_201_CREATED,
        )

    def _notify_admin(self, feedback):
        subject = "Жаңы отзыв алынды"
        message = (
            f"Жаңы отзыв алынды!\n\n"
            f"Окуучу: {feedback.student_name}\n"
            f"Рейтинг: {'⭐' * feedback.rating}\n"
            f"Курс: {feedback.course_taken or 'Көрсөтүлгөн эмес'}\n"
            f"Текст: {feedback.text}\n"
        )
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.ADMIN_EMAIL],
                fail_silently=False,
            )
        except Exception:
            logger.exception("Failed to send feedback notification email")
