const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const FILE = path.join(__dirname, 'users.json');

function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex');
}

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone || '' };
}

function createUser({ name, email, phone, password }) {
  const users = readUsers();
  const cleanEmail = email.trim().toLowerCase();
  if (users.some((u) => u.email === cleanEmail)) {
    throw new Error('An account with this email already exists.');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: cleanEmail,
    phone: (phone || '').trim(),
    salt,
    passwordHash: hashPassword(password, salt),
    createdAt: new Date().toISOString()
  };
  users.push(user);
  writeUsers(users);
  return publicUser(user);
}

function findByEmail(email) {
  const user = readUsers().find((u) => u.email === email.trim().toLowerCase());
  return user ? publicUser(user) : null;
}

function verifyUser(email, password) {
  const user = readUsers().find((u) => u.email === email.trim().toLowerCase());
  if (!user) return null;
  if (hashPassword(password, user.salt) !== user.passwordHash) return null;
  return publicUser(user);
}

function getUsers() {
  return readUsers().map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || '',
    createdAt: u.createdAt
  }));
}

module.exports = { createUser, findByEmail, verifyUser, getUsers };