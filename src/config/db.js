// src/config/db.js
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('Por favor define la variable MONGODB_URI en el archivo .env');
}

let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(mongooseInstance => mongooseInstance);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

module.exports = connectToDatabase;
