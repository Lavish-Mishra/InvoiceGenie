from rest_framework.routers import DefaultRouter
from .views import InvoiceViewSet, InvoicePDFView
from django.urls import path, include

router =DefaultRouter()
router.register(r'', InvoiceViewSet, basename='invoice')

urlpatterns = [
    path('',include(router.urls)),
    path('<int:pk>/pdf/', InvoicePDFView.as_view(), name='invoice-pdf'),
]