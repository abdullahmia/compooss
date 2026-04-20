/** Normalize document _id to string (handles { $oid: "..." } or plain string). */
/** Normalize document _id to string (handles { $oid: "..." } or plain string). */
export function getDocumentId(doc: { _id?: unknown }, index?: number): string {
  const id = doc._id;

  // handle undefined or null _id by generating a temporary id based on the index
  if (id === undefined || id === null) {
    return index !== undefined ? `temp-id-${index}` : "";
  }

  // handle MongoDB ObjectId format { $oid: "..." }
  if (typeof id === "object" && id !== null && "$oid" in (id as object)) {
    const oid = (id as { $oid: string }).$oid;
    if (typeof oid === "string" && oid.length > 0) return oid;
  }

  // Handle cases where String(id) might result in "[object Object]"
  const stringified = String(id);
  if (stringified === "[object Object]") {
    return index !== undefined ? `obj-id-${index}` : "";
  }

  return stringified;
}
