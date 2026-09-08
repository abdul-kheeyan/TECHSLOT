import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/techslot';
    
    // Attempt standard connection
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database] Standard MongoDB connection failed: ${error.message}`);
    
    // In development mode, provide automatic in-memory MongoDB fallback so the app works instantly without setup hurdles
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('[Database] Initializing In-Memory MongoDB for zero-config local testing...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memoryUri = mongod.getUri();
        const conn = await mongoose.connect(memoryUri);
        console.log(`[Database] In-Memory MongoDB Connected at ${memoryUri}`);
        return;
      } catch (memError) {
        console.error(`[Database] In-memory MongoDB initialization failed: ${memError.message}`);
      }
    }
    
    console.error(`[Database] Critical Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
