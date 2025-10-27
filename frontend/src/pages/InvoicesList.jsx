import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const InvoicesList = () => {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchInvoices = async () => {
    const res = await api.get(`/invoices/?page=${page}&search=${search}&status=${status}`);
    setInvoices(res.data.results);
    setTotalPages(Math.ceil(res.data.count / 10));
  };

  useEffect(() => {
    fetchInvoices();
  }, [page, search, status]);

  return (
    <div className="p-6 md:max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Invoices</h1>

      <div className="mb-5">
        <Link
            to="/create-invoice"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
            Create New Invoice
        </Link>
      </div>
      {/* Search + Filter */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search invoices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-1/2"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 border rounded">
            <option value="">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Invoices Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-2">Invoice ID</th>
            <th className="p-2">Client</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Status</th>
            <th className="p-2">Due date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id} className="border-t text-center">
                <td className="p-2">{inv.invoice_number}</td>
                <td className="p-2">{inv.client_name}</td>
                <td className="p-2">${inv.total}</td>
                <td className="p-2">
                    {inv.status == "paid" ? (
                        <span className="text-green-600 font-semibold">Paid</span>
                    ) : inv.status == "pending" ? (
                        <span className="text-yellow-600 font-semibold">Pending</span>
                    ): <span className="text-red-600 font-semibold">Overdue</span>}
                </td>
                <td className="p-2">{new Date(inv.due_date).toLocaleDateString()}</td>
                <td className="p-2">
                <a href={`/invoice/${inv.id}`} className="text-blue-600 hover:underline">View</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        {[...Array(totalPages).keys()].map((n) => (
          <button
            key={n}
            onClick={() => setPage(n + 1)}
            className={`px-3 py-1 rounded ${page === n + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {n + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InvoicesList;
