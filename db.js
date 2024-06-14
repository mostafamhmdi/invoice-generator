const { createRxDatabase, addRxPlugin } = require('rxdb');
const { getRxStorageMemory } = require('rxdb/plugins/storage-memory');

let db;

async function initDatabase() {
  if (!db) {
    db = await createRxDatabase({
      name: 'invoiceDB',
      storage: getRxStorageMemory(),
    });

    // Create collections
    await db.addCollections({
      customers: {
        schema: {
          title: 'customer schema',
          description: 'Schema for customer data',
          version: 0,
          primaryKey:"idcode",
          type: 'object',
          properties: {
            idcode: { type: 'string', primary: true },
            name: { type: 'string' },
            family: { type: 'string' },
            mobileNum: { type: 'string' },
            email: { type: 'string' },
            address: { type: 'string' },
          },
          required: ['idcode', 'name', 'family'],
        },
      },
      sellers: {
        schema: {
          title: 'seller schema',
          description: 'Schema for seller data',
          version: 0,
          primaryKey:"idcode",
          type: 'object',
          properties: {
            idcode: { type: 'string', primary: true },
            name: { type: 'string' },
            family: { type: 'string' },
            mobileNum: { type: 'string' },
            email: { type: 'string' },
            address: { type: 'string' },
          },
          required: ['idcode', 'name', 'family'],
        },
      },
      invoices: {
        schema: {
          title: 'invoice schema',
          description: 'Schema for invoice data',
          version: 0,
          primaryKey:"id",
          type: 'object',
          properties: {
            id: { type: 'string', primary: true },
            customerId: { type: 'string' },
            sellerId: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  quantity: { type: 'number' },
                  price: { type: 'number' },
                },
              },
            },
            totalAmount: { type: 'number' },
          },
          required: ['id', 'customerId', 'sellerId', 'items', 'totalAmount'],
        },
      },
    });
  }
  return db;
}

module.exports = initDatabase;
