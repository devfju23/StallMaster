import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../src/lib/firebaseAdmin";

// Save a new order or get all orders
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Save new order
    const { items, total } = req.body;

    const newOrder = {
      items,
      total,
      createdAt: new Date(),
    };

    const docRef = await db.collection("orders").add(newOrder);
    res.status(201).json({ id: docRef.id, ...newOrder });

  } else if (req.method === "GET") {
    // Get today’s orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const snapshot = await db.collection("orders")
      .where("createdAt", ">=", today)
      .orderBy("createdAt", "desc")
      .get();

    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const totalSales = orders.reduce((sum: number, o: any) => sum + o.total, 0);

    res.status(200).json({ orders, totalSales });
  } else {
    res.status(405).end(); // Method not allowed
  }
}
