from django.db import models
import uuid
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

# Create your models here.

STATUS_CHOICES = [
    ("pending", "Pending"),
    ("paid", "Paid"),
    ("overdue", "Overdue"),
]

def default_due_date():
    return timezone.now().date() + timedelta(days=1)

class Invoice(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='invoices')
    invoice_number = models.CharField(max_length=50, unique=True, editable=False)
    client_name = models.CharField(max_length=255)
    client_email = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField(default=default_due_date, null=True, blank=True)
    tax = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    pdf = models.FileField(upload_to='invoices/', null=True, blank=True)
    
    def __str__(self):
        return f"{self.invoice_number} - {self.client_name}"
    
    def save(self, *args, **kwargs):
        if not self.invoice_number:
            # You can use date, user id, or random token — customize as you like
            self.invoice_number = f"INV-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=512)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.description} - {self.quantity} x {self.unit_price}"
    
    @property
    def line_total(self):
        return self.quantity * self.unit_price