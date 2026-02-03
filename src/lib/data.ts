import { addDoc, collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "./firebaseClient";
import type { Order, OrderItem } from "./types";
import type { Drink } from './types';
export const drinks: Drink[] = [
  { id: 'tea', name: 'Iced Tea', price: 2.5 },
  { id: 'coffee', name: 'Cold Brew Coffee', price: 3.5 },
  { id: 'lemonade', name: 'Fresh Lemonade', price: 3.0 },
  { id: 'juice', name: 'Orange Juice', price: 3.25 },
  { id: 'smoothie', name: 'Mango Smoothie', price: 4.5 },
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
    createdAt: newOrder.createdAt.toDate(), // <-- convert here
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

  const orders = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];

  const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  return { orders, totalSales };
}
