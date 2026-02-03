import { getTodaysOrders } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingBag } from 'lucide-react';
import { DailySalesAccordion } from './daily-sales-accordion'; // Client component
import type { Order } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

// Helper to format currency
export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NPR' }).format(amount);

// Convert Firestore Timestamp or string to Date
const toDate = (date: Date | Timestamp | string): Date => {
  if (date instanceof Date) return date;
  if (date instanceof Timestamp) return date.toDate(); // ✅ Firestore Timestamp
  return new Date(date); // string fallback
};

// Format Date to time string for UI
export const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default async function DailySales() {
  const { orders: rawOrders, totalSales } = await getTodaysOrders();

  // Ensure createdAt is a Date
  const orders: Order[] = rawOrders.map(order => ({
    ...order,
    createdAt: toDate(order.createdAt),
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center justify-between">
          <span>Daily Sales</span>
          <div className="flex items-center gap-2 text-primary">
            <DollarSign className="h-6 w-6" />
            <span className="text-3xl font-bold">{formatCurrency(totalSales)}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center text-muted-foreground py-16 flex flex-col items-center gap-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
            <p>No sales recorded for today yet.</p>
          </div>
        ) : (
          <DailySalesAccordion orders={orders} />
        )}
      </CardContent>
    </Card>
  );
}
