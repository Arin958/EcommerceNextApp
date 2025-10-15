import FilterSidebar from "@/components/FilterSidebar";
import ProductList from "@/components/ProductList";
import AdvancedSearchBar from "@/components/SearchBar";
import SortDropdown from "@/components/SortBy";
import { Product } from "@/schema/schema";
import { IProduct } from "@/types";

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

export default async function ShopPage({ searchParams }: ShopPageProps) {

    // ✅ Await searchParams
    const params = await searchParams;


    const query: any = {};

    if (params.category) query.category = params.category;
    if (params.color) query['variants.color'] = params.color;
    if (params.size) query['variants.size'] = params.size;
    if (params.collections) query.collections = params.collections;

    if (params.minPrice || params.maxPrice) {
        query.price = {};
        if (params.minPrice) query.price.$gte = Number(params.minPrice);
        if (params.maxPrice) query.price.$lte = Number(params.maxPrice);
    }

    if (params.search) {
        query.$or = [
            { name: { $regex: params.search, $options: "i" } },
            { tags: { $regex: params.search, $options: "i" } },
        ];
    }

    let productsQuery = Product.find(query).lean<IProduct[]>();

    if (params.sort) {
        switch (params.sort) {
            case "bestseller":
                productsQuery = productsQuery.sort({ sold: -1 });
                break;
            case "new":
                productsQuery = productsQuery.sort({ createdAt: -1 });
                break;
            case "trending":
                productsQuery = productsQuery.sort({ averageRating: -1, sold: -1 });
                break;
            case "price_high":
                productsQuery = productsQuery.sort({ price: -1 });
                break;
            case "price_low":
                productsQuery = productsQuery.sort({ price: 1 });
                break;
            default:
                productsQuery = productsQuery.sort({ createdAt: -1 });
        }
    }

    const categories = await Product.distinct("category");
    const colors = await Product.distinct("variants.color");
    const sizes = await Product.distinct("variants.size");
    const collections = await Product.distinct("collections");

    const shoppingProducts = await productsQuery.exec();
    const products = shoppingProducts.map((product) => JSON.parse(JSON.stringify(product)));

    return (
        <div className="flex flex-col sm:flex-row gap-6 p-6">
            <FilterSidebar categories={categories} colors={colors} sizes={sizes} collections={collections} />
            <div className="flex-1">
                <AdvancedSearchBar />
                {params.search! && <p className="text-sm text-gray-500 mt-2">Search results for {params.search as string}</p>}
                <SortDropdown currentSort={params.sort!} />
                <ProductList product={products} title={params.category! ? ` "${params.category!}"` : "All Products"} />
            </div>
        </div>
    );
}
