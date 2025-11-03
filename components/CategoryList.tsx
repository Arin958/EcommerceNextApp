import { Product } from "@/schema/schema";
import CategoryCard from "./CategoryCard";
import { IProduct } from "@/types";

export default async function CategorySection() {

    // Fetch products from DB
    const productsCategory = await Product.find({})
        .select("category images thumbnail").limit(2)
        .lean<IProduct[]>();



    // Extract unique categories with image
    const uniqueCategories: { name: string; image: string }[] = [];

    productsCategory.forEach((prod) => {
        const categoryName = prod.category as unknown as string; // String category
        const image = prod.thumbnail || prod.images?.[0] || "/fallback.jpg";

        if (!uniqueCategories.some((c) => c.name === categoryName)) {
            uniqueCategories.push({ name: categoryName, image });
        }
    });

    return (
        <div className="mt-10 mb-10">

            <div className="text-center mb-12">
                <h2 className="font-bebas text-3xl sm:text-4xl md:text-5xl tracking-wide">
                    Shop By Category
                </h2>
                <p className="text-gray-500 text-sm md:text-base mt-2">
                    Discover our curated collections for every style and occasion
                </p>
                <div className="w-24 h-1 bg-black mx-auto mt-4"></div>
            </div>
            <div className="grid grid-cols-2 gap-6">
                {uniqueCategories.map((cat, i) => (
                    <CategoryCard key={i} name={cat.name} image={cat.image} />
                ))}
            </div>
        </div>
    );
}
