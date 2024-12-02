from django.core.cache import cache
from django.http import HttpResponseTooManyRequests
import time

class CustomRateLimitMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # Default rate limits (can be overridden in settings)
        self.rate_limits = {
            'POST': {'calls': 100, 'period': 3600},  # 100 POST requests per hour
            'GET': {'calls': 1000, 'period': 3600},  # 1000 GET requests per hour
        }

    def __call__(self, request):
        if not self._should_rate_limit(request):
            return self.get_response(request)

        key = self._get_cache_key(request)
        now = time.time()
        
        # Get the request history for this IP
        request_history = cache.get(key, [])
        
        # Clean old requests from history
        method_limits = self.rate_limits.get(request.method, self.rate_limits['GET'])
        request_history = [ts for ts in request_history 
                         if now - ts < method_limits['period']]

        if len(request_history) >= method_limits['calls']:
            return HttpResponseTooManyRequests(
                "Rate limit exceeded. Please try again later.",
                content_type="text/plain"
            )

        # Add current request timestamp
        request_history.append(now)
        cache.set(key, request_history, method_limits['period'])

        return self.get_response(request)

    def _should_rate_limit(self, request):
        """Determine if the request should be rate limited."""
        # Don't rate limit admin or internal IPs
        if request.path.startswith('/admin/'):
            return False
        if request.META.get('REMOTE_ADDR') in ['127.0.0.1', 'localhost']:
            return False
        return True

    def _get_cache_key(self, request):
        """Generate a cache key based on IP and method."""
        ip = request.META.get('HTTP_X_FORWARDED_FOR', 
                            request.META.get('REMOTE_ADDR'))
        return f"rate_limit:{ip}:{request.method}"
