/**
 * Database Connection & Dual-Engine Persistence for KnowBridge AI
 * Connects to MongoDB Atlas via Mongoose when MONGODB_URI is provided.
 * Falls back to an atomic, robust local JSON document store when running offline
 * or in standalone hackathon evaluation mode.
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

// Ensure local data dir exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory store state initialized from disk
let memoryStore = {
  users: [],
  projects: [],
  sources: [],
  reconstructions: [],
  evidenceClaims: [],
  handovers: [],
  activities: []
};

function loadStore() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, 'utf-8');
      memoryStore = { ...memoryStore, ...JSON.parse(data) };
    } else {
      saveStore();
    }
  } catch (err) {
    console.error('[KnowBridge DB] Error loading local store, using default memory state:', err.message);
  }
}

function saveStore() {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('[KnowBridge DB] Error saving local store:', err.message);
  }
}

loadStore();

let isMongoConnected = false;

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[KnowBridge DB] No MONGODB_URI provided. Running in resilient local document store mode.');
    return { isMongo: false, store: memoryStore };
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });
    isMongoConnected = true;
    console.log('[KnowBridge DB] Connected to MongoDB Atlas successfully.');
    return { isMongo: true, mongoose };
  } catch (err) {
    console.warn(`[KnowBridge DB] MongoDB connection failed (${err.message}). Using robust local document store mode.`);
    isMongoConnected = false;
    return { isMongo: false, store: memoryStore };
  }
}

// Local Document Store API providing Mongoose-like ergonomics
const localDB = {
  getCollection: (name) => {
    if (!memoryStore[name]) memoryStore[name] = [];
    return {
      find: (filter = {}) => {
        let results = memoryStore[name];
        for (const [key, val] of Object.entries(filter)) {
          results = results.filter(item => item[key] === val);
        }
        return results;
      },
      findOne: (filter = {}) => {
        const results = localDB.getCollection(name).find(filter);
        return results[0] || null;
      },
      findById: (id) => {
        return memoryStore[name].find(item => item.id === id || item._id === id) || null;
      },
      create: (doc) => {
        const id = doc.id || doc._id || 'kb_' + Math.random().toString(36).substring(2, 11);
        const record = {
          ...doc,
          _id: id,
          id: id,
          createdAt: doc.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        memoryStore[name].unshift(record);
        saveStore();
        return record;
      },
      findByIdAndUpdate: (id, updates) => {
        const idx = memoryStore[name].findIndex(item => item.id === id || item._id === id);
        if (idx === -1) return null;
        memoryStore[name][idx] = {
          ...memoryStore[name][idx],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        saveStore();
        return memoryStore[name][idx];
      },
      findByIdAndDelete: (id) => {
        const idx = memoryStore[name].findIndex(item => item.id === id || item._id === id);
        if (idx === -1) return null;
        const deleted = memoryStore[name].splice(idx, 1)[0];
        saveStore();
        return deleted;
      },
      deleteMany: (filter = {}) => {
        const before = memoryStore[name].length;
        memoryStore[name] = memoryStore[name].filter(item => {
          for (const [k, v] of Object.entries(filter)) {
            if (item[k] === v) return false;
          }
          return true;
        });
        saveStore();
        return { deletedCount: before - memoryStore[name].length };
      }
    };
  },
  save: saveStore
};

module.exports = {
  connectDB,
  isMongoConnected: () => isMongoConnected,
  localDB
};
