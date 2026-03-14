export interface MongoDocument {
  _id: string;
  [key: string]: any;
}

import type { CollectionSummary, DatabaseDetail } from "@compooss/types";

export const databases: DatabaseDetail[] = [
  {
    name: "ecommerce",
    sizeOnDisk: "245.8 MB",
    collections: [
      { name: "users", documentCount: 12847, avgDocSize: "482 B", totalSize: "5.9 MB", indexes: 4 },
      { name: "products", documentCount: 3421, avgDocSize: "1.2 KB", totalSize: "4.0 MB", indexes: 6 },
      { name: "orders", documentCount: 89234, avgDocSize: "2.1 KB", totalSize: "178.6 MB", indexes: 8 },
      { name: "reviews", documentCount: 45612, avgDocSize: "856 B", totalSize: "37.3 MB", indexes: 3 },
      { name: "categories", documentCount: 156, avgDocSize: "312 B", totalSize: "47.4 KB", indexes: 2 },
    ],
  },
  {
    name: "analytics",
    sizeOnDisk: "1.2 GB",
    collections: [
      { name: "events", documentCount: 2456789, avgDocSize: "384 B", totalSize: "898.4 MB", indexes: 5 },
      { name: "sessions", documentCount: 345678, avgDocSize: "1.1 KB", totalSize: "362.2 MB", indexes: 4 },
      { name: "pageviews", documentCount: 1234567, avgDocSize: "256 B", totalSize: "301.3 MB", indexes: 3 },
    ],
  },
  {
    name: "auth",
    sizeOnDisk: "18.4 MB",
    collections: [
      { name: "accounts", documentCount: 8934, avgDocSize: "612 B", totalSize: "5.2 MB", indexes: 3 },
      { name: "sessions", documentCount: 2341, avgDocSize: "384 B", totalSize: "878.2 KB", indexes: 2 },
      { name: "tokens", documentCount: 15678, avgDocSize: "768 B", totalSize: "11.5 MB", indexes: 4 },
    ],
  },
  {
    name: "blog",
    sizeOnDisk: "89.2 MB",
    collections: [
      { name: "posts", documentCount: 1245, avgDocSize: "4.8 KB", totalSize: "5.8 MB", indexes: 5 },
      { name: "comments", documentCount: 34567, avgDocSize: "512 B", totalSize: "16.9 MB", indexes: 3 },
      { name: "authors", documentCount: 89, avgDocSize: "1.1 KB", totalSize: "95.5 KB", indexes: 2 },
      { name: "tags", documentCount: 342, avgDocSize: "128 B", totalSize: "42.7 KB", indexes: 2 },
    ],
  },
];

const userDocs: MongoDocument[] = [
  {
    _id: "64a7f2e1b3c4d5e6f7890001",
    username: "sarah_dev",
    email: "sarah@example.com",
    profile: { firstName: "Sarah", lastName: "Chen", avatar: "https://i.pravatar.cc/150?u=sarah", bio: "Full-stack developer" },
    settings: { theme: "dark", notifications: true, language: "en" },
    roles: ["admin", "editor"],
    createdAt: { $date: "2024-01-15T08:30:00.000Z" },
    lastLogin: { $date: "2024-03-10T14:22:00.000Z" },
    isActive: true,
  },
  {
    _id: "64a7f2e1b3c4d5e6f7890002",
    username: "mike_jones",
    email: "mike.jones@example.com",
    profile: { firstName: "Mike", lastName: "Jones", avatar: null, bio: null },
    settings: { theme: "light", notifications: false, language: "en" },
    roles: ["viewer"],
    createdAt: { $date: "2024-02-20T11:45:00.000Z" },
    lastLogin: { $date: "2024-03-09T09:15:00.000Z" },
    isActive: true,
  },
  {
    _id: "64a7f2e1b3c4d5e6f7890003",
    username: "anna_k",
    email: "anna.kowalski@example.com",
    profile: { firstName: "Anna", lastName: "Kowalski", avatar: "https://i.pravatar.cc/150?u=anna", bio: "Data scientist" },
    settings: { theme: "dark", notifications: true, language: "pl" },
    roles: ["editor"],
    createdAt: { $date: "2023-11-05T16:20:00.000Z" },
    lastLogin: { $date: "2024-03-10T07:30:00.000Z" },
    isActive: false,
  },
];

const productDocs: MongoDocument[] = [
  {
    _id: "64b8e3f2c4d5e6f789000101",
    name: "Wireless Mechanical Keyboard",
    sku: "KB-WM-001",
    price: { amount: 149.99, currency: "USD" },
    inventory: { inStock: 234, warehouse: "US-WEST-1" },
    category: { $oid: "64c9f401d5e6f78901020304" },
    tags: ["electronics", "keyboard", "wireless", "mechanical"],
    specs: { switchType: "Cherry MX Blue", connectivity: "Bluetooth 5.0", battery: "4000mAh", weight: "780g" },
    rating: 4.7,
    reviewCount: 1243,
    isPublished: true,
    createdAt: { $date: "2024-01-10T12:00:00.000Z" },
  },
  {
    _id: "64b8e3f2c4d5e6f789000102",
    name: "Ergonomic Mouse Pro",
    sku: "MS-EP-042",
    price: { amount: 89.99, currency: "USD" },
    inventory: { inStock: 567, warehouse: "US-EAST-2" },
    category: { $oid: "64c9f401d5e6f78901020305" },
    tags: ["electronics", "mouse", "ergonomic"],
    specs: { dpi: 16000, buttons: 8, connectivity: "USB-C / Bluetooth", weight: "95g" },
    rating: 4.5,
    reviewCount: 876,
    isPublished: true,
    createdAt: { $date: "2024-02-14T09:30:00.000Z" },
  },
];

const orderDocs: MongoDocument[] = [
  {
    _id: "64c9f501e6f7890102030405",
    orderNumber: "ORD-2024-00891",
    customer: { $oid: "64a7f2e1b3c4d5e6f7890001" },
    items: [
      { product: { $oid: "64b8e3f2c4d5e6f789000101" }, quantity: 1, price: 149.99 },
      { product: { $oid: "64b8e3f2c4d5e6f789000102" }, quantity: 2, price: 89.99 },
    ],
    total: 329.97,
    status: "shipped",
    shipping: { method: "express", tracking: "1Z999AA10123456784", carrier: "UPS" },
    payment: { method: "credit_card", last4: "4242", status: "captured" },
    createdAt: { $date: "2024-03-08T15:42:00.000Z" },
    updatedAt: { $date: "2024-03-09T10:15:00.000Z" },
  },
];

export const collectionDocuments: Record<string, MongoDocument[]> = {
  "ecommerce.users": userDocs,
  "ecommerce.products": productDocs,
  "ecommerce.orders": orderDocs,
};

export function addDocuments(
  db: string,
  collection: string,
  docs: MongoDocument[],
): void {
  const key = `${db}.${collection}`;
  const existing = collectionDocuments[key] ?? getDocuments(db, collection);
  collectionDocuments[key] = [...docs, ...existing];
}

export function updateDocument(
  db: string,
  collection: string,
  id: string,
  updated: MongoDocument,
): void {
  const key = `${db}.${collection}`;
  const docs = collectionDocuments[key] ?? getDocuments(db, collection);
  const index = docs.findIndex((doc) => doc._id === id);
  if (index === -1) return;
  docs[index] = { ...updated, _id: id };
  collectionDocuments[key] = [...docs];
}

export function getDocuments(db: string, collection: string): MongoDocument[] {
  const key = `${db}.${collection}`;
  if (collectionDocuments[key]) return collectionDocuments[key];
  // Generate random docs for collections without specific mock data
  const count = Math.floor(Math.random() * 5) + 3;
  const docs: MongoDocument[] = [];
  for (let i = 0; i < count; i++) {
    docs.push({
      _id: `generated_${db}_${collection}_${i.toString().padStart(4, '0')}`,
      name: `Sample ${collection.slice(0, -1)} ${i + 1}`,
      status: ["active", "inactive", "pending"][i % 3],
      count: Math.floor(Math.random() * 1000),
      metadata: { source: "auto-generated", version: i + 1 },
      createdAt: { $date: new Date(2024, 0, i + 1).toISOString() },
    });
  }
  collectionDocuments[key] = docs;
  return docs;
}
