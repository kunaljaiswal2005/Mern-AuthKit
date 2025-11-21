import mongoose from "mongoose";
const connectDb = async () => {
    try {

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/mern-auth`)
        console.log(`\n Mongodb connected DB host : ${connectionInstance.connection.host}`)

    } catch (error) {
        console.log("monogdb connection failed", error);
        process.exit(1)

    }
}

export default connectDb