// src/lib/data.ts
import { addDoc, collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "./firebaseClient";
import type { Order, OrderItem } from "./types";

// Full menu items
export const menu = [
  { id: 'fresh_start', name: 'Fresh Start Sip - Real Juice (Small)', price: 30 },
  { id: 'ruby_rush', name: 'Ruby Rush', price: 90 },
  { id: 'berry_blast', name: 'Berry Blast', price: 90 },
  { id: 'minty_breeze', name: 'Minty Breeze', price: 120 },
  { id: 'blue_wave', name: 'Blue Wave', price: 150 },
  { id: 'peach_freeze', name: 'Peach Freeze', price: 120 },
  { id: 'classic_chill_lassi', name: 'Classic Chill Lassi (200ml)', price: 80 },
  { id: 'royal_chill_lassi', name: 'Royal Chill Lassi (300ml)', price: 100 },
  { id: 'classic_coffee', name: 'Classic 3-in-1 Coffee', price: 70 },
  { id: 'bold_black', name: 'Bold Black Coffee', price: 50 },
  { id: 'green_tea', name: 'Green Tea', price: 25 },
  { id: 'ruby_bloom', name: 'Ruby Bloom Tea (Hibiscus Tea)', price: 70 },
  { id: 'warm_peach', name: 'Warm Peach Hug', price: 100 },
  { id: 'lemon_tea', name: 'Lemon Tea', price: 35 },
];

// Save order to Firestore
export async function saveOrder(items: OrderItem[], total: number): Promise<Order> {
  const newOrder = {
    items,
    total,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, "orders"), newOrder);

  return {
    id: docRef.id,
    items,
    total,
    createdAt: newOrder.createdAt.toDate(), // convert Timestamp to Date
  };
}

// Get today's orders from Firestore
export async function getTodaysOrders(): Promise<{ orders: Order[]; totalSales: number }> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const q = query(
    collection(db, "orders"),
    where("createdAt", ">=", startOfDay),
    where("createdAt", "<=", endOfDay)
  );

  const snapshot = await getDocs(q);

  const orders = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      items: data.items,
      total: data.total,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
    } as Order;
  });

  const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  return { orders, totalSales };
}
