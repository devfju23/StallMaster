import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../src/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { items, total } = req.body;

    const docRef = await db.collection("orders").add({
      items,
      total,
      createdAt: new Date(),
    });

    res.status(200).json({ id: docRef.id });
  } else if (req.method === "GET") {
    const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(orders);
  }
}
