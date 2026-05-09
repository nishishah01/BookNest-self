from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(["GET"])
def getRoutes(request):
    routes = [
        "base/token",
        "base/token/refresh",
    ]
    return Response(routes)
