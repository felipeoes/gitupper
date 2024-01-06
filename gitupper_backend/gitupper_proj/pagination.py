from rest_framework import pagination
from rest_framework.response import Response

# add limit query param to PageNumberPagination
class CustomPagination(pagination.PageNumberPagination):
    page_size_query_param = 'limit'

    def get_paginated_response(self, data):
        return Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'page_results_count': len(data),
            'results': data
        })
