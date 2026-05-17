from django.contrib.auth.models import User
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from contacts.models import Branch, ContactSubmission, SitePromo
from courses.models import Course, CourseCategory, Schedule
from news.models import NewsArticle
from reviews.models import Achievement, Review, StudentFeedback
from teachers.models import Teacher

from .permissions import IsAdminUser
from .serializers import (
    AchievementAdminSerializer,
    BranchAdminSerializer,
    ContactSubmissionAdminSerializer,
    CourseAdminSerializer,
    CourseCategoryAdminSerializer,
    NewsArticleAdminSerializer,
    ReviewAdminSerializer,
    ScheduleAdminSerializer,
    SitePromoAdminSerializer,
    StudentFeedbackAdminSerializer,
    TeacherAdminSerializer,
    UserSerializer,
)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminUser])
def dashboard_stats(request):
    """Overview statistics for the admin dashboard."""
    return Response({
        "courses_count": Course.objects.filter(is_active=True).count(),
        "teachers_count": Teacher.objects.filter(is_active=True).count(),
        "pending_feedbacks": StudentFeedback.objects.filter(status="pending").count(),
        "unprocessed_contacts": ContactSubmission.objects.filter(is_processed=False).count(),
        "total_reviews": Review.objects.count(),
        "news_count": NewsArticle.objects.filter(is_published=True).count(),
        "recent_contacts": ContactSubmissionAdminSerializer(
            ContactSubmission.objects.filter(is_processed=False)[:5], many=True
        ).data,
        "recent_feedbacks": StudentFeedbackAdminSerializer(
            StudentFeedback.objects.filter(status="pending")[:5], many=True
        ).data,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminUser])
def current_user(request):
    """Get current logged-in user info."""
    return Response(UserSerializer(request.user).data)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated, IsAdminUser])
def site_promo_admin(request):
    """Singleton home ticker: GET current values, PATCH partial update."""
    row, _ = SitePromo.objects.get_or_create(pk=1)
    if request.method == "GET":
        return Response(SitePromoAdminSerializer(row).data)
    serializer = SitePromoAdminSerializer(row, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


class CourseCategoryAdminViewSet(viewsets.ModelViewSet):
    queryset = CourseCategory.objects.all()
    serializer_class = CourseCategoryAdminSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class CourseAdminViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.select_related("category").all()
    serializer_class = CourseAdminSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class ScheduleAdminViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.select_related("course").all()
    serializer_class = ScheduleAdminSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class TeacherAdminViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherAdminSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class ReviewAdminViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewAdminSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class StudentFeedbackAdminViewSet(viewsets.ModelViewSet):
    queryset = StudentFeedback.objects.all()
    serializer_class = StudentFeedbackAdminSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        feedback = self.get_object()
        feedback.status = "approved"
        feedback.save()
        return Response({"status": "approved"})

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        feedback = self.get_object()
        feedback.status = "rejected"
        feedback.save()
        return Response({"status": "rejected"})


class AchievementAdminViewSet(viewsets.ModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementAdminSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class NewsArticleAdminViewSet(viewsets.ModelViewSet):
    queryset = NewsArticle.objects.all()
    serializer_class = NewsArticleAdminSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class BranchAdminViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchAdminSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class ContactSubmissionAdminViewSet(viewsets.ModelViewSet):
    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionAdminSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    @action(detail=True, methods=["post"])
    def mark_processed(self, request, pk=None):
        submission = self.get_object()
        submission.is_processed = True
        submission.save()
        return Response({"status": "processed"})
