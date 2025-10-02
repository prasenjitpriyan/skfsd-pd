import { Db, MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

// FIX: Removed the unsupported 'bufferMaxEntries' and 'bufferCommands' options.
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Connects to the MongoDB database and returns a Db instance.
 */
export async function connectToDatabase(): Promise<Db> {
  try {
    const client = await clientPromise;
    return client.db(process.env.MONGODB_DB_NAME || 'skfsd');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

/**
 * Initializes the database by creating necessary indexes on collections.
 * This should be run once during application startup or deployment.
 */
export async function initializeDatabase(): Promise<void> {
  const db = await connectToDatabase();

  try {
    // Running index creation in parallel for efficiency
    await Promise.all([
      // Users collection indexes
      db.collection('users').createIndex({ email: 1 }, { unique: true }),
      db.collection('users').createIndex({ employeeId: 1 }, { unique: true }),
      db.collection('users').createIndex({ isActive: 1 }),

      // Daily Metrics collection indexes
      db
        .collection('dailymetrics')
        .createIndex({ officeId: 1, date: 1 }, { unique: true }),
      db.collection('dailymetrics').createIndex({ date: -1 }),
      db.collection('dailymetrics').createIndex({ isLocked: 1 }),

      // DRM Entries collection indexes
      db.collection('drmentries').createIndex({ officeId: 1 }),
      db
        .collection('drmentries')
        .createIndex({ entryNumber: 1 }, { unique: true }),
      db.collection('drmentries').createIndex({ status: 1 }),
      db.collection('drmentries').createIndex({ createdAt: -1 }),

      // Offices collection indexes
      db.collection('offices').createIndex({ code: 1 }, { unique: true }),
      db.collection('offices').createIndex({ isActive: 1 }),

      // Audit Logs collection indexes
      db.collection('auditlogs').createIndex({ entityType: 1, entityId: 1 }),
      db.collection('auditlogs').createIndex({ userId: 1 }),
      db.collection('auditlogs').createIndex({ timestamp: -1 }),

      // Sessions collection indexes
      db.collection('sessions').createIndex({ userId: 1 }),
      db.collection('sessions').createIndex({ token: 1 }, { unique: true }),
      db.collection('sessions').createIndex({ isActive: 1 }),
      // TTL index to automatically delete expired sessions
      db
        .collection('sessions')
        .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    ]);

    console.log('Database indexes created/verified successfully.');
  } catch (error) {
    console.error('Error creating database indexes:', error);
    throw error;
  }
}
