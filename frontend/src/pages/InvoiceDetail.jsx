// src/pages/InvoiceDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/invoices/${id}/`)
      .then((res) => setInvoice(res.data))
      .catch(() => setError("Failed to fetch invoice"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const items = [...invoice.items];
      items[index][name] =
        name === "quantity" || name === "unit_price" ? Number(value) : value;
      setInvoice({ ...invoice, items });
    } else {
      setInvoice({ ...invoice, [name]: value });
    }
  };

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { description: "", quantity: 1, unit_price: 0 }],
    });
  };

  const removeItem = (index) => {
    const items = invoice.items.filter((_, i) => i !== index);
    setInvoice({ ...invoice, items });
  };

  const calculateLineTotal = (item) => item.quantity * item.unit_price;

  const handleUpdate = async () => {
    try {
      await api.put(`/invoices/${id}/`, invoice);
      alert("Invoice updated successfully!");
      navigate("/dashboard");
      
    } catch (err) {
      console.error(err);
      alert("Failed to update invoice");
    }
  };

  const downloadPDF = async () => {
    try {
      const res = await api.get(`/invoices/${id}/download/`);
      const pdfUrl = res.data.pdf_url;
      window.open(pdfUrl, "_blank");
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF");
    }
  };

  if (loading) return <div>Loading invoice...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto md:max-w-6xl mx-auto text-xs md:text-base">
      <h1 className="text-2xl font-bold mb-4 md:text-3xl">{invoice.invoice_number}</h1>

      <div className="flex flex-wrap pb-3 md:mb-5 md:mt-10 md:w-full">
        <div className="flex-wrap mt-2">
          <label 
            htmlFor="client_name"
            className="md:w-32 md:flex-initial text-center p-2 pr-4 md:p-2 md:pr-5">
            Name
          </label>
          <input
            id="client_name"
            type="text"
            name="client_name"
            placeholder="Client Name"
            value={invoice.client_name}
            onChange={handleChange}
            className="w-1/2 md:w-2/3 md:h-10 p-2 rounded"
          />
        </div>
        <div className="flex-wrap mt-2">
          <label
            htmlFor="client_name"
            className="md:w-24 md:flex-initial text-center p-2 pr-4 md:p-2 md:pr-5">
            Email
          </label>
          <input
            id="client_email"
            type="email"
            name="client_email"
            placeholder="Client Email"
            value={invoice.client_email}
            onChange={handleChange}
            className="w-1/2 md:w-2/3 md:h-10 ml-1 p-2 rounded"
          />
        </div>
        <div className="flex-wrap mt-2">
          <label 
            htmlFor="client_name"
            className="text-center p-2 pr-4 md:w-20 md:flex-initial md:p-2 md:pr-5">
            Tax %
          </label>
          <input
            id = "tax"
            type="number"
            name="tax"
            placeholder="Tax %"
            value={invoice.tax}
            onChange={handleChange}
            className="w-1/3 ml-1 md:w-1/3 md:h-10 p-2 rounded"
          />
        </div>
        <div className="flex pb-3 mt-2 justify-start">
          <label htmlFor="status" className="md:w-32 md:flex-initial text-center p-2 pr-5 md:p-2 md:pr-6">Status</label>
          <select
            id="status"
            name="status"
            value={invoice.status}
            onChange={handleChange}
            className="w-1/2 md:w-2/3 md:h-10 p-2 rounded">
            
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        <div className="flex-wrap mb-0 md:mt-2 md:w-2/3">
          <label
            htmlFor="due_date"
            className="text-center p-2 pr-1 md:w-20 md:flex-initial md:p-2 md:pr-5">
            Due Date
          </label>
          <input
            id = "due_date"
            type="date"
            name="due_date"
            value={invoice.due_date || ""}
            onChange={handleChange}
            className="w-2/3 md:ml-1 md:w-1/3 md:h-10 p-2 rounded"
          />
        </div>
      </div>

      <div className="space-y-2">
        {invoice.items.map((item, index) => (
          <div key={index} className="flex-wrap md:grid md:grid-cols-4 bg-gray-700/10 rounded-lg mb-2 px-3 py-2 md:py-5">
            <div className="md:grid md:grid-cols-1 md:place-items-center">
              <label htmlFor="description" className="pb-1 pr-3 md:pr-0">Item Name</label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="Item Description"
                value={item.description}
                onChange={(e) => handleChange(e, index)}
                className="ml-2 w-3/5 md:w-full p-2 rounded"
              />
            </div>
            <div className="md:grid md:grid-cols-1 md:place-items-center">
              <label htmlFor="quantity" className="pb-1 pr-2.5 md:pr-0">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => handleChange(e, index)}
                className="mt-1 ml-6 md:ml-5 w-3/5 md:w-2/3 p-2 rounded"
              />
            </div>
            <div className="md:grid md:grid-cols-1 md:place-items-center">
              <label htmlFor="unit_price" className="pb-1 pr-3 md:pr-0">Unit Price</label>
              <input
                type="number"
                id="unit_price"
                name="unit_price"
                placeholder="Unit Price"
                value={item.unit_price}
                onChange={(e) => handleChange(e, index)}
                className="ml-4 md:ml-1 mt-1 md:ml-8 w-3/5 md:w-full p-2 rounded"
              />
            </div>
            <div className="flex flex-row md:grid md:grid-cols-1 md:place-items-center">
              <label htmlFor="total" className="pb-1 pt-3 md:pt-0">Total</label>
              <div id="total" className="max-md:ml-14 max-md:mr-[5vw] mt-3 mr-0 flex max-md:justify-between max-md:w-full md:mt-0 md=:w-1/2 align-center">
                <span className="w-auto md:pt-3 text-center font-semibold">
                  ${calculateLineTotal(item)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="px-2 max-md:h-auto max-md:w-auto md:ml-7 md:h-auto md:ml-5 md:w-auto bg-red-600 text-white text-center rounded hover:bg-red-700"
                >
                  X
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2"
      >
        Add Item
      </button>

      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Update Invoice
        </button>
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default InvoiceDetail;
