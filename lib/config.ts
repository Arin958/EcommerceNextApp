
 
const configEnv = {
    env: {
        clerk: {
            publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
            secretKey: process.env.NEXT_PUBLIC_CLERK_SECRET_KEY!
        },
        mongodb: {
            uri: process.env.MONGODB_URI!
        }
    }
}


export default configEnv