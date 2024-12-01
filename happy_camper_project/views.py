from django.http import JsonResponse, HttpResponse
from django.middleware.csrf import get_token
from django.views.decorators.http import require_GET
from django.views.decorators.csrf import ensure_csrf_cookie
from django.shortcuts import render
from django.conf import settings
import os
from django.views.generic import TemplateView

@require_GET
@ensure_csrf_cookie
def get_csrf_token(request):
    """
    This view will set a CSRF cookie and return the token.
    The @ensure_csrf_cookie decorator ensures the cookie is set.
    """
    return JsonResponse({'csrfToken': get_token(request)})

def frontend(request, path=''):
    """
    Serve the frontend application.
    """
    try:
        with open(os.path.join(settings.BASE_DIR, 'frontend', 'build', 'index.html')) as f:
            return HttpResponse(f.read())
    except FileNotFoundError:
        return HttpResponse(
            """
            Frontend not built yet. Please run:
            cd frontend && npm install && npm run build
            """,
            status=501,
        )

class FrontendView(TemplateView):
    template_name = "index.html"

frontend_view = FrontendView.as_view()
