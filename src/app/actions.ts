'use server';

import { revalidatePath } from 'next/cache';
import { saveOrder as dbSaveOrder } from '@/lib/data';
import { z } from 'zod';

const orderItemSchema = z.object({
  drinkId: z.string().min(1),
  drinkName: z.string().min(1),
  quantity: z.number().min(1),
  price: z.number().positive(),
});

const saveOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Order cannot be empty.'),
  total: z.number().positive(),
});

export type FormState = {
  message: string;
  success: boolean;
};

export async function saveOrderAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    items: JSON.parse(formData.get('items') as string),
    total: parseFloat(formData.get('total') as string),
  };

  const validatedFields = saveOrderSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.issues.map(issue => issue.message).join(', ');
    return {
      message: `Failed to save order: ${errorMessages}`,
      success: false,
    };
  }

  try {
    await dbSaveOrder(validatedFields.data.items, validatedFields.data.total);
    revalidatePath('/');
    return { message: 'Order saved successfully.', success: true };
  } catch (error) {
    return { message: 'Database error: Failed to save order.', success: false };
  }
}
