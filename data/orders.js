const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'orders.json');

function readOrders() {
  try {
    const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  fs.writeFileSync(FILE, JSON.stringify(orders, null, 2));
}

function getOrders() {
  return readOrders();
}

function getOrder(id) {
  return readOrders().find((o) => o.id === id) || null;
}

function createOrder(order) {
  const orders = readOrders();
  const record = {
    id: `ORD-${Date.now()}`,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    ...order
  };
  orders.unshift(record);
  writeOrders(orders);
  return record;
}

function updateStatus(id, status) {
  const orders = readOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  order.status = status;
  writeOrders(orders);
  return order;
}

module.exports = { getOrders, getOrder, createOrder, updateStatus };