"use server";

import { api } from "~/trpc/server";

export default async function getPackingCategories() {
  const categories = await api.packingCategory.getAll();
  return categories;
}
