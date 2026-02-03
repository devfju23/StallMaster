'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import { Order } from '@/lib/types';

export default function DailySales() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  
  useEffect(() => {
    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, 'orders'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp).toDate(),
      })) as Order[];
      setOrders(data);
      setTotalSales(data.reduce((sum, o) => sum + o.total, 0));
    };
    fetchOrders();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">Today's Sales</h2>
      <p className="text-lg">Total Orders: {orders.length}</p>
      <p className="text-lg font-semibold">Total Sales: ${totalSales.toFixed(2)}</p>
    </div>
  );
}
