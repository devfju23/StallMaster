import { getTodaysOrders } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { DollarSign, Hash, Clock, ShoppingBag } from 'lucide-react';
import type { Order } from '@/lib/types';

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default async function DailySales() {
  // Add a fake delay to simulate network latency
  // await new Promise(resolve => setTimeout(resolve, 1000));
  const { orders, totalSales } = await getTodaysOrders();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center justify-between">
          <span>Daily Sales</span>
          <div className="flex items-center gap-2 text-primary">
            <DollarSign className="h-6 w-6" />
            <span className="text-3xl font-bold">
              {formatCurrency(totalSales)}
            </span>
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
          <Accordion type="single" collapsible className="w-full">
            {orders.map(order => (
              <AccordionItem value={order.id} key={order.id}>
                <AccordionTrigger>
                  <div className="flex justify-between w-full pr-4 text-sm">
                    <div className="flex items-center gap-2 font-semibold">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      {order.id}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="font-bold text-primary">
                      {formatCurrency(order.total)}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Drink</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map(item => (
                        <TableRow key={item.drinkId}>
                          <TableCell>{item.drinkName}</TableCell>
                          <TableCell className="text-center">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.quantity * item.price)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
