import mongoose from "mongoose";

const connectDB = async () => {
  try {
    //@ts-ignore
    const connect = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    //@ts-ignore
    console.log(`MongoDB Connected ${connect.connection.host}`);
  } catch (error) {
    //@ts-ignore
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
