from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    AchievementAdminViewSet,
    BranchAdminViewSet,
    ContactSubmissionAdminViewSet,
    CourseAdminViewSet,
    CourseCategoryAdminViewSet,
    NewsArticleAdminViewSet,
    ReviewAdminViewSet,
    ScheduleAdminViewSet,
    StudentFeedbackAdminViewSet,
    TeacherAdminViewSet,
    current_user,
    dashboard_stats,
    site_promo_admin,
)

router = DefaultRouter()
router.register(r"courses", CourseAdminViewSet, basename="admin-course")
router.register(r"categories", CourseCategoryAdminViewSet, basename="admin-category")
router.register(r"schedule", ScheduleAdminViewSet, basename="admin-schedule")
router.register(r"teachers", TeacherAdminViewSet, basename="admin-teacher")
router.register(r"reviews", ReviewAdminViewSet, basename="admin-review")
router.register(r"feedbacks", StudentFeedbackAdminViewSet, basename="admin-feedback")
router.register(r"achievements", AchievementAdminViewSet, basename="admin-achievement")
router.register(r"news", NewsArticleAdminViewSet, basename="admin-news")
router.register(r"branches", BranchAdminViewSet, basename="admin-branch")
router.register(r"contacts", ContactSubmissionAdminViewSet, basename="admin-contact")

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", current_user, name="current_user"),
    path("dashboard/", dashboard_stats, name="dashboard_stats"),
    path("site-promo/", site_promo_admin, name="site_promo_admin"),
    path("", include(router.urls)),
]
