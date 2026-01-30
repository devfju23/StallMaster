export type Drink = {
  id: string;
  name: string;
  price: number;
};

export type OrderItem = {
  drinkId: string;
  drinkName: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: Date;
};
