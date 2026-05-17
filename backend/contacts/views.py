import logging

from django.conf import settings
from django.core.mail import send_mail
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .map_resolve import MapResolveError, resolve_map_share_url
from .models import Branch, ContactSubmission, SitePromo
from .serializers import BranchSerializer, ContactSubmissionSerializer, SitePromoPublicSerializer

logger = logging.getLogger("record")


@api_view(["GET"])
@permission_classes([AllowAny])
def site_promo_public(request):
    """Public read for home page ticker overrides (singleton pk=1)."""
    row = SitePromo.objects.filter(pk=1).first()
    if not row:
        return Response(
            {
                "discount_ky": "",
                "discount_ru": "",
                "discount_en": "",
                "limited_ky": "",
                "limited_ru": "",
                "limited_en": "",
                "ticker_enabled": True,
            }
        )
    return Response(SitePromoPublicSerializer(row).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def resolve_map_link(request):
    """
    Resolve a Google / 2GIS share URL to latitude & longitude (JSON).

    Used when admins paste short links instead of iframe embed src.
    """
    url = (request.query_params.get("url") or "").strip()
    if not url:
        return Response({"detail": "Query parameter url is required"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        payload = resolve_map_share_url(url)
        return Response(payload)
    except MapResolveError as exc:
        return Response({"detail": str(exc)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class BranchViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [AllowAny]


class ContactSubmissionViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        submission = serializer.save()

        self._send_notification_email(submission)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def _send_notification_email(self, submission):
        subject = "Жаңы кайрылуу алынды"
        message = (
            f"Жаңы кайрылуу алынды!\n\n"
            f"Аты-жөнү: {submission.full_name}\n"
            f"Телефон: {submission.phone}\n"
            f"Курс: {submission.course_interest or 'Көрсөтүлгөн эмес'}\n"
            f"Билдирүү: {submission.message or 'Жок'}\n\n"
            f"Убакыт: {submission.created_at}\n"
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
            logger.exception("Failed to send contact notification email")
