import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Attempting MongoDB connection...'); // helpful pre-log
    console.log('MONGO_URI (masked) =', process.env.MONGO_URI ? process.env.MONGO_URI.replace(/\/\/(.+):(.+)@/, '//<user>:<pwd>@') : undefined);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  // you can add other options here if needed
});

console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
