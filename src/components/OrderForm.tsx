"use client";

import { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export default function OrderForm() {
  const [items, setItems] = useState<string[]>([]);
  const [total, setTotal] = useState(0);

  const placeOrder = async () => {
    try {
      await addDoc(collection(db, "orders"), {
        items,
        total,
        createdAt: Timestamp.now(),
      });

      alert("Order placed successfully ✅");

      // reset after order
      setItems([]);
      setTotal(0);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order ❌");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Place Order</h1>

      {/* Example buttons */}
      <button
        onClick={() => {
          setItems(["Mango Juice"]);
          setTotal(90);
        }}
        className="border p-2 mr-2"
      >
        Mango Juice - 90
      </button>

      <button
        onClick={placeOrder}
        className="bg-black text-white px-4 py-2 mt-4"
      >
        Place Order
      </button>
    </div>
  );
}
