
 
const configEnv = {
    env: {
        clerk: {
            publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
            secretKey: process.env.NEXT_PUBLIC_CLERK_SECRET_KEY!
        },
        mongodb: {
            uri: process.env.MONGODB_URI!
        },
        paypal: {
            api: process.env.PAYPAL_API_URL!,
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
            clientSecret: process.env.PAYPAL_CLIENT_SECRET!
        },
        cloudinary: {
            cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
            apiKey: process.env.CLOUDINARY_API_KEY!,
            apiSecret: process.env.CLOUDINARY_API_SECRET!
        }
    }
}


export default configEnv