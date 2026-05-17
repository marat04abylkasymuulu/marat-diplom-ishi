from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    """Only allow staff/superuser access."""

    def has_permission(self, request, view):
        return request.user and request.user.is_staff
