import mongoose from "mongoose";
import { DB_NAME } from "../utils/constants.ts";

export default async function connectDB() {
  console.log("MONGO_CONNETION _EXECUTED")
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
}
