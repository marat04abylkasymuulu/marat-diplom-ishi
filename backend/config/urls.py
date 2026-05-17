from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from contacts.views import BranchViewSet, ContactSubmissionViewSet, resolve_map_link, site_promo_public
from courses.views import CourseCategoryViewSet, CourseViewSet, ScheduleViewSet
from news.views import NewsArticleViewSet
from reviews.views import AchievementViewSet, ReviewViewSet, StudentFeedbackViewSet
from teachers.views import TeacherViewSet

router = DefaultRouter()
router.register(r"courses", CourseViewSet, basename="course")
router.register(r"categories", CourseCategoryViewSet, basename="category")
router.register(r"schedule", ScheduleViewSet, basename="schedule")
router.register(r"teachers", TeacherViewSet, basename="teacher")
router.register(r"reviews", ReviewViewSet, basename="review")
router.register(r"achievements", AchievementViewSet, basename="achievement")
router.register(r"news", NewsArticleViewSet, basename="news")
router.register(r"branches", BranchViewSet, basename="branch")
router.register(r"contact", ContactSubmissionViewSet, basename="contact")
router.register(r"feedback", StudentFeedbackViewSet, basename="feedback")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/site-promo/", site_promo_public),
    path("api/resolve-map-link/", resolve_map_link),
    path("api/", include(router.urls)),
    path("api/admin/", include("admin_api.urls")),
]

# Serve media files in both dev and production (for single-server setups)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
