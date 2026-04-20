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

// ─── projecthub_dev factories ─────────────────────────────────────────────────

const ORG_NAMES = [
  "Acme Corp", "Stellar Labs", "Bright Minds", "Nova Systems", "Apex Digital",
  "CodeCraft", "Horizon Tech", "Pixel Studio",
];
const PROJECT_PREFIXES = ["Project", "Initiative", "Operation", "Mission", "Program"];
const TECH_WORDS = ["Apollo", "Orion", "Phoenix", "Titan", "Atlas", "Hermes", "Zeus", "Athena"];
const TASK_PRIORITIES = ["low", "medium", "high", "critical"];
const TASK_STATUSES = ["backlog", "todo", "in_progress", "in_review", "done", "cancelled"];
const SPRINT_STATUSES = ["planned", "active", "completed"];
const INTEGRATION_TYPES = ["github", "slack", "jira", "figma", "notion", "linear", "datadog", "pagerduty"];
const NOTIFICATION_TYPES = ["task_assigned", "comment_added", "mention", "due_date_reminder", "sprint_started", "milestone_reached"];
const ACTIVITY_VERBS = ["created", "updated", "deleted", "commented", "assigned", "closed", "reopened", "moved"];

function makeOrganization(i: number) {
  const name = i < ORG_NAMES.length ? ORG_NAMES[i] : `Org ${i + 1}`;
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return {
    _id: new ObjectId(),
    name,
    slug,
    domain: `${slug}.io`,
    plan: pick(["free", "starter", "pro", "enterprise"]),
    seats: randomInt(5, 200),
    settings: {
      defaultTimezone: pick(["UTC", "America/New_York", "Europe/London", "Asia/Tokyo"]),
      allowGuestAccess: Math.random() > 0.5,
      twoFactorRequired: Math.random() > 0.6,
    },
    billingEmail: `billing@${slug}.io`,
    createdAt: randomDate(2020, 2023),
    updatedAt: new Date(),
  };
}

function makeWorkspaceUser(i: number, organizationId: ObjectId) {
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  return {
    _id: new ObjectId(),
    organizationId,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@workspace.dev`,
    name: `${firstName} ${lastName}`,
    username: `${firstName.toLowerCase()}${i}`,
    avatar: `https://i.pravatar.cc/150?u=ws${i}`,
    role: pick(["owner", "admin", "member", "member", "member", "guest"]),
    jobTitle: pick(["Engineer", "Designer", "Product Manager", "QA Engineer", "DevOps", "Data Analyst", "Tech Lead"]),
    timezone: pick(["UTC", "America/New_York", "Europe/Berlin", "Asia/Singapore"]),
    isActive: Math.random() > 0.08,
    lastSeenAt: randomDate(2024, 2025),
    preferences: {
      emailNotifications: Math.random() > 0.3,
      theme: pick(["light", "dark", "system"]),
      language: pick(["en", "de", "fr", "ja"]),
    },
    createdAt: randomDate(2021, 2024),
  };
}

function makeTeamMember(userId: ObjectId, organizationId: ObjectId) {
  return {
    _id: new ObjectId(),
    userId,
    organizationId,
    role: pick(["owner", "admin", "member", "member", "guest"]),
    invitedBy: new ObjectId(),
    joinedAt: randomDate(2021, 2024),
    isActive: Math.random() > 0.05,
  };
}

function makeProject(organizationId: ObjectId, ownerId: ObjectId, i: number) {
  const name = `${pick(PROJECT_PREFIXES)} ${pick(TECH_WORDS)} ${i + 1}`;
  return {
    _id: new ObjectId(),
    organizationId,
    ownerId,
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.",
    status: pick(["active", "active", "active", "on_hold", "archived", "completed"]),
    visibility: pick(["private", "internal", "public"]),
    color: pick(["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"]),
    icon: pick(["rocket", "star", "bolt", "flame", "leaf", "gem"]),
    startDate: randomDate(2023, 2024),
    targetDate: randomDate(2024, 2025),
    completedAt: Math.random() > 0.7 ? randomDate(2024, 2025) : null,
    taskCount: 0,
    memberCount: 0,
    createdAt: randomDate(2022, 2024),
    updatedAt: new Date(),
  };
}

function makeProjectMember(userId: ObjectId, projectId: ObjectId) {
  return {
    _id: new ObjectId(),
    userId,
    projectId,
    role: pick(["lead", "contributor", "contributor", "viewer"]),
    joinedAt: randomDate(2022, 2024),
    notificationsEnabled: Math.random() > 0.3,
  };
}

function makeMilestone(projectId: ObjectId, i: number) {
  const dueDate = randomDate(2024, 2025);
  return {
    _id: new ObjectId(),
    projectId,
    title: `${pick(["v", "Release ", "Phase ", "Milestone "])}${i + 1}.0`,
    description: "Key deliverable checkpoint for the project roadmap.",
    status: pick(["open", "open", "in_progress", "completed"]),
    dueDate,
    completedAt: Math.random() > 0.6 ? dueDate : null,
    taskCount: 0,
    createdAt: randomDate(2023, 2024),
  };
}

function makeSprint(projectId: ObjectId, i: number) {
  const startDate = new Date(2024, Math.floor(i / 2), (i % 2) * 14 + 1);
  const endDate = new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000);
  const now = new Date();
  const status =
    endDate < now ? "completed" : startDate <= now ? "active" : "planned";
  return {
    _id: new ObjectId(),
    projectId,
    name: `Sprint ${i + 1}`,
    goal: pick([
      "Implement core authentication flow",
      "Complete dashboard redesign",
      "Performance optimisation pass",
      "API v2 migration",
      "Mobile responsiveness improvements",
      "Onboarding flow polish",
    ]),
    status,
    startDate,
    endDate,
    velocity: status === "completed" ? randomInt(20, 80) : null,
    capacity: randomInt(40, 100),
    createdAt: randomDate(2023, 2024),
  };
}

function makeLabel(projectId: ObjectId) {
  const name = pick(["bug", "feature", "improvement", "documentation", "security", "performance", "tech-debt", "ux", "infra", "blocked"]);
  const colors: Record<string, string> = {
    bug: "#ef4444", feature: "#6366f1", improvement: "#10b981",
    documentation: "#3b82f6", security: "#f59e0b", performance: "#8b5cf6",
    "tech-debt": "#6b7280", ux: "#ec4899", infra: "#14b8a6", blocked: "#dc2626",
  };
  return {
    _id: new ObjectId(),
    projectId,
    name,
    color: colors[name] ?? "#6b7280",
    description: `Issues tagged as ${name}`,
    createdAt: randomDate(2023, 2024),
  };
}

function makeTask(
  projectId: ObjectId,
  sprintId: ObjectId | null,
  milestoneId: ObjectId | null,
  assigneeId: ObjectId | null,
  reporterId: ObjectId,
  labelIds: ObjectId[],
  seqNum: number,
) {
  const status = pick(TASK_STATUSES);
  return {
    _id: new ObjectId(),
    projectId,
    sprintId,
    milestoneId,
    assigneeId,
    reporterId,
    labelIds: range(randomInt(0, 3)).map(() => pick(labelIds)),
    title: pick([
      "Implement OAuth2 login",
      "Fix pagination bug in list view",
      "Add dark mode support",
      "Write unit tests for auth module",
      "Migrate legacy endpoints to REST v2",
      "Improve search indexing performance",
      "Design new onboarding flow",
      "Set up CI/CD pipeline",
      "Refactor database connection pooling",
      "Add rate limiting middleware",
      "Create export to CSV feature",
      "Fix memory leak in worker process",
      "Update dependencies to latest versions",
      "Implement real-time notifications",
      "Add multi-language support",
    ]),
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    status,
    priority: pick(TASK_PRIORITIES),
    storyPoints: pick([1, 2, 3, 5, 8, 13, null]),
    sequenceNumber: seqNum,
    dueDate: Math.random() > 0.4 ? randomDate(2024, 2025) : null,
    completedAt: status === "done" ? randomDate(2024, 2025) : null,
    estimatedHours: randomInt(1, 40),
    loggedHours: randomInt(0, 30),
    position: randomInt(0, 1000),
    createdAt: randomDate(2023, 2024),
    updatedAt: new Date(),
  };
}

function makeSubtask(taskId: ObjectId, assigneeId: ObjectId | null) {
  return {
    _id: new ObjectId(),
    taskId,
    assigneeId,
    title: pick([
      "Write tests",
      "Update documentation",
      "Code review",
      "Deploy to staging",
      "QA sign-off",
      "Update changelog",
      "Security review",
      "Performance benchmark",
    ]),
    isCompleted: Math.random() > 0.5,
    completedAt: Math.random() > 0.5 ? randomDate(2024, 2025) : null,
    createdAt: randomDate(2024, 2025),
  };
}

function makeTaskComment(taskId: ObjectId, userId: ObjectId) {
  return {
    _id: new ObjectId(),
    taskId,
    userId,
    body: pick([
      "I've started working on this. Should be done by EOD.",
      "Found the root cause — it's a race condition in the event loop.",
      "Can we get a design review before merging?",
      "This is blocked by #234. Linking that ticket.",
      "PR is up: github.com/org/repo/pull/567",
      "Tested on staging, all good. Ready for prod.",
      "Let me know if you need more context on the requirements.",
      "@team please review when you get a chance.",
    ]),
    mentions: [],
    isEdited: Math.random() > 0.8,
    reactions: Math.random() > 0.5 ? [{ emoji: "👍", count: randomInt(1, 10) }] : [],
    createdAt: randomDate(2024, 2025),
    updatedAt: new Date(),
  };
}

function makeAttachment(taskId: ObjectId, uploadedBy: ObjectId) {
  const ext = pick(["png", "jpg", "pdf", "mp4", "zip", "csv", "docx", "sketch"]);
  return {
    _id: new ObjectId(),
    taskId,
    uploadedBy,
    fileName: `attachment-${randomInt(1000, 9999)}.${ext}`,
    fileType: ext,
    fileSize: randomInt(1024, 10 * 1024 * 1024),
    storageKey: `uploads/${new ObjectId().toString()}/${randomInt(1000, 9999)}.${ext}`,
    url: `https://storage.example.com/uploads/${randomInt(1000, 9999)}.${ext}`,
    createdAt: randomDate(2024, 2025),
  };
}

function makeTimeLog(taskId: ObjectId, userId: ObjectId) {
  const loggedAt = randomDate(2024, 2025);
  return {
    _id: new ObjectId(),
    taskId,
    userId,
    minutes: pick([15, 30, 45, 60, 90, 120, 180, 240]),
    description: pick([
      "Initial investigation",
      "Implementation",
      "Code review",
      "Testing",
      "Bug fix",
      "Documentation",
      "Deployment",
      "Meeting",
    ]),
    loggedAt,
    billingType: pick(["billable", "non-billable"]),
    createdAt: loggedAt,
  };
}

function makeNotification(userId: ObjectId, actorId: ObjectId) {
  const type = pick(NOTIFICATION_TYPES);
  return {
    _id: new ObjectId(),
    userId,
    actorId,
    type,
    title: pick([
      "You were assigned a new task",
      "Someone commented on your task",
      "You were mentioned in a comment",
      "A task is due tomorrow",
      "Sprint 4 has started",
      "Milestone v2.0 reached",
    ]),
    resourceType: pick(["task", "comment", "sprint", "milestone"]),
    resourceId: new ObjectId(),
    isRead: Math.random() > 0.4,
    readAt: Math.random() > 0.4 ? randomDate(2024, 2025) : null,
    createdAt: randomDate(2024, 2025),
  };
}

function makeActivityLog(organizationId: ObjectId, userId: ObjectId, projectId: ObjectId) {
  const verb = pick(ACTIVITY_VERBS);
  const resourceType = pick(["task", "comment", "project", "sprint", "milestone", "attachment"]);
  return {
    _id: new ObjectId(),
    organizationId,
    userId,
    projectId,
    verb,
    resourceType,
    resourceId: new ObjectId(),
    description: `User ${verb} a ${resourceType}`,
    metadata: {
      ip: `${randomInt(1, 255)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`,
      userAgent: "Mozilla/5.0",
    },
    createdAt: randomDate(2024, 2025),
  };
}

function makeIntegration(organizationId: ObjectId, createdBy: ObjectId) {
  const type = pick(INTEGRATION_TYPES);
  return {
    _id: new ObjectId(),
    organizationId,
    createdBy,
    type,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} Integration`,
    isEnabled: Math.random() > 0.2,
    config: {
      webhookUrl: `https://hooks.${type}.com/services/${new ObjectId().toString()}`,
      channelOrRepo: pick(["#engineering", "#alerts", "org/repo", "workspace"]),
      syncEnabled: Math.random() > 0.4,
    },
    lastSyncedAt: Math.random() > 0.5 ? randomDate(2024, 2025) : null,
    errorCount: randomInt(0, 5),
    createdAt: randomDate(2022, 2024),
    updatedAt: new Date(),
  };
}

// ─── analytics factories ───────────────────────────────────────────────────────
const EVENT_TYPES = ["page_view", "click", "form_submit", "video_play", "purchase", "signup", "login", "search"];
const BROWSERS = ["Chrome", "Firefox", "Safari", "Edge", "Opera"];
const PLATFORMS = ["Windows", "macOS", "Linux", "iOS", "Android"];
const PAGES = ["/", "/products", "/about", "/contact", "/blog", "/pricing", "/docs"];

function makeSession(i: number) {
  const start = randomDate(2024, 2025);
  const durationSec = randomInt(10, 3600);
  return {
    _id: new ObjectId(),
    sessionId: `sess_${new ObjectId().toHexString()}`,
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
    console.log("Dropping existing databases…");
    await Promise.all([
      client.db("ecommerce_dev").dropDatabase(),
      client.db("blog_dev").dropDatabase(),
      client.db("analytics_dev").dropDatabase(),
      client.db("projecthub_dev").dropDatabase(),
    ]);
    console.log("Dropped.\n");

    console.log("Seeding ecommerce_dev…");
    const ecomm = client.db("ecommerce_dev");


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

    console.log("\nSeeding projecthub_dev…");
    const hub = client.db("projecthub_dev");


    // organizations (8)
    const orgs = range(8).map((i) => makeOrganization(i));
    await hub.collection("organizations").insertMany(orgs);
    console.log(`  ✓ ${orgs.length} organizations`);

    // users — ~12 per org = ~96 total
    const hubUsers = orgs.flatMap((org) =>
      range(randomInt(8, 14)).map((i) => makeWorkspaceUser(i, org._id)),
    );
    await hub.collection("users").insertMany(hubUsers);
    console.log(`  ✓ ${hubUsers.length} users`);

    // team_members — join table
    const teamMembers = hubUsers.map((u) => makeTeamMember(u._id, u.organizationId));
    await hub.collection("team_members").insertMany(teamMembers);
    console.log(`  ✓ ${teamMembers.length} team_members`);

    // projects — 2-3 per org = ~20 total
    const projects = orgs.flatMap((org) => {
      const orgUsers = hubUsers.filter((u) => u.organizationId.equals(org._id));
      return range(randomInt(2, 3)).map((i) =>
        makeProject(org._id, pick(orgUsers)._id, i),
      );
    });
    await hub.collection("projects").insertMany(projects);
    console.log(`  ✓ ${projects.length} projects`);

    // project_members — 3-8 members per project
    const projectMembers = projects.flatMap((proj) => {
      const orgUsers = hubUsers.filter((u) => u.organizationId.equals(proj.organizationId));
      const sample = orgUsers.slice(0, randomInt(3, Math.min(8, orgUsers.length)));
      return sample.map((u) => makeProjectMember(u._id, proj._id));
    });
    await hub.collection("project_members").insertMany(projectMembers);
    console.log(`  ✓ ${projectMembers.length} project_members`);

    // milestones — 2-4 per project
    const milestones = projects.flatMap((proj) =>
      range(randomInt(2, 4)).map((i) => makeMilestone(proj._id, i)),
    );
    await hub.collection("milestones").insertMany(milestones);
    console.log(`  ✓ ${milestones.length} milestones`);

    // sprints — 3-5 per project
    const sprints = projects.flatMap((proj) =>
      range(randomInt(3, 5)).map((i) => makeSprint(proj._id, i)),
    );
    await hub.collection("sprints").insertMany(sprints);
    console.log(`  ✓ ${sprints.length} sprints`);

    // labels — 4-8 per project
    const labels = projects.flatMap((proj) =>
      range(randomInt(4, 8)).map(() => makeLabel(proj._id)),
    );
    await hub.collection("labels").insertMany(labels);
    console.log(`  ✓ ${labels.length} labels`);

    // tasks — 15-30 per project
    let taskSeq = 1;
    const tasks = projects.flatMap((proj) => {
      const projSprints = sprints.filter((s) => s.projectId.equals(proj._id));
      const projMilestones = milestones.filter((m) => m.projectId.equals(proj._id));
      const projMembers = projectMembers.filter((pm) => pm.projectId.equals(proj._id));
      const projLabels = labels.filter((l) => l.projectId.equals(proj._id));
      const memberUserIds = projMembers.map((pm) => pm.userId);
      return range(randomInt(15, 30)).map(() => {
        const assigneeId = Math.random() > 0.15 ? pick(memberUserIds) : null;
        const reporterUser = pick(hubUsers.filter((u) => u.organizationId.equals(proj.organizationId)));
        return makeTask(
          proj._id,
          Math.random() > 0.2 ? pick(projSprints)._id : null,
          Math.random() > 0.5 ? pick(projMilestones)._id : null,
          assigneeId,
          reporterUser._id,
          projLabels.map((l) => l._id),
          taskSeq++,
        );
      });
    });
    await hub.collection("tasks").insertMany(tasks);
    console.log(`  ✓ ${tasks.length} tasks`);

    // subtasks — 0-3 per task
    const subtasks = tasks.flatMap((task) =>
      range(randomInt(0, 3)).map(() => {
        const proj = projects.find((p) => p._id.equals(task.projectId))!;
        const orgUsers = hubUsers.filter((u) => u.organizationId.equals(proj.organizationId));
        return makeSubtask(task._id, Math.random() > 0.2 ? pick(orgUsers)._id : null);
      }),
    );
    if (subtasks.length) await hub.collection("subtasks").insertMany(subtasks);
    console.log(`  ✓ ${subtasks.length} subtasks`);

    // comments — 0-5 per task
    const taskComments = tasks.flatMap((task) => {
      const proj = projects.find((p) => p._id.equals(task.projectId))!;
      const orgUsers = hubUsers.filter((u) => u.organizationId.equals(proj.organizationId));
      return range(randomInt(0, 5)).map(() =>
        makeTaskComment(task._id, pick(orgUsers)._id),
      );
    });
    if (taskComments.length) await hub.collection("comments").insertMany(taskComments);
    console.log(`  ✓ ${taskComments.length} comments`);

    // attachments — sparse, ~20% of tasks
    const attachments = tasks
      .filter(() => Math.random() > 0.8)
      .flatMap((task) => {
        const proj = projects.find((p) => p._id.equals(task.projectId))!;
        const orgUsers = hubUsers.filter((u) => u.organizationId.equals(proj.organizationId));
        return range(randomInt(1, 3)).map(() =>
          makeAttachment(task._id, pick(orgUsers)._id),
        );
      });
    if (attachments.length) await hub.collection("attachments").insertMany(attachments);
    console.log(`  ✓ ${attachments.length} attachments`);

    // time_logs — 0-4 per task
    const timeLogs = tasks.flatMap((task) => {
      const proj = projects.find((p) => p._id.equals(task.projectId))!;
      const orgUsers = hubUsers.filter((u) => u.organizationId.equals(proj.organizationId));
      return range(randomInt(0, 4)).map(() =>
        makeTimeLog(task._id, pick(orgUsers)._id),
      );
    });
    if (timeLogs.length) await hub.collection("time_logs").insertMany(timeLogs);
    console.log(`  ✓ ${timeLogs.length} time_logs`);

    // notifications — 3-10 per user
    const notifications = hubUsers.flatMap((user) =>
      range(randomInt(3, 10)).map(() => {
        const actor = pick(hubUsers.filter((u) => !u._id.equals(user._id)));
        return makeNotification(user._id, actor._id);
      }),
    );
    await hub.collection("notifications").insertMany(notifications);
    console.log(`  ✓ ${notifications.length} notifications`);

    // activity_logs — 5-15 per project
    const activityLogs = projects.flatMap((proj) => {
      const orgUsers = hubUsers.filter((u) => u.organizationId.equals(proj.organizationId));
      return range(randomInt(5, 15)).map(() =>
        makeActivityLog(proj.organizationId, pick(orgUsers)._id, proj._id),
      );
    });
    await hub.collection("activity_logs").insertMany(activityLogs);
    console.log(`  ✓ ${activityLogs.length} activity_logs`);

    // integrations — 1-4 per org
    const integrations = orgs.flatMap((org) => {
      const orgUsers = hubUsers.filter((u) => u.organizationId.equals(org._id));
      return range(randomInt(1, 4)).map(() =>
        makeIntegration(org._id, pick(orgUsers)._id),
      );
    });
    await hub.collection("integrations").insertMany(integrations);
    console.log(`  ✓ ${integrations.length} integrations`);

    // Indexes
    await hub.collection("users").createIndex({ organizationId: 1 });
    await hub.collection("users").createIndex({ email: 1 });
    await hub.collection("projects").createIndex({ organizationId: 1 });
    await hub.collection("sprints").createIndex({ projectId: 1 });
    await hub.collection("tasks").createIndex({ projectId: 1 });
    await hub.collection("tasks").createIndex({ sprintId: 1 });
    await hub.collection("tasks").createIndex({ assigneeId: 1 });
    await hub.collection("comments").createIndex({ taskId: 1 });
    await hub.collection("time_logs").createIndex({ taskId: 1 });
    await hub.collection("notifications").createIndex({ userId: 1, isRead: 1 });
    await hub.collection("activity_logs").createIndex({ organizationId: 1, createdAt: -1 });

    console.log("\nDone! Seeded databases:");
    console.log("  • ecommerce_dev  — users, products, orders, reviews");
    console.log("  • blog_dev       — authors, posts, comments");
    console.log("  • analytics_dev  — sessions, events, daily_metrics");
    console.log("  • projecthub_dev — organizations, users, team_members, projects, project_members,");
    console.log("                     milestones, sprints, labels, tasks, subtasks, comments,");
    console.log("                     attachments, time_logs, notifications, activity_logs, integrations");
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
