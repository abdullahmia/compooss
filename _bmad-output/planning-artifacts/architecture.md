---
stepsCompleted: [1]
inputDocuments:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/project-context.md"
workflowType: 'architecture'
project_name: 'compooss'
user_name: 'Abdullah Mia'
date: '2026-03-11'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

### 1\. Runtime & deployment

*   **A1 – Runtime model**:
    
    *   Single **Next.js app** (App Router) running in one container.
        
    *   No separate backend service; all server logic (APIs, DB access) lives inside Next.js server runtime.
        
*   **A2 – Deployment (MVP)**:
    
    *   Runs **only via docker compose up** as part of the project stack.
        
    *   One compose file defines at least:
        
        *   app service → compooss (Next.js)
            
        *   mongo service → single-node MongoDB for local dev.
            

### 2\. Data access / Mongo

*   **A3 – Mongo connection**:
    
    *   All DB access goes through a **shared Mongo client utility** (e.g. src/lib/db/mongo.ts).
        
    *   Connection string is read from **process.env.MONGO\_URI**; no credentials or URIs are ever stored in the browser.
        
*   **A4 – Topology (MVP)**:
    
    *   Target a **single Mongo instance** for v1 (local container or local process).
        
    *   The design must accept any valid Mongo URI so later we can point at **Atlas/replica sets** without refactoring.
        

### 3\. API surface

*   **A5 – API style**:
    
    *   Use **Next.js route handlers** under /api as the only backend surface.
        
    *   Example capabilities:
        
        *   GET /api/databases → list DBs.
            
        *   GET /api/databases/\[db\]/collections → list collections.
            
        *   GET /api/databases/\[db\]/collections/\[collection\] → paginated docs + filter.
            
        *   POST/PUT/DELETE on the same path for CRUD.
            
*   **A6 – Trust boundaries**:
    
    *   All Mongo operations are executed **server-side** only; the browser never talks directly to Mongo.
        

### 4\. UI responsibilities

*   **A7 – UI responsibilities**:
    
    *   UI is responsible for:
        
        *   Rendering DB/collection/doc lists and JSON/tree views.
            
        *   Collecting filter criteria and CRUD inputs.
            
        *   Calling the /api/\* endpoints and surfacing success/error states.
            
    *   No business logic or DB logic lives in the client; it only orchestrates API calls.
        

### 5\. Evolution notes

*   **A8 – Future extension hooks**:
    
    *   Auth layer can be added later **in front of Next.js** (e.g. middleware) without changing DB access.
        
    *   Support for multiple environments (local, staging) is done by **different MONGO\_URI values and compose profiles**, not by changing code.
        
    *   Atlas/replica support will be introduced by changing **URIs + possibly readPreference options** in the shared client.

