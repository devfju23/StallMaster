"use client";

import { useEffect, useState } from "react";
import { db } from '../../src/lib/firebaseClient'; // Make sure your client SDK is set up
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: any; // Firestore Timestamp
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"today" | "week" | "all">("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);

    const ordersRef = collection(db, "orders");
    let q;

    const now = new Date();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    if (filter === "today") {
      q = query(
        ordersRef,
        where("createdAt", ">=", startOfToday),
        orderBy("createdAt", "desc")
      );
    } else if (filter === "week") {
      const startOfWeek = new Date();
      startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
      startOfWeek.setHours(0, 0, 0, 0);

      q = query(
        ordersRef,
        where("createdAt", ">=", startOfWeek),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(ordersRef, orderBy("createdAt", "desc"));
    }

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
    setOrders(data);
    setLoading(false);
  };

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <div className="mb-4 space-x-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setFilter("today")}
        >
          Today
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => setFilter("week")}
        >
          This Week
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={() => setFilter("all")}
        >
          All
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Total Sales: ${totalSales.toFixed(2)}</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Order ID</th>
                <th className="p-2 border">Items</th>
                <th className="p-2 border">Total ($)</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="text-center">
                  <td className="p-2 border">{order.id}</td>
                  <td className="p-2 border">
                    {order.items.map(item => (
                      <div key={item.name}>
                        {item.name} x {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="p-2 border">{order.total.toFixed(2)}</td>
                  <td className="p-2 border">
                    {order.createdAt.toDate
                      ? order.createdAt.toDate().toLocaleString()
                      : new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
