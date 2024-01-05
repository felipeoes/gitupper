# Create permissions

from rest_framework.permissions import BasePermission

class IsAccountOwner(BasePermission):
    """Custom permission class to allow only object owners to edit them."""

    def has_object_permission(self, request, view, obj):
        """Return True if permission is granted to the object owner."""
        return obj.gitupper_id == request.user.gitupper_id
