'use client';

import { useState, useReducer, useEffect, useMemo, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { saveOrderAction, type FormState } from '@/app/actions';
import { drinks } from '@/lib/data';
import type { OrderItem } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Trash2,
  PlusCircle,
  GlassWater,
  ShoppingCart,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types for reducer
type Action =
  | { type: 'ADD_ITEM'; payload: OrderItem }
  | { type: 'REMOVE_ITEM'; payload: { drinkId: string } }
  | { type: 'CLEAR_ORDER' };

// Reducer function
function orderReducer(state: OrderItem[], action: Action): OrderItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.find(
        item => item.drinkId === action.payload.drinkId
      );
      if (existingItem) {
        return state.map(item =>
          item.drinkId === action.payload.drinkId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      }
      return [...state, action.payload];
    }
    case 'REMOVE_ITEM':
      return state.filter(item => item.drinkId !== action.payload.drinkId);
    case 'CLEAR_ORDER':
      return [];
    default:
      return state;
  }
}

// Initial state for useActionState
const initialState: FormState = { message: '', success: false };

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
      disabled={disabled || pending}
      size="lg"
      aria-disabled={disabled || pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Save Order
        </>
      )}
    </Button>
  );
}

export default function NewOrderForm() {
  const [items, dispatch] = useReducer(orderReducer, []);
  const [selectedDrinkId, setSelectedDrinkId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [formState, formAction] = useActionState(saveOrderAction, initialState);
  const { toast } = useToast();

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const handleAddItem = () => {
    const drink = drinks.find(d => d.id === selectedDrinkId);
    if (drink && quantity > 0) {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          drinkId: drink.id,
          drinkName: drink.name,
          quantity: quantity,
          price: drink.price,
        },
      });
      setSelectedDrinkId('');
      setQuantity(1);
    }
  };

  useEffect(() => {
    if (formState.message) {
      if (formState.success) {
        dispatch({ type: 'CLEAR_ORDER' });
      } else {
        toast({
          title: 'Error',
          description: formState.message,
          variant: 'destructive',
        });
      }
    }
  }, [formState, toast]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-3">
          <GlassWater className="h-7 w-7 text-primary" />
          <span>New Order</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-2 items-end">
          <div>
            <label className="text-sm font-medium">Drink</label>
            <Select value={selectedDrinkId} onValueChange={setSelectedDrinkId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a drink..." />
              </SelectTrigger>
              <SelectContent>
                {drinks.map(drink => (
                  <SelectItem key={drink.id} value={drink.id}>
                    {drink.name} ({formatCurrency(drink.price)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Quantity</label>
            <Input
              type="number"
              value={quantity}
              onChange={e =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              min="1"
              className="mt-1"
            />
          </div>

          <Button
            onClick={handleAddItem}
            disabled={!selectedDrinkId || quantity <= 0}
            aria-label="Add item to order"
          >
            <PlusCircle className="h-5 w-5" />
            <span className="sr-only md:not-sr-only md:ml-2">Add</span>
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Current Order</h3>
          <div className="border rounded-lg max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <div className="text-center text-muted-foreground p-8">
                Your order is empty.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center w-[80px]">Qty</TableHead>
                    <TableHead className="text-right w-[120px]">Total</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map(item => (
                    <TableRow key={item.drinkId}>
                      <TableCell className="font-medium">
                        {item.drinkName}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.price * item.quantity)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() =>
                            dispatch({
                              type: 'REMOVE_ITEM',
                              payload: { drinkId: item.drinkId },
                            })
                          }
                          aria-label={`Remove ${item.drinkName}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4 !pt-0 mt-auto">
        <div className="w-full flex justify-between items-center text-xl font-bold border-t pt-4">
          <span>Grand Total:</span>
          <span className="text-primary text-2xl">{formatCurrency(total)}</span>
        </div>
        <form action={formAction} className="w-full">
          <input type="hidden" name="items" value={JSON.stringify(items)} />
          <input type="hidden" name="total" value={total} />
          <SubmitButton disabled={items.length === 0} />
        </form>
      </CardFooter>
    </Card>
  );
}
