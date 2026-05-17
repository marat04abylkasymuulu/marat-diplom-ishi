from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Course, CourseCategory, Schedule
from .serializers import CourseCategorySerializer, CourseSerializer, ScheduleSerializer


class CourseCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CourseCategory.objects.all()
    serializer_class = CourseCategorySerializer
    permission_classes = [AllowAny]


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Course.objects.filter(is_active=True).select_related("category")
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category__slug=category)
        return qs


class ScheduleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Schedule.objects.select_related("course").filter(course__is_active=True)
    serializer_class = ScheduleSerializer
    permission_classes = [AllowAny]
