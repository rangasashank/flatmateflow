import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
      await mongoose.connect(process.env.MONGO_URI, {dbName: "flatmatebackend",}).then((c) => console.log(`Database Connected with ${c.connection.host}`)).catch((e) => console.log(e));

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
