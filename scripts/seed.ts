/**
 * Development seed script — populates a local MongoDB instance with
 * realistic dummy data across multiple databases so you can test the
 * Compooss GUI without needing a real dataset.
 *
 * Usage:
 *   bun run db:seed
 *
 * Override the default URI:
 *   MONGODB_URI=mongodb://... bun run db:seed
 */

import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI =
  process.env.MONGODB_URI ??
  "mongodb://root:example@localhost:27017/?authSource=admin";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function range(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(startYear = 2022, endYear = 2025): Date {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  return new Date(start + Math.random() * (end - start));
}

function randomPrice(min = 5, max = 500): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

const FIRST_NAMES = [
  "Alice", "Bob", "Carol", "Dave", "Eve", "Frank", "Grace", "Hank",
  "Ivy", "Jack", "Karen", "Leo", "Mia", "Nate", "Olivia", "Pete",
  "Quinn", "Rose", "Sam", "Tina",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
  "Davis", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson",
  "White", "Harris", "Martin", "Thompson", "Young", "Lee",
];

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Japan", "Brazil", "India", "Mexico",
];

const CATEGORIES = [
  "Electronics", "Clothing", "Books", "Home & Garden", "Sports",
  "Toys", "Beauty", "Automotive", "Food & Grocery", "Office Supplies",
];

const TAGS = [
  "sale", "new-arrival", "bestseller", "limited", "eco-friendly",
  "handmade", "premium", "refurbished", "exclusive", "trending",
];

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"];
const PAYMENT_METHODS = ["credit_card", "debit_card", "paypal", "bank_transfer", "crypto"];

function makeUser(i: number) {
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  const joined = randomDate(2020, 2024);
  return {
    _id: new ObjectId(),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
    name: { first: firstName, last: lastName },
    phone: `+1-${randomInt(200, 999)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
    address: {
      street: `${randomInt(1, 9999)} ${pick(["Main", "Oak", "Maple", "Cedar", "Elm"])} St`,
      city: pick(["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"]),
      state: pick(["NY", "CA", "IL", "TX", "AZ"]),
      zip: String(randomInt(10000, 99999)),
      country: pick(COUNTRIES),
    },
    role: pick(["customer", "customer", "customer", "admin", "moderator"]),
    isActive: Math.random() > 0.1,
    loyaltyPoints: randomInt(0, 5000),
    joinedAt: joined,
    updatedAt: new Date(),
  };
}

function makeProduct(i: number) {
  const category = pick(CATEGORIES);
  const name = `${pick(["Pro", "Ultra", "Lite", "Max", "Mini"])} ${category} Item ${i + 1}`;
  return {
    _id: new ObjectId(),
    sku: `SKU-${String(i + 1).padStart(5, "0")}`,
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    description: `High-quality ${category.toLowerCase()} product. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    category,
    tags: range(randomInt(1, 4)).map(() => pick(TAGS)),
    price: randomPrice(5, 999),
    compareAtPrice: Math.random() > 0.5 ? randomPrice(10, 1200) : null,
    stock: randomInt(0, 500),
    images: range(randomInt(1, 4)).map((_, idx) => ({
      url: `https://picsum.photos/seed/${i}-${idx}/400/400`,
      alt: `${name} image ${idx + 1}`,
      isPrimary: idx === 0,
    })),
    rating: { average: parseFloat((Math.random() * 2 + 3).toFixed(1)), count: randomInt(0, 2000) },
    isPublished: Math.random() > 0.15,
    createdAt: randomDate(2021, 2024),
    updatedAt: new Date(),
  };
}

function makeOrder(userId: ObjectId, productIds: ObjectId[]) {
  const itemCount = randomInt(1, 5);
  const items = range(itemCount).map(() => {
    const qty = randomInt(1, 4);
    const price = randomPrice();
    return {
      productId: pick(productIds),
      quantity: qty,
      unitPrice: price,
      total: parseFloat((qty * price).toFixed(2)),
    };
  });
  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const shipping = parseFloat((Math.random() * 20 + 2).toFixed(2));
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  return {
    _id: new ObjectId(),
    orderNumber: `ORD-${Date.now()}-${randomInt(1000, 9999)}`,
    userId,
    items,
    subtotal: parseFloat(subtotal.toFixed(2)),
    shipping,
    tax,
    total: parseFloat((subtotal + shipping + tax).toFixed(2)),
    currency: "USD",
    status: pick(ORDER_STATUSES),
    paymentMethod: pick(PAYMENT_METHODS),
    shippingAddress: {
      street: `${randomInt(1, 9999)} Delivery Ave`,
      city: pick(["New York", "Los Angeles", "Chicago"]),
      zip: String(randomInt(10000, 99999)),
      country: "United States",
    },
    notes: Math.random() > 0.7 ? "Please leave at the door." : null,
    placedAt: randomDate(2023, 2025),
    updatedAt: new Date(),
  };
}

function makeReview(userId: ObjectId, productId: ObjectId) {
  const rating = randomInt(1, 5);
  return {
    _id: new ObjectId(),
    userId,
    productId,
    rating,
    title: pick([
      "Great product!", "Not what I expected", "Excellent quality",
      "Would recommend", "Could be better", "Amazing value", "Disappointed",
    ]),
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
    isVerifiedPurchase: Math.random() > 0.3,
    helpfulVotes: randomInt(0, 200),
    status: pick(["published", "published", "published", "pending", "rejected"]),
    createdAt: randomDate(2023, 2025),
  };
}

const POST_STATUSES = ["draft", "published", "archived"];
const BLOG_CATEGORIES = ["Technology", "Design", "Business", "Lifestyle", "Travel", "Food", "Health"];

function makeAuthor(i: number) {
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  return {
    _id: new ObjectId(),
    name: `${firstName} ${lastName}`,
    slug: `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${i}`,
    email: `author${i}@blog.example.com`,
    bio: "Passionate writer and thinker. Covering topics from tech to travel.",
    avatar: `https://i.pravatar.cc/150?u=${i}`,
    social: {
      twitter: `@${firstName.toLowerCase()}${i}`,
      linkedin: `linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
    },
    postCount: 0,
    joinedAt: randomDate(2019, 2023),
  };
}

function makePost(authorId: ObjectId, i: number) {
  const category = pick(BLOG_CATEGORIES);
  const title = `${pick(["How to", "Why", "The Ultimate Guide to", "Understanding", "A Deep Dive into"])} ${category} in ${randomInt(2023, 2025)}`;
  const status = pick(POST_STATUSES);
  return {
    _id: new ObjectId(),
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + `-${i}`,
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.",
    body: `# ${title}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n## Section 1\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n## Section 2\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
    authorId,
    category,
    tags: range(randomInt(2, 5)).map(() => pick(["javascript", "mongodb", "nextjs", "react", "typescript", "css", "ux", "performance"])),
    status,
    featuredImage: `https://picsum.photos/seed/post-${i}/1200/630`,
    readingTimeMinutes: randomInt(2, 20),
    views: randomInt(0, 50000),
    likes: randomInt(0, 5000),
    seo: {
      metaTitle: title,
      metaDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    publishedAt: status === "published" ? randomDate(2022, 2025) : null,
    createdAt: randomDate(2021, 2024),
    updatedAt: new Date(),
  };
}

function makeComment(postId: ObjectId, authorName: string) {
  return {
    _id: new ObjectId(),
    postId,
    author: { name: authorName, email: `${authorName.toLowerCase().replace(" ", ".")}@example.com` },
    body: pick([
      "Great article, very informative!",
      "I disagree with your point about this topic.",
      "Can you elaborate more on this?",
      "This helped me solve my problem, thanks!",
      "Looking forward to more content like this.",
      "Shared this with my team — super useful.",
    ]),
    parentId: null,
    likes: randomInt(0, 100),
    isApproved: Math.random() > 0.2,
    createdAt: randomDate(2022, 2025),
  };
}

const EVENT_TYPES = ["page_view", "click", "form_submit", "video_play", "purchase", "signup", "login", "search"];
const BROWSERS = ["Chrome", "Firefox", "Safari", "Edge", "Opera"];
const PLATFORMS = ["Windows", "macOS", "Linux", "iOS", "Android"];
const PAGES = ["/", "/products", "/about", "/contact", "/blog", "/pricing", "/docs"];

function makeSession(i: number) {
  const start = randomDate(2024, 2025);
  const durationSec = randomInt(10, 3600);
  return {
    _id: new ObjectId(),
    sessionId: `sess_${ObjectId.generate().toString()}`,
    userId: Math.random() > 0.4 ? `user_${randomInt(1, 200)}` : null,
    ip: `${randomInt(1, 255)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`,
    userAgent: `Mozilla/5.0 (${pick(PLATFORMS)}) ${pick(BROWSERS)}/${randomInt(90, 120)}.0`,
    device: {
      browser: pick(BROWSERS),
      platform: pick(PLATFORMS),
      isMobile: Math.random() > 0.55,
    },
    geo: {
      country: pick(COUNTRIES),
      city: pick(["London", "New York", "Tokyo", "Berlin", "Sydney"]),
    },
    entryPage: pick(PAGES),
    exitPage: pick(PAGES),
    pageViews: randomInt(1, 20),
    durationSeconds: durationSec,
    isBot: Math.random() > 0.95,
    startedAt: start,
    endedAt: new Date(start.getTime() + durationSec * 1000),
  };
}

function makeEvent(sessionId: string) {
  return {
    _id: new ObjectId(),
    sessionId,
    type: pick(EVENT_TYPES),
    page: pick(PAGES),
    properties: {
      element: pick(["header-cta", "nav-link", "product-card", "footer-link", null]),
      value: Math.random() > 0.5 ? randomPrice(1, 200) : null,
      query: Math.random() > 0.7 ? pick(["mongodb gui", "nextjs", "react hooks", "typescript"]) : null,
    },
    timestamp: randomDate(2024, 2025),
  };
}

function makeDailyMetric(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(0, 0, 0, 0);
  return {
    _id: new ObjectId(),
    date,
    sessions: randomInt(100, 5000),
    pageViews: randomInt(500, 25000),
    uniqueUsers: randomInt(80, 4000),
    bounceRate: parseFloat((Math.random() * 0.6 + 0.2).toFixed(3)),
    avgSessionDuration: randomInt(30, 600),
    conversions: randomInt(0, 200),
    revenue: parseFloat((Math.random() * 10000).toFixed(2)),
    topPages: PAGES.slice(0, 5).map((page) => ({ page, views: randomInt(50, 5000) })),
    topCountries: COUNTRIES.slice(0, 5).map((country) => ({ country, sessions: randomInt(10, 1000) })),
  };
}

async function seed() {
  console.log("Connecting to MongoDB…");
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  console.log("Connected.\n");

  try {
     console.log("Seeding ecommerce_dev…");
    const ecomm = client.db("ecommerce_dev");

    await ecomm.dropDatabase();

    const users = range(50).map((i) => makeUser(i));
    const products = range(80).map((i) => makeProduct(i));

    await ecomm.collection("users").insertMany(users);
    console.log(`  ✓ ${users.length} users`);

    await ecomm.collection("products").insertMany(products);
    console.log(`  ✓ ${products.length} products`);

    const productIds = products.map((p) => p._id);
    const orders = users.flatMap((u) =>
      range(randomInt(0, 5)).map(() => makeOrder(u._id, productIds)),
    );
    await ecomm.collection("orders").insertMany(orders);
    console.log(`  ✓ ${orders.length} orders`);

    const reviews = users.flatMap((u) =>
      range(randomInt(0, 3)).map(() => makeReview(u._id, pick(productIds))),
    );
    if (reviews.length > 0) {
      await ecomm.collection("reviews").insertMany(reviews);
    }
    console.log(`  ✓ ${reviews.length} reviews`);

    // Indexes
    await ecomm.collection("users").createIndex({ email: 1 }, { unique: true });
    await ecomm.collection("products").createIndex({ sku: 1 }, { unique: true });
    await ecomm.collection("products").createIndex({ category: 1 });
    await ecomm.collection("orders").createIndex({ userId: 1 });
    await ecomm.collection("orders").createIndex({ status: 1 });

    console.log("\nSeeding blog_dev…");
    const blog = client.db("blog_dev");

    await blog.dropDatabase();

    const authors = range(10).map((i) => makeAuthor(i));
    await blog.collection("authors").insertMany(authors);
    console.log(`  ✓ ${authors.length} authors`);

    const authorIds = authors.map((a) => a._id);
    const posts = range(60).map((i) => makePost(pick(authorIds), i));
    await blog.collection("posts").insertMany(posts);
    console.log(`  ✓ ${posts.length} posts`);

    const comments = posts.flatMap((p) =>
      range(randomInt(0, 10)).map(() =>
        makeComment(p._id, `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`),
      ),
    );
    if (comments.length > 0) {
      await blog.collection("comments").insertMany(comments);
    }
    console.log(`  ✓ ${comments.length} comments`);

    // Update post counts on authors
    for (const author of authors) {
      const count = posts.filter((p) => p.authorId.equals(author._id)).length;
      await blog.collection("authors").updateOne({ _id: author._id }, { $set: { postCount: count } });
    }

    await blog.collection("posts").createIndex({ slug: 1 }, { unique: true });
    await blog.collection("posts").createIndex({ authorId: 1 });
    await blog.collection("posts").createIndex({ status: 1 });
    await blog.collection("comments").createIndex({ postId: 1 });

    console.log("\nSeeding analytics_dev…");
    const analytics = client.db("analytics_dev");

    await analytics.dropDatabase();

    const sessions = range(200).map((i) => makeSession(i));
    await analytics.collection("sessions").insertMany(sessions);
    console.log(`  ✓ ${sessions.length} sessions`);

    const events = sessions.flatMap((s) =>
      range(randomInt(1, 8)).map(() => makeEvent(s.sessionId)),
    );
    await analytics.collection("events").insertMany(events);
    console.log(`  ✓ ${events.length} events`);

    const metrics = range(90).map((i) => makeDailyMetric(i));
    await analytics.collection("daily_metrics").insertMany(metrics);
    console.log(`  ✓ ${metrics.length} daily metric records (last 90 days)`);

    await analytics.collection("sessions").createIndex({ sessionId: 1 }, { unique: true });
    await analytics.collection("sessions").createIndex({ startedAt: -1 });
    await analytics.collection("events").createIndex({ sessionId: 1 });
    await analytics.collection("events").createIndex({ type: 1 });
    await analytics.collection("daily_metrics").createIndex({ date: -1 }, { unique: true });

    console.log("\nDone! Seeded databases:");
    console.log("  • ecommerce_dev  — users, products, orders, reviews");
    console.log("  • blog_dev       — authors, posts, comments");
    console.log("  • analytics_dev  — sessions, events, daily_metrics");
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
