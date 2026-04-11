/** Normalize document _id to string (handles { $oid: "..." } or plain string). */
export function getDocumentId(doc: { _id?: unknown }): string {
  const id = doc._id;
  if (id === undefined || id === null) return "";
  if (typeof id === "object" && "$oid" in (id as object)) {
    const oid = (id as { $oid: string }).$oid;
    return typeof oid === "string" ? oid : "";
  }
  return String(id);
}
