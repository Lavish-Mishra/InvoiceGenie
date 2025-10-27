// src/pages/CreateInvoice.jsx
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import React, { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";


const CreateInvoice = () => {
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState({
    client_name: "",
    client_email: "",
    tax: Number(),
    due_date: "",
    status: "pending",
    items: [{ description: "", quantity: 1, unit_price: 0 }],
  });
  const [error, setError] = useState("");

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const items = [...invoiceData.items];
      items[index][name] =
        name === "quantity" || name === "unit_price" ? Number(value) : value;
      setInvoiceData({ ...invoiceData, items });
    } else {
      setInvoiceData({ ...invoiceData, [name]: value });
    }
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: "", quantity: 1, unit_price: 0 }],
    });
  };

  const removeItem = (index) => {
    const items = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items });
  };

  const calculateLineTotal = (item) => item.quantity * item.unit_price;

  const handleSubmit = async (e) => {  
    e.preventDefault();
    console.log("Form data being submitted:", invoiceData);
    setError("");

    if (!invoiceData.client_name) {
      setError("Client name is required.");
      return;
    }

    if (invoiceData.items.some((item) => !item.description || item.unit_price <= 0)) {
      setError("Each item must have a description and a valid unit price.");
      return;
    }
    const payload = {
      ...invoiceData,
      tax: Number(invoiceData.tax), // convert to number
    };

    try {    
      await api.post("/invoices/",payload);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to create invoice. Check console for details.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 md:max-w-5xl mx-auto text-xs md:text-base">
      <h1 className="text-2xl font-bold mb-4 md:text-3xl">Create Invoice</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="pt-2 grig grid-cols-1 gap-4 bg-gray-700/10 rounded-lg md:pt-4 md:pb-1">
          <div className="flex pb-3 justify-start">
            <label htmlFor="client_name" className="md:w-32 md:flex-initial text-center p-2 pr-4 md:p-2 md:pr-5">Name</label>
            <input
              type="text"
              id="client_name"
              name="client_name"
              placeholder="Client Name"
              value={invoiceData.client_name}
              onChange={handleChange}
              className="w-1/2 md:w-2/3 md:h-10 p-2 rounded"
            />
          </div>
          <div className="flex pb-3 justify-start">
            <label htmlFor="client_email" className="md:w-32 md:flex-initial text-center p-2 pr-5 md:p-2 md:pr-6">Email</label>
            <input
              type="email"
              id="client_email"
              name="client_email"
              placeholder="Client Email"
              value={invoiceData.client_email}
              onChange={handleChange}
              className="w-1/2 md:w-2/3 md:h-10 p-2 rounded"
            />
          </div>
          <div className="flex pb-3 justify-start">
            <label htmlFor="tax" className="md:w-32 md:flex-initial text-center p-2 pr-5 md:p-2 md:pr-6">Tax %</label>
            <input
              type="number"
              id="tax"
              name="tax"
              value={invoiceData.tax>0 ? invoiceData.tax : 0}
              placeholder="Tax %"
              onChange={handleChange}
              className="w-1/2 md:w-2/3 md:h-10 p-2 rounded"
            />
          </div>
          <div className="flex pb-3 justify-start">
            <label htmlFor="status" className="md:w-32 md:flex-initial text-center p-2 pr-5 md:p-2 md:pr-6">Status</label>
            <select id="status" name="status" value={invoiceData.status || "pending"} className="w-1/2 md:w-2/3 md:h-10 p-2 rounded">
              <option value="paid">Paid</option>
              <option value="pending" selected>Pending</option>
            </select>
          </div>
          <div className="flex pb-3 justify-start">
            <label htmlFor="due_date" className="md:w-32 md:flex-initial text-center p-2 pr-5 md:p-2 md:pr-6">Due Date</label>
            <input
              required
              type="date"
              id="due_date"
              name="due_date"
              value={invoiceData.due_date}
              onChange={handleChange}
              className="w-1/2 md:w-2/3 md:h-10 p-2 rounded"
            />
          </div>
        </div>

        <div>
          {invoiceData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 bg-gray-700/10 rounded-lg mb-2 px-3 py-2 md:py-5">
              <div className="grid grid-cols-1 place-items-center">
                <label htmlFor="description" className="pb-1">Item Name</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Item Description"
                  value={item.description}
                  onChange={(e) => handleChange(e, index)}
                  className="w-full p-2 rounded"
                />
              </div>
              <div className="grid grid-cols-1 place-items-center">
                <label htmlFor="quantity" className="pb-1">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleChange(e, index)}
                  className="ml-4 w-3/5 md:w-full p-2 rounded"
                />
              </div>
              <div className="grid grid-cols-1 place-items-center">
                <label htmlFor="unit_price" className="pb-1">Unit Price</label>
                <input
                  type="number"
                  id="unit_price"
                  name="unit_price"
                  placeholder="Unit Price"
                  value={item.unit_price}
                  onChange={(e) => handleChange(e, index)}
                  className="ml-8 w-3/5 md:w-full p-2 rounded"
                />
              </div>
              <div className="grid grid-cols-1 place-items-center">
                <label className="pb-1">Total</label>
                <div className="w-1/7 md=:w-1/3">
                  <span className="w-auto text-center font-semibold">
                    ${calculateLineTotal(item)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="px-2 ml-2 md:w-auto bg-red-600 text-white rounded hover:bg-red-700"
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
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Item
        </button>

        <button
          type="submit"
          className="w-full mt-4 p-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Create Invoice
        </button>
      </form>
    </div>
  );
};

export default CreateInvoice;
