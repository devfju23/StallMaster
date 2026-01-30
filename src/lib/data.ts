import type { Drink, Order, OrderItem } from './types';

export const drinks: Drink[] = [
  { id: 'tea', name: 'Iced Tea', price: 2.5 },
  { id: 'coffee', name: 'Cold Brew Coffee', price: 3.5 },
  { id: 'lemonade', name: 'Fresh Lemonade', price: 3.0 },
  { id: 'juice', name: 'Orange Juice', price: 3.25 },
  { id: 'smoothie', name: 'Mango Smoothie', price: 4.5 },
];

// In-memory "database"
let orders: Order[] = [];
let orderIdCounter = 1;

export async function getTodaysOrders(): Promise<{
  orders: Order[];
  totalSales: number;
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() === today.getTime();
  });

  const totalSales = todaysOrders.reduce((sum, order) => sum + order.total, 0);

  const sortedOrders = todaysOrders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return JSON.parse(JSON.stringify({ orders: sortedOrders, totalSales }));
}

export async function saveOrder(
  items: OrderItem[],
  total: number
): Promise<Order> {
  const newOrder: Order = {
    id: `ORD-${String(orderIdCounter++).padStart(4, '0')}`,
    items,
    total,
    createdAt: new Date(),
  };
  orders.push(newOrder);

  // Return a copy
  return JSON.parse(JSON.stringify(newOrder));
}
