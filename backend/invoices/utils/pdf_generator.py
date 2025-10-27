from io import BytesIO
from django.template.loader import get_template
from xhtml2pdf import pisa

def generate_invoice_pdf(invoice_data):
    """
    Generate a PDF from invoice data using xhtml2pdf.

    Args:
        invoice_data (dict): Invoice details including client info and items.

    Returns:
        bytes | None: PDF file content in bytes if successful, otherwise None.
    """
    template_path = "invoices/pdf_template.html"
    context = {"invoice": invoice_data}

    # Load and render HTML template
    template = get_template(template_path)
    html = template.render(context)

    # Create a BytesIO buffer to receive PDF data
    pdf_buffer = BytesIO()

    # Convert the HTML to PDF
    pisa_status = pisa.CreatePDF(src=html, dest=pdf_buffer)

    # We will handle PDF generation errors in views
    if pisa_status.err:
        return None
    # Returns PDF in Bytes form
    return pdf_buffer.getvalue()