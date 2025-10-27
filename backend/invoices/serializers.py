from rest_framework import serializers
from .models import Invoice, InvoiceItem

class InvoiceItemSerializer(serializers.ModelSerializer):
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = InvoiceItem
        fields = ['id', 'description', 'quantity', 'unit_price', 'line_total']

    def get_line_total(self, obj):
        return obj.line_total
    
class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Invoice
        fields = ['id', 'user', 'invoice_number', 'client_name', 'client_email', 'created_at', 'due_date', 'tax', 'total', 'status', 'pdf', 'items']
        read_only_fields = ['id', 'created_at', 'total', 'pdf']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        user = self.context['request'].user
        validated_data['user'] = user

        # generate invoice_number (simple auto scheme)
        #validated_data['invoice_number'] = validated_data.get('invoice_number') or f"INV-{user.id}-{Invoice.objects.count() + 1}"

        invoice = Invoice.objects.create(**validated_data)
        total = 0
        for item_data in items_data:
            item = InvoiceItem.objects.create(invoice=invoice, **item_data)
            total += item.line_total
        invoice.total = total + (total * (invoice.tax or 0) / 100)
        invoice.save()
        return invoice
    
    def update(self, instance, validated_data):
        # very basic update implementation
        items_data = validated_data.pop('items', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if items_data is not None:
            instance.items.all().delete()
            total = 0
            for item_data in items_data:
                item = InvoiceItem.objects.create(invoice=instance, **item_data)
                total += item.line_total
            instance.total = total + (total * (instance.tax or 0) / 100)
            instance.save()

        return instance
    