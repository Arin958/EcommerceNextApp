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
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Shop By Category
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Discover our curated collections for every style and occasion
                </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
                {uniqueCategories.map((cat, i) => (
                    <CategoryCard key={i} name={cat.name} image={cat.image} />
                ))}
            </div>
        </div>
    );
}
