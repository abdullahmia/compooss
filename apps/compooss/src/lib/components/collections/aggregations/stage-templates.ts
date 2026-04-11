import type { StageTemplate } from "@compooss/types";

export const STAGE_TEMPLATES: StageTemplate[] = [
  {
    operator: "$match",
    label: "$match",
    description: "Filter documents by specified conditions",
    snippet: '{\n  "field": "value"\n}',
    category: "filter",
  },
  {
    operator: "$group",
    label: "$group",
    description: "Group documents by expression and apply accumulators",
    snippet: '{\n  "_id": "$field",\n  "count": { "$sum": 1 }\n}',
    category: "group",
  },
  {
    operator: "$project",
    label: "$project",
    description: "Reshape documents: include, exclude, or compute fields",
    snippet: '{\n  "_id": 1,\n  "field": 1\n}',
    category: "transform",
  },
  {
    operator: "$sort",
    label: "$sort",
    description: "Sort documents by specified fields",
    snippet: '{\n  "field": -1\n}',
    category: "filter",
  },
  {
    operator: "$limit",
    label: "$limit",
    description: "Limit the number of documents",
    snippet: "10",
    category: "filter",
  },
  {
    operator: "$skip",
    label: "$skip",
    description: "Skip a number of documents",
    snippet: "0",
    category: "filter",
  },
  {
    operator: "$unwind",
    label: "$unwind",
    description: "Deconstruct an array field into separate documents",
    snippet: '{\n  "path": "$arrayField",\n  "preserveNullAndEmptyArrays": false\n}',
    category: "transform",
  },
  {
    operator: "$lookup",
    label: "$lookup",
    description: "Join with another collection",
    snippet:
      '{\n  "from": "otherCollection",\n  "localField": "field",\n  "foreignField": "_id",\n  "as": "joined"\n}',
    category: "join",
  },
  {
    operator: "$addFields",
    label: "$addFields",
    description: "Add new fields to documents",
    snippet: '{\n  "newField": "expression"\n}',
    category: "transform",
  },
  {
    operator: "$set",
    label: "$set",
    description: "Add or update fields (alias for $addFields)",
    snippet: '{\n  "field": "expression"\n}',
    category: "transform",
  },
  {
    operator: "$unset",
    label: "$unset",
    description: "Remove fields from documents",
    snippet: '["fieldToRemove"]',
    category: "transform",
  },
  {
    operator: "$replaceRoot",
    label: "$replaceRoot",
    description: "Replace the document with a specified embedded document",
    snippet: '{\n  "newRoot": "$embeddedDocument"\n}',
    category: "transform",
  },
  {
    operator: "$replaceWith",
    label: "$replaceWith",
    description: "Replace the document with a specified expression",
    snippet: '"$embeddedDocument"',
    category: "transform",
  },
  {
    operator: "$count",
    label: "$count",
    description: "Count the number of documents",
    snippet: '"total"',
    category: "group",
  },
  {
    operator: "$bucket",
    label: "$bucket",
    description: "Categorize documents into groups (buckets)",
    snippet:
      '{\n  "groupBy": "$field",\n  "boundaries": [0, 100, 200],\n  "default": "Other",\n  "output": {\n    "count": { "$sum": 1 }\n  }\n}',
    category: "group",
  },
  {
    operator: "$bucketAuto",
    label: "$bucketAuto",
    description: "Automatically categorize documents into a specified number of buckets",
    snippet:
      '{\n  "groupBy": "$field",\n  "buckets": 5\n}',
    category: "group",
  },
  {
    operator: "$facet",
    label: "$facet",
    description: "Process multiple aggregation pipelines on the same input documents",
    snippet:
      '{\n  "pipeline1": [\n    { "$match": {} }\n  ],\n  "pipeline2": [\n    { "$count": "total" }\n  ]\n}',
    category: "group",
  },
  {
    operator: "$graphLookup",
    label: "$graphLookup",
    description: "Perform a recursive search on a collection",
    snippet:
      '{\n  "from": "collection",\n  "startWith": "$field",\n  "connectFromField": "field",\n  "connectToField": "_id",\n  "as": "connected",\n  "maxDepth": 3\n}',
    category: "join",
  },
  {
    operator: "$merge",
    label: "$merge",
    description: "Write results to a collection (merge with existing data)",
    snippet:
      '{\n  "into": "outputCollection",\n  "whenMatched": "replace",\n  "whenNotMatched": "insert"\n}',
    category: "output",
  },
  {
    operator: "$out",
    label: "$out",
    description: "Write results to a collection (replaces existing)",
    snippet: '"outputCollection"',
    category: "output",
  },
  {
    operator: "$redact",
    label: "$redact",
    description: "Restrict content based on field-level access control",
    snippet:
      '{\n  "$cond": {\n    "if": { "$eq": ["$level", 1] },\n    "then": "$$DESCEND",\n    "else": "$$PRUNE"\n  }\n}',
    category: "filter",
  },
  {
    operator: "$sample",
    label: "$sample",
    description: "Randomly select a specified number of documents",
    snippet: '{\n  "size": 10\n}',
    category: "filter",
  },
  {
    operator: "$sortByCount",
    label: "$sortByCount",
    description: "Group by expression, count, and sort by count descending",
    snippet: '"$field"',
    category: "group",
  },
  {
    operator: "$unionWith",
    label: "$unionWith",
    description: "Combine results from another collection",
    snippet: '{\n  "coll": "otherCollection",\n  "pipeline": []\n}',
    category: "join",
  },
  {
    operator: "$densify",
    label: "$densify",
    description: "Fill gaps in time series or numeric data",
    snippet:
      '{\n  "field": "timestamp",\n  "range": {\n    "step": 1,\n    "unit": "hour",\n    "bounds": "full"\n  }\n}',
    category: "transform",
  },
  {
    operator: "$fill",
    label: "$fill",
    description: "Fill null and missing field values",
    snippet:
      '{\n  "output": {\n    "field": { "method": "linear" }\n  }\n}',
    category: "transform",
  },
  {
    operator: "$setWindowFields",
    label: "$setWindowFields",
    description: "Perform window functions on documents",
    snippet:
      '{\n  "partitionBy": "$field",\n  "sortBy": { "date": 1 },\n  "output": {\n    "runningTotal": {\n      "$sum": "$amount",\n      "window": {\n        "documents": ["unbounded", "current"]\n      }\n    }\n  }\n}',
    category: "transform",
  },
  {
    operator: "$search",
    label: "$search",
    description: "Full-text search (Atlas Search)",
    snippet:
      '{\n  "index": "default",\n  "text": {\n    "query": "search term",\n    "path": "field"\n  }\n}',
    category: "filter",
  },
  {
    operator: "$searchMeta",
    label: "$searchMeta",
    description: "Return metadata about Atlas Search results",
    snippet:
      '{\n  "index": "default",\n  "facet": {\n    "operator": {\n      "text": {\n        "query": "search term",\n        "path": "field"\n      }\n    },\n    "facets": {}\n  }\n}',
    category: "filter",
  },
  {
    operator: "$geoNear",
    label: "$geoNear",
    description: "Return documents near a geospatial point",
    snippet:
      '{\n  "near": { "type": "Point", "coordinates": [0, 0] },\n  "distanceField": "distance",\n  "maxDistance": 1000,\n  "spherical": true\n}',
    category: "filter",
  },
];

export const STAGE_OPERATOR_OPTIONS = STAGE_TEMPLATES.map((t) => ({
  value: t.operator,
  label: t.label,
  description: t.description,
  category: t.category,
}));

export function getTemplateForOperator(operator: string): StageTemplate | undefined {
  return STAGE_TEMPLATES.find((t) => t.operator === operator);
}

export const STAGE_CATEGORIES = [
  { id: "filter", label: "Filter & Match" },
  { id: "transform", label: "Transform" },
  { id: "group", label: "Group & Aggregate" },
  { id: "join", label: "Join & Lookup" },
  { id: "output", label: "Output" },
  { id: "other", label: "Other" },
] as const;
