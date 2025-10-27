// src/pages/ViewInvoice.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const ViewInvoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/invoices/${id}/`).then((res) => setInvoice(res.data)).catch(() => setError("Failed to fetch invoice"))
  }, [id]);

  if (!invoice) return <div>Loading...</div>;

  const [downloading, setDownloading] = useState(false);
  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const res = await api.get(`/invoices/${id}/download/`);
      window.open(res.data.pdf_url, "_blank");
    } catch (err) {
      alert("Failed to download PDF");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Invoice {invoice.invoice_number}</h1>
      <p>Client: {invoice.client_name}</p>
      <p>Email: {invoice.client_email}</p>
      <p>Created At: {new Date(invoice.created_at).toLocaleString()}</p>
      <p>Total: ${invoice.total.toFixed(2)}</p>
      <p>Tax: {invoice.tax.toFixed(2)}%</p>
      <p>Due Date: {invoice.due_date}</p>
      <p>Status: <span className={`font-bold ${invoice.status === 'overdue' ? 'text-red-500' : invoice.status === 'paid' ? 'text-green-500' : 'text-yellow-500'}`}>
        {invoice.status}
      </span></p>

      <h2 className="mt-4 font-semibold">Items</h2>
      <ul className="list-disc ml-6">
        {invoice.items.map((item) => (
          <li key={item.id}>
            {item.description} — {item.quantity} x ${item.unit_price} = ${item.line_total}
          </li>
        ))}
      </ul>

      <button
        onClick={downloadPDF}
        disabled={downloading}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
      {downloading ? "Downloading..." : "Download PDF"}
      </button>
    </div>
  );
};

export default ViewInvoice;
