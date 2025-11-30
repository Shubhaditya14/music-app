# Performance Analysis & Benchmark Report: Music App (Modeled)

## 1. Disclaimer: Modeled Estimates
> **IMPORTANT**: All metrics in this report are modeled based on known characteristics of similar architectures (FastAPI, SQLite, Next.js), algorithms, and systems. These are **not** measurements taken from the user's actual deployment. They represent realistic, industry-plausible performance ranges for systems of this class.

---

## 2. System Architecture Overview
*   **Backend Runtime**: Python 3.x (FastAPI + Uvicorn)
*   **Database**: SQLite (Embedded Relational DB)
*   **ORM**: SQLModel (SQLAlchemy Core)
*   **Frontend**: Next.js (React 19)
*   **Recommender Engine**: Collaborative Filtering (User-User Similarity via Set Intersection)

---

## 3. Latency Benchmarks (Modeled)

### API Response Times
| Endpoint | Operation Type | Local Dev (ms) | Cloud Production (ms)* | Complexity |
| :--- | :--- | :--- | :--- | :--- |
| `GET /songs/{id}` | Simple Read | **2 - 8 ms** | **15 - 40 ms** | O(1) (Index Lookup) |
| `GET /songs` | Bulk Read | **10 - 30 ms** | **40 - 100 ms** | O(N) (Table Scan) |
| `POST /play` | Write (Log) | **5 - 15 ms** | **30 - 80 ms** | O(1) (Append + Index) |
| `GET /.../history` | Filtered Read | **8 - 20 ms** | **35 - 90 ms** | O(log N) (Index Scan) |
| `GET /.../recommendations` | Complex Compute | **50 - 200 ms** | **150 - 500 ms** | O(U × S)** |

*\*Cloud Production assumes a standard region-local deployment (e.g., AWS us-east-1) with <10ms network RTT.*
*\*\* U = Total Users, S = Average Songs per User. See Complexity Analysis.*

### Frontend Rendering (Next.js)
*   **First Contentful Paint (FCP)**: 0.8s - 1.2s (Optimized Static/SSR)
*   **Time to Interactive (TTI)**: 1.0s - 1.5s
*   **Route Transition**: < 100ms (Client-side navigation)

---

## 4. Throughput & Scalability

### Throughput Ranges
*   **Read-Heavy Workload (90% Read / 10% Write)**:
    *   *Representative Throughput*: **1,500 - 3,000 Requests Per Second (RPS)**
    *   *Constraint*: Python GIL / CPU (FastAPI is highly efficient, but Python is single-threaded for CPU-bound tasks).
*   **Write-Heavy Workload (50% Read / 50% Write)**:
    *   *Representative Throughput*: **100 - 300 RPS**
    *   *Constraint*: **SQLite Write Lock**. SQLite allows only one writer at a time. High concurrency will lead to `database is locked` errors or increased latency due to busy-waiting.

### System Limits (Current Architecture)
*   **Max Concurrent Users (Active)**: ~500 - 1,000 (limited by SQLite write concurrency).
*   **Database Size Limit**: Practical limit ~10GB - 50GB before backup/maintenance becomes painful (SQLite max is 140TB).
*   **Recommender Limit**: The current in-memory Python loop for recommendations will degrade noticeably (>500ms latency) after **~5,000 users** or **~500,000 play logs**.

---

## 5. Bottleneck Analysis

### 1. Database Concurrency (Critical)
*   **Issue**: SQLite uses coarse-grained locking (database-level or WAL-file level).
*   **Impact**: Under high load, `POST /play` requests will queue up. If the queue exceeds the timeout (default 5s), requests will fail.
*   **Severity**: High for production, Low for single-user/dev.

### 2. Recommender Algorithm (Compute)
*   **Issue**: The `recommend_baseline` function fetches *all* other users and computes set intersections in Python.
*   **Impact**: CPU usage spikes linearly with user count. This blocks the event loop if not offloaded (though FastAPI handles async I/O, this is CPU-bound).
*   **Severity**: Medium (becomes critical as user base grows).

### 3. N+1 Query Problem (Potential)
*   **Issue**: Endpoints like `get_recent_plays` iterate through rows and fetch `Song` objects individually (`session.get(Song, pl.song_id)`).
*   **Impact**: 100 recent plays = 101 database queries.
*   **Severity**: Medium (increases latency significantly on higher latency networks).

---

## 6. Complexity Analysis

### Space Complexity
*   **Storage**: O(N) where N is the number of play logs.
*   **Memory (Recommender)**: O(U × S) to load user profiles into memory for similarity calculation.

### Time Complexity (Recommender)
The baseline recommender performs the following:
1.  Fetch target user profile: O(S)
2.  Fetch all other users: O(U)
3.  For each user, compute intersection: O(S)
*   **Total Complexity**: **O(U × S)**
*   *Note*: As $U \to \infty$, this becomes too slow for real-time requests.

---

## 7. Optimization Recommendations

### Immediate Wins (Low Effort)
1.  **Fix N+1 Queries**: Use `joinedload` or SQL joins in `get_recent_plays` to fetch Song data in a single query.
    *   *Benefit*: 5x-10x speedup on list endpoints.
2.  **Enable SQLite WAL Mode**: Run `PRAGMA journal_mode=WAL;`.
    *   *Benefit*: Significantly better concurrency (readers don't block writers).

### Strategic Improvements (High Effort)
1.  **Migrate to PostgreSQL**:
    *   *Trigger*: When you exceed ~50 concurrent writes/sec.
    *   *Benefit*: Row-level locking, robust concurrency, better JSON support.
2.  **Caching**:
    *   Implement Redis for `GET /songs` and `GET /recommendations`.
    *   *Benefit*: Reduces DB load by 90% for static content.
3.  **Vector Search for Recommendations**:
    *   Instead of set intersection, represent users as vectors and use a library like `FAISS` or `pgvector`.
    *   *Benefit*: O(log U) similarity search instead of O(U).

---

## 8. Conclusion
The current "Music App" architecture is **excellent for prototyping, local development, and single-tenant deployments**. It is lightweight, easy to deploy, and has zero infrastructure overhead.

However, for a multi-user production environment, the **SQLite write lock** and **O(N) recommender algorithm** are the primary scalability barriers. Migrating to PostgreSQL and optimizing the query patterns will unlock the ability to serve 10k+ concurrent users.
