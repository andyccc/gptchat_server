const login = {
  id: '/login',
  type: 'object',
  properties: {
    device_number: { type: 'string' },
    timezone: { type: 'string' },
  },
  required: ['device_number'],
};

const chat = {
  id: '/chat',
  type: 'object',
  properties: {
    messages: { type: 'array' },
  },
  required: ['messages'],
};

const orderCreate = {
  id: '/orderCreate',
  type: 'object',
  properties: {
    product_id: { type: 'string', maxLength: 50 },
  },
  required: ['product_id'],
};

const orderUpdate = {
  id: '/orderCreate',
  type: 'object',
  properties: {
    order_id: { type: 'string', minLength: 1 },
    product_id: { type: 'string', minLength: 1 },
    transaction_id: { type: 'string', minLength: 1 },
    transaction_date: { type: 'string', minLength: 1 },
    transaction_receipt: { type: 'string', minLength: 1 },

  },
  required: ['order_id',
    'product_id',
    'transaction_id',
    'transaction_date',
    'transaction_receipt',
  ],
};

const orderRestore = {
  id: '/orderCreate',
  type: 'object',
  properties: {
    order_id: { type: 'string', minLength: 1 },
    product_id: { type: 'string', minLength: 1 },
    transaction_id: { type: 'string', minLength: 1 },
    transaction_date: { type: 'string', minLength: 1 },
    transaction_receipt: { type: 'string', minLength: 1 },
  },
  required: [
    // 'order_id',
    // 'product_id',
    'transaction_id',
    'transaction_date',
    'transaction_receipt',
  ],
};

module.exports = {
  orderCreate,
  orderUpdate,
  orderRestore,
  chat,
  login,
};
