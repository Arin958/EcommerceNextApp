import { NextResponse } from "next/server";
import { Product } from "@/schema/schema";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  if (!query) return NextResponse.json([]);

  // Find matching suggestions
  const products = await Product.find(
    {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
        { collections: { $regex: query, $options: "i" } },
        { "variants.color": { $regex: query, $options: "i" } },
        { "variants.size": { $regex: query, $options: "i" } },
      ],
    },
    "name brand collections variants.color"
  ).limit(7);

  return NextResponse.json(products);
}
