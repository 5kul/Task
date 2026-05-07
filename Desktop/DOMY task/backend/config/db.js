const mongoose = require('mongoose');

module.exports = async function connectDB(){
  try {
    let uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ira';

    // Normalize localhost to IPv4 to avoid resolution to ::1 on some Windows setups
    uri = uri.replace('mongodb://localhost', 'mongodb://127.0.0.1');

    // If user provided a host-only URI like "mongodb://localhost:27017" or
    // "mongodb://localhost:27017/", append a default database name.
    const hostOnly = /^mongodb(?:\+srv)?:\/\/[^/]+\/?$/.test(uri);
    if (hostOnly) {
      if (!uri.endsWith('/')) uri += '/';
      uri += 'domy';
    }

    mongoose.set('bufferCommands', false);
    await mongoose.connect(uri);
    console.log('MongoDB connected to', uri);
  } catch (err) {
    console.error('MongoDB connection error', err.message || err);
    process.exit(1);
  }
};
