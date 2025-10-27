from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.files.base import ContentFile
from django.views import View
from django.http import HttpResponse
from datetime import datetime
from django.db.models import Q, Sum, F, FloatField
from django.db.models.functions import ExtractMonth
from django.utils import timezone
from datetime import timedelta
import calendar
from calendar import month_name


from .models import Invoice, InvoiceItem
from .serializers import InvoiceSerializer
from .utils.pdf_generator import generate_invoice_pdf
from common.permissions import IsOwnerOrReadOnly
# Create your views here.

# =======================
#  Invoice CRUD ViewSet
# =======================

class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        #return Invoice.objects.filter(user=self.request.user).order_by('-created_at')
        user = self.request.user
        queryset = Invoice.objects.filter(user=user).order_by('-created_at')

        today = timezone.now().date()
        queryset.filter(status="pending", due_date__lt=today).update(status="overdue")

        # --- Search by client name or email ---
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(client_name__icontains=search) |
                Q(client_email__icontains=search)
            )

        # --- Filter by paid status (boolean) ---
        status = self.request.query_params.get('status')
        if status in ['pending', 'paid', 'overdue']:
            queryset = queryset.filter(status=status)

        #due_date = self.request.query_params.get('due_date')
        #if duedate:
        #    queryset = queryset.filter(status=status)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def dashboard_stats(self,request):
        try:
            # Filter only user's invoices
            invoices = Invoice.objects.filter(user=request.user).order_by('-created_at')

            # Basic stats
            total_invoices = invoices.count()
            paid_invoices = invoices.filter(status="paid").count()
            pending_invoices = invoices.filter(status="pending").count()
            overdue_invoices = invoices.filter(status="overdue").count()

            # Monthly income — sum of (quantity * unit_price) for paid invoices
            monthly_income = (
                InvoiceItem.objects
                .filter(invoice__user=request.user, invoice__status="paid")
                .annotate(month=ExtractMonth("invoice__created_at"))
                .values("month")
                .annotate(total=Sum(F("quantity") * F("unit_price"), output_field=FloatField()))
                .order_by("month")
            )
            monthly_income = [{
                "month": calendar.month_abbr[item["month"]],
                "total": item["total"]
                }
                for item in monthly_income]


            return Response({
                "total_invoices": total_invoices,
                "paid_invoices": paid_invoices,
                "pending_invoices": pending_invoices,
                "overdue_invoices": overdue_invoices,
                "monthly_income": monthly_income,
                "recent_invoices": InvoiceSerializer(invoices[:3], many=True).data
            })

        except Exception as e:
            print("Dashboard Stats Error:", e)
            return Response({"error": str(e)}, status=500)


    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        invoice = self.get_object()
        try:
            exist = Invoice.objects.get(invoice_number=invoice.invoice_number)
        except Invoice.DoesNotExist:
            exist = False
        if exist:
            return Response({'status': 'Existing PDF found', 'pdf_url': exist.pdf.url})
            
        invoice_data = {
            "id": invoice.invoice_number,
            "client_name": invoice.client_name,
            "client_email": invoice.client_email,
            "created_at": invoice.created_at,
            "items": [
                {
                    "description": item.description,
                    "quantity": item.quantity,
                    "unit_price": item.unit_price,
                    "total": item.line_total
                }
                for item in invoice.items.all()
            ],
            "total_amount": invoice.total
        }
        
        pdf_bytes = generate_invoice_pdf(invoice_data)
        if pdf_bytes:
            invoice.pdf.save(f"{invoice.invoice_number}.pdf", ContentFile(pdf_bytes))
            invoice.save()
            return Response({'status': 'PDF generated', 'pdf_url': invoice.pdf.url})
        return Response({'error': 'Failed to generate PDF'}, status=500)

    
# =======================
#  Test PDF Generator
# =======================

class InvoicePDFView(View):
    def get(self, request, *args, **kwargs):
        # Normally, you'd fetch this from DB:
        invoice_data = {
            "id": 101,
            "client_name": "John Doe",
            "client_email": "john@example.com",
            "created_at": datetime.now(),
            "items": [
                {"description": "Logo Design", "quantity": 1, "unit_price": 200, "total": 200},
                {"description": "Website Setup", "quantity": 1, "unit_price": 300, "total": 300}
            ],
            "total_amount": 500
        }

        return generate_invoice_pdf(invoice_data)