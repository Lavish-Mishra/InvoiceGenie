# common/middleware.py
class DisableCSPMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        # Remove CSP header if present
        if "Content-Security-Policy" in response:
            del response["Content-Security-Policy"]
        return response
