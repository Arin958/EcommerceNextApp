import configEnv from "./config";
import { Product } from "@/schema/schema";
import mongoose from "mongoose";
import dummyProducts from "../dummyData.json"
import { config } from "dotenv"
config({ path: '.env.local' });




const seed = async () => {
    await mongoose.connect(process.env.MONGODB_URI!)
    try {
        console.log("Deleting existing products...");
        const insertProducts = await Product.deleteMany({})
        console.log("✅ Products Deleted");
        await Product.insertMany(dummyProducts.products)

        console.log("✅ Products Seeded");
    } catch (error) {
        console.log(error)
    }
}

seed()
