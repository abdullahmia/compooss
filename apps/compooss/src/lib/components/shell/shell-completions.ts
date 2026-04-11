import type { editor, languages, IRange } from "monaco-editor";

const SHELL_HELPERS: languages.CompletionItem[] = [
  { label: "show dbs", kind: 1, insertText: "show dbs", detail: "List all databases" },
  { label: "show databases", kind: 1, insertText: "show databases", detail: "List all databases" },
  { label: "show collections", kind: 1, insertText: "show collections", detail: "List collections in current db" },
  { label: "show users", kind: 1, insertText: "show users", detail: "List users in current db" },
  { label: "show roles", kind: 1, insertText: "show roles", detail: "List roles in current db" },
  { label: "show profile", kind: 1, insertText: "show profile", detail: "Show recent profiling data" },
  { label: "show logs", kind: 1, insertText: "show logs", detail: "Show server logs" },
  { label: "use", kind: 1, insertText: "use ${1:dbName}", insertTextRules: 4, detail: "Switch database" },
  { label: "help", kind: 1, insertText: "help", detail: "Show shell help" },
  { label: "cls", kind: 1, insertText: "cls", detail: "Clear shell output" },
  { label: "clear", kind: 1, insertText: "clear", detail: "Clear shell output" },
  { label: "db", kind: 5, insertText: "db", detail: "Current database reference" },
  { label: "exit", kind: 1, insertText: "exit", detail: "Close the shell" },
] as unknown as languages.CompletionItem[];

const COLLECTION_METHODS: languages.CompletionItem[] = [
  { label: "find", kind: 0, insertText: "find(${1:{}})", insertTextRules: 4, detail: "Query documents" },
  { label: "findOne", kind: 0, insertText: "findOne(${1:{}})", insertTextRules: 4, detail: "Find a single document" },
  { label: "insertOne", kind: 0, insertText: "insertOne(${1:{}})", insertTextRules: 4, detail: "Insert a document" },
  { label: "insertMany", kind: 0, insertText: "insertMany([${1:{}}])", insertTextRules: 4, detail: "Insert multiple documents" },
  { label: "updateOne", kind: 0, insertText: "updateOne(${1:{}}, ${2:{$$set: {}}})", insertTextRules: 4, detail: "Update a document" },
  { label: "updateMany", kind: 0, insertText: "updateMany(${1:{}}, ${2:{$$set: {}}})", insertTextRules: 4, detail: "Update multiple documents" },
  { label: "replaceOne", kind: 0, insertText: "replaceOne(${1:{}}, ${2:{}})", insertTextRules: 4, detail: "Replace a document" },
  { label: "deleteOne", kind: 0, insertText: "deleteOne(${1:{}})", insertTextRules: 4, detail: "Delete a document" },
  { label: "deleteMany", kind: 0, insertText: "deleteMany(${1:{}})", insertTextRules: 4, detail: "Delete multiple documents" },
  { label: "countDocuments", kind: 0, insertText: "countDocuments(${1:{}})", insertTextRules: 4, detail: "Count documents" },
  { label: "estimatedDocumentCount", kind: 0, insertText: "estimatedDocumentCount()", detail: "Estimated document count" },
  { label: "distinct", kind: 0, insertText: "distinct(\"${1:field}\")", insertTextRules: 4, detail: "Find distinct values" },
  { label: "aggregate", kind: 0, insertText: "aggregate([${1}])", insertTextRules: 4, detail: "Run aggregation pipeline" },
  { label: "createIndex", kind: 0, insertText: "createIndex(${1:{field: 1}})", insertTextRules: 4, detail: "Create an index" },
  { label: "createIndexes", kind: 0, insertText: "createIndexes([${1}])", insertTextRules: 4, detail: "Create multiple indexes" },
  { label: "dropIndex", kind: 0, insertText: "dropIndex(\"${1:indexName}\")", insertTextRules: 4, detail: "Drop an index" },
  { label: "dropIndexes", kind: 0, insertText: "dropIndexes()", detail: "Drop all indexes" },
  { label: "getIndexes", kind: 0, insertText: "getIndexes()", detail: "List all indexes" },
  { label: "drop", kind: 0, insertText: "drop()", detail: "Drop the collection" },
  { label: "renameCollection", kind: 0, insertText: "renameCollection(\"${1:newName}\")", insertTextRules: 4, detail: "Rename collection" },
  { label: "stats", kind: 0, insertText: "stats()", detail: "Collection statistics" },
  { label: "bulkWrite", kind: 0, insertText: "bulkWrite([${1}])", insertTextRules: 4, detail: "Execute bulk operations" },
  { label: "findOneAndUpdate", kind: 0, insertText: "findOneAndUpdate(${1:{}}, ${2:{$$set: {}}})", insertTextRules: 4, detail: "Find and update" },
  { label: "findOneAndReplace", kind: 0, insertText: "findOneAndReplace(${1:{}}, ${2:{}})", insertTextRules: 4, detail: "Find and replace" },
  { label: "findOneAndDelete", kind: 0, insertText: "findOneAndDelete(${1:{}})", insertTextRules: 4, detail: "Find and delete" },
] as unknown as languages.CompletionItem[];

const DB_METHODS: languages.CompletionItem[] = [
  { label: "getCollectionNames", kind: 0, insertText: "getCollectionNames()", detail: "List collection names" },
  { label: "createCollection", kind: 0, insertText: "createCollection(\"${1:name}\")", insertTextRules: 4, detail: "Create a collection" },
  { label: "dropDatabase", kind: 0, insertText: "dropDatabase()", detail: "Drop current database" },
  { label: "stats", kind: 0, insertText: "stats()", detail: "Database statistics" },
  { label: "serverStatus", kind: 0, insertText: "serverStatus()", detail: "Server status information" },
  { label: "runCommand", kind: 0, insertText: "runCommand(${1:{}})", insertTextRules: 4, detail: "Run a database command" },
  { label: "adminCommand", kind: 0, insertText: "adminCommand(${1:{}})", insertTextRules: 4, detail: "Run an admin command" },
  { label: "getMongo", kind: 0, insertText: "getMongo()", detail: "Get connection info" },
  { label: "getName", kind: 0, insertText: "getName()", detail: "Get database name" },
  { label: "hostInfo", kind: 0, insertText: "hostInfo()", detail: "Host information" },
  { label: "currentOp", kind: 0, insertText: "currentOp()", detail: "Current operations" },
  { label: "killOp", kind: 0, insertText: "killOp(${1:opId})", insertTextRules: 4, detail: "Kill an operation" },
  { label: "getCollectionInfos", kind: 0, insertText: "getCollectionInfos()", detail: "Collection metadata" },
  { label: "listCommands", kind: 0, insertText: "listCommands()", detail: "List available commands" },
] as unknown as languages.CompletionItem[];

const MONGO_TYPES: languages.CompletionItem[] = [
  { label: "ObjectId", kind: 0, insertText: "ObjectId(\"${1}\")", insertTextRules: 4, detail: "Create an ObjectId" },
  { label: "ISODate", kind: 0, insertText: "ISODate(\"${1}\")", insertTextRules: 4, detail: "Create an ISODate" },
  { label: "NumberLong", kind: 0, insertText: "NumberLong(${1})", insertTextRules: 4, detail: "Create a NumberLong" },
  { label: "NumberDecimal", kind: 0, insertText: "NumberDecimal(\"${1}\")", insertTextRules: 4, detail: "Create a NumberDecimal" },
  { label: "UUID", kind: 0, insertText: "UUID(\"${1}\")", insertTextRules: 4, detail: "Create a UUID" },
] as unknown as languages.CompletionItem[];

function setRange(items: languages.CompletionItem[], range: IRange): languages.CompletionItem[] {
  return items.map((item) => ({ ...item, range }));
}

export function registerShellCompletions(
  monacoInstance: typeof import("monaco-editor"),
  collectionNames: string[] = [],
): void {
  monacoInstance.languages.registerCompletionItemProvider("javascript", {
    triggerCharacters: [".", " "],
    provideCompletionItems(
      model: editor.ITextModel,
      position: { lineNumber: number; column: number },
    ): languages.ProviderResult<languages.CompletionList> {
      const textUntilPosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      const word = model.getWordUntilPosition(position);
      const range: IRange = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      // After db.collectionName. -> suggest collection methods
      const colMethodMatch = textUntilPosition.match(/db\.(\w+)\.$/);
      if (colMethodMatch) {
        return { suggestions: setRange(COLLECTION_METHODS, range) };
      }

      // After db. -> suggest collection names + db methods
      if (textUntilPosition.match(/db\.$/)) {
        const collectionSuggestions: languages.CompletionItem[] = collectionNames.map(
          (name) =>
            ({
              label: name,
              kind: 5,
              insertText: name,
              detail: "Collection",
              range,
            }) as unknown as languages.CompletionItem,
        );
        return {
          suggestions: [
            ...setRange(DB_METHODS, range),
            ...collectionSuggestions,
          ],
        };
      }

      return {
        suggestions: [
          ...setRange(SHELL_HELPERS, range),
          ...setRange(MONGO_TYPES, range),
        ],
      };
    },
  });
}
