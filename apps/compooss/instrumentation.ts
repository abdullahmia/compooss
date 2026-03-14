/**
 * Runs when the Next.js server starts. Validates that MONGO_URI is set.
 * Throws so the server does not start without a MongoDB connection string.
 */
export async function register() {
  const uri = process.env.MONGO_URI;
  if (!uri || typeof uri !== "string" || uri.trim() === "") {
    throw new Error(
      "MONGO_URI is required. Set the MONGO_URI environment variable in .env or your environment (e.g. MONGO_URI=mongodb://localhost:27017)."
    );
  }
}
