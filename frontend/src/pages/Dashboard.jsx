import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#32a852", "#a2a832","#a83232"];

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get("/invoices/dashboard_stats/");
      setStats(res.data);
    };
    fetchStats();
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-4">DASHBOARD</h2>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income per Month */}
        <div className="bg-gray-600 p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">Total Income (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.monthly_income}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: "#fff" }}/>
              <YAxis tick={{ fill: "#fff" }}/>
              <Tooltip />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Paid vs Unpaid */}
        <div className="bg-gray-600 p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">Paid vs Pending vs Overdue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                dataKey="value"
                data={[
                  { name: "Paid", value: stats.paid_invoices },
                  { name: "Pending", value: stats.pending_invoices },
                  { name: "Overdue", value: stats.overdue_invoices },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {COLORS.map((color, i) => (
                  <Cell key={i} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                align="right"
                content={({ payload }) => (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {payload.map((entry, index) => (
                      <li
                        key={`item-${index}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 4,
                          fontSize: 14,
                        }}
                      >
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%", // 👈 makes it a circle
                            backgroundColor: entry.color,
                            marginRight: 8,
                          }}
                        ></div>
                        {entry.value}
                      </li>
                    ))}
                  </ul>
                )}
              />

            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-gray-600 p-4 rounded-xl shadow mt-6">
        <h3 className="text-lg font-semibold mb-2">Recent Invoices</h3>
        <ul>
          {stats.recent_invoices.map((inv) => (
            <li key={inv.id} className="border-b py-2 flex justify-between">
              <span>{inv.client_name}</span>
              <span>₹{inv.total}</span>
              <span className={
                inv.status == "paid" ? "text-green-600" : inv.status == "pending" ? "text-yellow-600" : "text-red-600"}>
                {inv.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
