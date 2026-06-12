# FarmJumnoy Backend Architecture

## Decision

FarmJumnoy starts as a NestJS modular monolith. This keeps deployment simple while enforcing domain boundaries that can later be extracted into services when a domain has separate scale, team, or compliance pressure.

## Runtime Topology

```text
Clients
  Next.js PWA, mobile apps, admin dashboard
        |
CloudFront / CDN / WAF
        |
AWS ALB / API Gateway
        |
NestJS API cluster, stateless containers
        |
        +-- PostgreSQL RDS + PostGIS
        +-- Redis ElastiCache: cache, rate limits, BullMQ
        +-- Meilisearch: Khmer/full-text product, course, post search
        +-- Qdrant: vector search for agricultural RAG
        +-- S3 + CloudFront: media, certificates, documents
        +-- AI providers: OpenAI, Anthropic Claude, Google Gemini
```

## Module Boundaries

```text
src/
  auth/              login, OTP, JWT, refresh tokens, RBAC
  users/             profiles, roles, devices, preferences
  social/            posts, comments, reactions, follows, groups, chat
  marketplace/       products, cart, orders, mock payments, vendor APIs
  learning/          courses, lessons, quizzes, enrollment, certificates
  farm/              farms, plots, PostGIS maps, crop cycles, tasks, finance
  ai/                chat, RAG, ingestion, crop disease image flow
  consultation/      experts, schedules, bookings, sessions
  certification/     farm certification applications, inspections, QR verify
  notifications/     notification records, preferences, realtime/email/push jobs
  realtime/          Socket.io gateway and room policy
  queues/            BullMQ processors
  prisma/            database access
  search/            Meilisearch indexing/search adapter
  storage/           S3 adapter and signed upload URLs
  common/            guards, decorators, shared DTO primitives
```

Modules own their controllers, DTOs, and services. Cross-module work should happen through service interfaces for synchronous reads/writes or through domain events and BullMQ jobs for asynchronous side effects.

## Database Strategy

Primary store is PostgreSQL with Prisma. Spatial fields use PostGIS geometry columns for farm and plot boundaries, plus GeoJSON JSONB copies for API portability and mobile offline sync. Large media and generated PDFs stay in S3, referenced by URL/key in PostgreSQL.

Important indexing:

- Unique indexes on email, phone, role names, product slugs, certificate QR tokens.
- Composite indexes on tenant-like access paths: owner/user + status + createdAt.
- Feed indexes on post author/group/status/createdAt.
- Marketplace indexes on vendor/category/status/createdAt and order buyer/status.
- Learning indexes on enrollment user/course and lesson course/order.
- Farm indexes on owner/province/crop/status plus PostGIS GIST indexes for geometry.
- Notification indexes on user/readAt/createdAt.
- AI indexes on conversation/user and knowledge document/status; vector search lives in Qdrant.

## REST API Surface

All routes are versioned under `/api`.

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/otp/request`
- `POST /api/auth/otp/verify`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Users

- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/users/:id`
- `GET /api/users/:id/profile`

### Social

- `GET /api/feed`
- `POST /api/posts`
- `GET /api/posts/:id`
- `PATCH /api/posts/:id`
- `DELETE /api/posts/:id`
- `GET /api/posts/:id/comments`
- `POST /api/posts/:id/comments`
- `POST /api/posts/:id/reactions`
- `DELETE /api/posts/:id/reactions`
- `POST /api/users/:id/follow`
- `DELETE /api/users/:id/follow`
- `POST /api/groups`
- `GET /api/groups/:id`
- `POST /api/groups/:id/join`
- `POST /api/chat/rooms`
- `POST /api/chat/rooms/:id/messages`

### Marketplace

- `GET /api/products`
- `POST /api/products`
- `GET /api/products/:id`
- `PATCH /api/products/:id`
- `POST /api/cart/items`
- `GET /api/cart`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders/:id/payments/mock`
- `GET /api/vendor/dashboard`

### Learning

- `GET /api/courses`
- `POST /api/courses`
- `GET /api/courses/:id`
- `POST /api/courses/:id/enroll`
- `POST /api/lessons/:id/complete`
- `POST /api/quizzes/:id/submit`
- `POST /api/courses/:id/certificates`
- `GET /api/certificates/learning/:id/verify`

### Farm

- `GET /api/farms`
- `POST /api/farms`
- `GET /api/farms/:id`
- `PATCH /api/farms/:id`
- `POST /api/farms/:id/plots`
- `POST /api/farms/:id/crop-cycles`
- `POST /api/farms/:id/tasks`
- `POST /api/farms/:id/finance-records`
- `GET /api/farms/:id/dashboard`

### AI

- `POST /api/ai/chat`
- `POST /api/ai/ingest`
- `POST /api/ai/image-analysis`
- `GET /api/ai/conversations`
- `GET /api/ai/conversations/:id`

### Consultation

- `GET /api/experts`
- `POST /api/experts/me/schedules`
- `POST /api/consultations/bookings`
- `GET /api/consultations/bookings`
- `POST /api/consultations/sessions/:id/start`
- `POST /api/consultations/sessions/:id/complete`

### Certification

- `GET /api/certification/types`
- `POST /api/certification/applications`
- `GET /api/certification/applications`
- `POST /api/certification/applications/:id/inspections`
- `POST /api/certification/applications/:id/issue`
- `GET /api/certification/certificates/:qrToken/verify`

### Notifications

- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/preferences`

## Authentication Flow

1. User registers with email or phone and password.
2. Backend creates user, assigns default role, stores bcrypt password hash, emits `user.registered`.
3. OTP request creates a short-lived hashed OTP and queues email/SMS delivery.
4. OTP verify marks email/phone verified.
5. Login validates credentials, creates refresh token row, returns short-lived access JWT plus refresh token.
6. Guards enforce JWT authentication and RBAC with role metadata.
7. Refresh token rotation invalidates the previous token and issues a new pair.

## Realtime System

Socket.io namespace: `/realtime`.

Rooms:

- `user:{userId}` for private notifications.
- `chat:{roomId}` for 1:1 and group messaging.
- `post:{postId}` for live comments/reactions.
- `group:{groupId}` for group feed updates.
- `farm:{farmId}` for farm task and alert updates.

Events:

- Client to server: `chat.send`, `chat.join`, `post.watch`, `farm.watch`.
- Server to client: `notification.created`, `chat.message`, `post.updated`, `feed.updated`, `farm.alert`, `consultation.updated`.

Socket authentication uses the same JWT access token. Redis adapter is required in production for multi-container fanout.

## AI/RAG Design

Document ingestion:

1. Admin/expert uploads Khmer agricultural content.
2. Ingestion job extracts text, chunks content, normalizes Khmer text, and stores metadata in PostgreSQL.
3. Embeddings are generated with configured provider.
4. Vectors are written to Qdrant collection `farmjumnoy_knowledge`.
5. Searchable title/summary metadata is mirrored to Meilisearch.

Chat:

1. `/api/ai/chat` receives prompt, language, crop/farm context, optional conversation id.
2. Query embedding retrieves Qdrant matches with metadata filters such as crop, province, language, source.
3. Service builds a grounded prompt with citations and farm context.
4. Provider returns answer; response, citations, token usage, and safety flags are logged.
5. If confidence is low, response recommends expert escalation.

Image analysis:

1. Client uploads crop image to S3 or sends object key.
2. Backend creates analysis row and queues a vision job.
3. Provider classifies likely disease/pest/nutrient issue with confidence.
4. Result is attached to AI conversation and can create consultation escalation.

## Dev Docker Stack

Development uses Docker Compose:

- `api`: NestJS
- `postgres`: PostgreSQL 16 + PostGIS
- `redis`: Redis 7
- `meilisearch`: search
- `qdrant`: vector database
- `minio`: S3-compatible local object storage

## CI/CD Strategy

CI gates:

- Install dependencies with `npm ci`.
- Prisma schema validation and client generation.
- Lint, typecheck, test, build.
- Docker image build.
- Optional integration tests against Compose services.

Production deploy:

- Build immutable Docker image.
- Run migrations as a one-off release task.
- Deploy API and worker containers separately on ECS/Fargate or Kubernetes.
- Store secrets in AWS Secrets Manager.
- Use RDS PostgreSQL with PostGIS, ElastiCache Redis, S3/CloudFront, OpenTelemetry, CloudWatch/Grafana.

## Implementation Plan

1. Scaffold NestJS app with strict TypeScript, validation, Swagger, health checks.
2. Add Prisma schema, seed roles/permissions, and PostGIS migration SQL.
3. Add auth, JWT, refresh tokens, OTP, RBAC.
4. Implement core CRUD and workflows per module.
5. Add BullMQ queues for notifications, certificates, AI ingestion, image analysis, and search indexing.
6. Add Socket.io gateway and notification fanout.
7. Add AI clients, Qdrant retrieval, document ingestion, and chat logging.
8. Add Docker Compose, Dockerfile, env example, CI workflow.
9. Verify install, Prisma validation, typecheck, and build.
