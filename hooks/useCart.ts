"use client";
import { useState, useEffect } from "react";
import { getWixBrowserClient } from "@/lib/wix-client-browser";

export function useCart() {
  const [itemCount, setItemCount] = useState(0);
  useEffect(() => {
    async function fetchCart() {
      try {
        const client = getWixBrowserClient();
        const cart = await client.currentCart.getCurrentCart();
        const count = cart?.lineItems?.reduce((acc: number, item: { quantity?: number }) => acc + (item.quantity || 0), 0) || 0;
        setItemCount(count);
      } catch { setItemCount(0); }
    }
    fetchCart();
  }, []);
  return { itemCount };
}
