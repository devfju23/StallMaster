'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Clock, Hash } from 'lucide-react';
import type { Order } from '@/lib/types';
import { formatCurrency } from './daily-sales';

export function DailySalesAccordion({ orders }: { orders: Order[] }) {
  return (
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
                {new Date(order.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
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
                    <TableCell className="text-center">{item.quantity}</TableCell>
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
  );
}
