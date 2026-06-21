import FilterSidebar from "@/components/FilterSidebar";
import ProductList from "@/components/ProductList";
import AdvancedSearchBar from "@/components/SearchBar";
import SortDropdown from "@/components/SortBy";
import connectDB from "@/lib/mongodb";
import { Product } from "@/schema/ProductSchema";
import { IProduct } from "@/types";
import { FilterQuery } from "mongoose";

interface ShopPageProps {
  searchParams: Promise<{
    sort?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    color?: string;
    size?: string;
    search?: string;
    minRating?: string;
    collections?: string;
  }>;
}

export default async function ShopPage({
  searchParams,
}: ShopPageProps) {
  await connectDB();

  const params = await searchParams;

  const query: FilterQuery<IProduct> = {};

  // Category
  if (params.category) {
    query.category = params.category;
  }

  // Variant filters
  if (params.color) {
    query["variants.color"] = params.color;
  }

  if (params.size) {
    query["variants.size"] = params.size;
  }

  // Collection
  if (params.collections) {
    query.collections = params.collections;
  }

  // Price range
  if (params.minPrice || params.maxPrice) {
    query.price = {};

    if (params.minPrice) {
      query.price.$gte = Number(params.minPrice);
    }

    if (params.maxPrice) {
      query.price.$lte = Number(params.maxPrice);
    }
  }

  // Search
  if (params.search?.trim()) {
    query.$or = [
      {
        name: {
          $regex: params.search,
          $options: "i",
        },
      },
      {
        tags: {
          $regex: params.search,
          $options: "i",
        },
      },
    ];
  }

  // Base query
  let productsQuery = Product.find(query).lean<IProduct[]>();

  // Sorting
  switch (params.sort) {
    case "bestseller":
      productsQuery = productsQuery.sort({ sold: -1 });
      break;

    case "new":
      productsQuery = productsQuery.sort({ createdAt: -1 });
      break;

    case "trending":
      productsQuery = productsQuery.sort({
        averageRating: -1,
        sold: -1,
      });
      break;

    case "price_high":
      productsQuery = productsQuery.sort({ price: -1 });
      break;

    case "price_low":
      productsQuery = productsQuery.sort({ price: 1 });
      break;

    default:
      productsQuery = productsQuery.sort({
        createdAt: -1,
      });
  }
  console.time("products");

  const [
    shoppingProducts,
    categories,
    colors,
    sizes,
    collections,
  ] = await Promise.all([
    productsQuery.exec(),
    Product.distinct("category"),
    Product.distinct("variants.color"),
    Product.distinct("variants.size"),
    Product.distinct("collections"),
  ]);

  console.timeEnd("products");

  const products = JSON.parse(
    JSON.stringify(shoppingProducts)
  );

  return (
    <div className="flex flex-col sm:flex-row gap-6 p-6">
      <FilterSidebar
        categories={categories}
        colors={colors}
        sizes={sizes}
        collections={collections}
      />

      <div className="flex-1">
        <AdvancedSearchBar />

        {params.search && (
          <p className="mt-2 text-sm text-gray-500">
            Search results for &quot;{params.search}&quot;
          </p>
        )}

        <SortDropdown currentSort={params.sort ?? ""} />

        <ProductList
          product={products}
          title={
            params.category
              ? `${params.category}`
              : "All Products"
          }
        />
      </div>
    </div>
  );
}