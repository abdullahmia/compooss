# MongoDB Shell

The built-in shell lets you run MongoDB commands directly against your connected database without leaving the app. It supports the same syntax as the official `mongosh` REPL for common operations.

---

## Opening and Closing

- Click the **terminal icon** in the top-bar to toggle the shell open or closed.
- Click the shell card on the **Welcome** screen.
- Press the **✕** button in the shell toolbar to close.
- The shell **remembers your session** (current database, output history, command history) across page reloads via `localStorage`.

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Enter` | Execute the current command |
| `Shift + Enter` | Insert a newline (multi-line command) |
| `↑` (Up Arrow) | Navigate to the previous command in history |
| `↓` (Down Arrow) | Navigate to the next command in history |

---

## Shell Commands

### Database navigation

```
show dbs               List all databases with their sizes
show databases         Alias for show dbs
use mydb               Switch the active database to "mydb"
db                     Print the name of the current database
```

### Collection info

```
show collections       List all collections in the current database
show users             List users defined in the current database
show roles             List roles (including built-in roles)
show profile           Show the 5 most recent profiling entries
show logs              Show the global server log
```

### Shell utilities

```
help                   Print command reference
cls                    Clear the shell output
clear                  Alias for cls
exit                   Instructions to close the shell panel
```

---

## Querying Documents

```js
// Find all documents (capped at 100 results)
db.users.find()

// Find with a filter
db.users.find({ age: { $gt: 18 } })

// Find with filter and projection (show only name and email)
db.users.find({ active: true }, { name: 1, email: 1, _id: 0 })

// Find a single document
db.users.findOne({ email: "alice@example.com" })

// Count documents
db.users.countDocuments({ active: true })

// Estimated total count (fast, no filter)
db.users.estimatedDocumentCount()

// Find distinct values for a field
db.users.distinct("country")
db.users.distinct("status", { active: true })
```

---

## Inserting Documents

```js
// Insert one document
db.users.insertOne({ name: "Alice", age: 30, active: true })

// Insert multiple documents
db.users.insertMany([
  { name: "Bob", age: 25 },
  { name: "Carol", age: 28 }
])
```

---

## Updating Documents

```js
// Update a single matching document
db.users.updateOne(
  { name: "Alice" },
  { $set: { age: 31 } }
)

// Update all matching documents
db.users.updateMany(
  { active: false },
  { $set: { archived: true } }
)

// Upsert (insert if not found)
db.users.updateOne(
  { email: "new@example.com" },
  { $set: { name: "New User" } },
  { upsert: true }
)

// Replace the entire document
db.users.replaceOne(
  { _id: ObjectId("507f1f77bcf86cd799439011") },
  { name: "Alice", age: 32, active: true }
)

// Find, update, and return the updated document
db.users.findOneAndUpdate(
  { name: "Alice" },
  { $inc: { age: 1 } },
  { returnDocument: "after" }
)
```

---

## Deleting Documents

```js
// Delete one matching document
db.users.deleteOne({ name: "Bob" })

// Delete all matching documents
db.users.deleteMany({ active: false })

// Find and delete, returning the deleted document
db.users.findOneAndDelete({ name: "Carol" })
```

---

## Aggregation

```js
// Group and count
db.orders.aggregate([
  { $group: { _id: "$status", total: { $sum: 1 } } },
  { $sort: { total: -1 } }
])

// Filter, project, and limit
db.users.aggregate([
  { $match: { active: true } },
  { $project: { name: 1, email: 1 } },
  { $limit: 10 }
])

// Lookup (join)
db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  }
])
```

---

## Indexes

```js
// List all indexes on a collection
db.users.getIndexes()

// Create an ascending index on a field
db.users.createIndex({ email: 1 })

// Create a unique index
db.users.createIndex({ email: 1 }, { unique: true })

// Create a compound index
db.users.createIndex({ country: 1, age: -1 })

// Create multiple indexes at once
db.users.createIndexes([
  { key: { email: 1 }, unique: true },
  { key: { createdAt: -1 } }
])

// Drop a named index
db.users.dropIndex("email_1")

// Drop all indexes (except _id)
db.users.dropIndexes()
```

---

## Collection Management

```js
// Drop a collection
db.logs.drop()

// Rename a collection
db.logs.renameCollection("audit_logs")

// Collection statistics
db.users.stats()

// List collection names in the current database
db.getCollectionNames()

// Create a collection explicitly (optional — insert also creates it)
db.createCollection("events")
```

---

## Bulk Operations

```js
db.users.bulkWrite([
  { insertOne: { document: { name: "Dave", age: 22 } } },
  { updateOne: { filter: { name: "Alice" }, update: { $set: { age: 32 } } } },
  { deleteOne: { filter: { name: "Bob" } } }
])
```

---

## Database & Server Admin

```js
// Database statistics
db.stats()

// Server status
db.serverStatus()

// Host information
db.hostInfo()

// Current running operations
db.currentOp()

// Kill an operation by opid
db.killOp(12345)

// Drop the current database (⚠ irreversible)
db.dropDatabase()

// Run an arbitrary database command
db.runCommand({ ping: 1 })

// Run an admin-level command
db.adminCommand({ listDatabases: 1 })

// Get the current connection URI (password masked)
db.getMongo()

// Get the current database name
db.getName()

// List collection metadata
db.getCollectionInfos()
```

---

## Special BSON Types

```js
// ObjectId
db.users.findOne({ _id: ObjectId("507f1f77bcf86cd799439011") })

// Date
db.events.find({ createdAt: { $gte: ISODate("2024-01-01") } })

// Current date
db.logs.insertOne({ event: "login", ts: ISODate() })

// NumberLong (64-bit integer)
db.counters.insertOne({ value: NumberLong(9007199254740993) })

// NumberDecimal (high-precision decimal)
db.prices.insertOne({ amount: NumberDecimal("19.99") })
```

---

## Multi-line Commands

Use `Shift + Enter` to write commands across multiple lines:

```js
db.orders.aggregate([
  { $match: { status: "pending" } },
  { $group: {
      _id: "$customerId",
      total: { $sum: "$amount" }
  }},
  { $sort: { total: -1 } },
  { $limit: 5 }
])
```

The shell detects unbalanced brackets and will return an error rather than executing an incomplete command.

---

## Autocomplete

Type `db.` to see available collections and database methods. Type `db.myCollection.` to see all collection methods. Completions are context-aware and update automatically after you switch databases with `use <db>`.

---

## Notes

- `find()` results are capped at **100 documents**. Use `aggregate` with `$limit` for larger result sets or pagination.
- Execution time is shown in milliseconds below each result.
- Use the **copy button** in the toolbar to copy the last result to the clipboard.
- Command history stores the last **100 commands** and persists across sessions.
- Output buffer stores the last **200 entries** in `localStorage`.
