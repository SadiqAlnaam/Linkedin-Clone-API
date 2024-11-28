import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGOOSE_URL);
        console.log(`MongooDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`{Error connection to MongooDB: ${error.message}}`);
    }
}