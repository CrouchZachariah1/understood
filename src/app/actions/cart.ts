"use server";

import { revalidatePath } from "next/cache";
import { addToCart, removeCartItem, updateCartItem } from "@/lib/cart";

export async function addToCartAction(variantId: string, quantity = 1) {
  await addToCart(variantId, quantity);
  revalidatePath("/");
  revalidatePath("/cart");
}

export async function updateCartAction(itemId: string, quantity: number) {
  await updateCartItem(itemId, quantity);
  revalidatePath("/cart");
}

export async function removeCartAction(itemId: string) {
  await removeCartItem(itemId);
  revalidatePath("/cart");
}
