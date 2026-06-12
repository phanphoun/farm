# FarmJumnoy - Phase 2: Non-Functional Requirements & MoSCoW Prioritization

## 2.3 Non-Functional Requirements (Detailed)

### 2.3.1 Performance Requirements

#### API Performance Targets

| Endpoint Category | p50 | p95 | p99 | Max Throughput |
|-------------------|-----|-----|-----|----------------|
| **Auth (login, register, refresh)** | 50ms | 150ms | 300ms | 10,000 req/s |
| **CRUD (farms, crops, activities)** | 80ms | 200ms | 400ms | 5,000 req/s |
| **Social (feed, posts, chat)** | 100ms | 250ms | 500ms | 8,000 req/s |
| **Marketplace (search, catalog, orders)** | 120ms | 300ms | 600ms | 3,000 req/s |
| **AI Inference (diagnosis, chat)** | 1.5s | 3s | 5s | 500 req/s (GPU) |
| **Certification (workflow, inspector)** | 150ms | 400ms | 800ms | 1,000 req/s |
| **File Upload (images, docs)** | 500ms | 2s | 5s | 1,000 req/s |
| **WebSocket (Reverb)** | <50ms | <100ms | <200ms | 100K concurrent |

#### Frontend Performance (Lighthouse CI Gates)

| Metric | Mobile (3G) | Desktop | Enforcement |
|--------|-------------|---------|-------------|
| **Largest Contentful Paint (LCP)** | <2.5s | <1.5s | Fail build if exceeded |
| **First Input Delay (FID)** | <100ms | <50ms | Fail build if exceeded |
| **Cumulative Layout Shift (CLS)** | <0.1 | <0.05 | Fail build if exceeded |
| **Time to First Byte (TTFB)** | <600ms | <300ms | Warn if exceeded |
| **Total Bundle Size (JS)** | <200KB gz | <300KB gz | Fail build if exceeded |
| **Lighthouse Score** | >90 | >95 | Gate in CI/CD |

#### Database Performance

| Metric | Target |
|--------|--------|
| **Simple Query (PK lookup)** | <5ms p95 |
| **Complex Query (joins, aggregates)** | <50ms p95 |
| **Full-text Search (Meilisearch)** | <100ms p95 |
| **Write Throughput** | 10K writes/s sustained |
| **Replication Lag** | <100ms (sync replicas) |
| **Connection Pool Utilization** | <70% |

### 2.3.2 Scalability Requirements

#### Horizontal Scaling Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        LOAD BALANCER (AWS ALB / Cloudflare)     │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  API Pod 1    │     │  API Pod 2    │     │  API Pod N    │  (Laravel Octane)
│  (Stateless)  │     │  (Stateless)  │     │  (Stateless)  │  HPA: CPU>70% / RPS>1000
└───────┬───────┘     └───────┬───────┘     └───────┬───────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    REDIS CLUSTER (Session, Cache, Queue)        │
│  6 Shards (3 Master + 3 Replica) | Cluster Mode Enabled        │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  MySQL Primary │     │  MySQL Replica │     │  MySQL Replica │
│  (Writer)      │     │  (Reader 1)    │     │  (Reader 2)    │
│  InnoDB Cluster│     │  GTID Replication                 │
└───────────────┘     └───────────────┘     └───────────────┘
```

#### Capacity Planning (3-Year)

| Resource | Year 1 (Launch) | Year 2 (Growth) | Year 3 (Scale) | Scaling Trigger |
|----------|-----------------|-----------------|----------------|-----------------|
| **API Pods** | 6 (2 vCPU, 4GB) | 20 (4 vCPU, 8GB) | 50 (8 vCPU, 16GB) | CPU >70% 5min |
| **Reverb Nodes** | 3 | 10 | 25 | Connections >8K/node |
| **Horizon Workers** | 20 | 100 | 300 | Queue latency >30s |
| **MySQL Primary** | db.r6g.xlarge | db.r6g.4xlarge | db.r6g.8xlarge | CPU >70% / Storage >70% |
| **Read Replicas** | 2 | 6 | 12 | Replica lag >1s / CPU >60% |
| **Redis Cluster** | 3 shards | 6 shards | 12 shards | Memory >70% / Ops >80% |
| **Meilisearch** | 1 node (8 vCPU, 32GB) | 3 nodes | 6 nodes | Index >50GB / Query >200ms |
| **S3/R2 Storage** | 5 TB | 50 TB | 500 TB | Lifecycle policies |
| **GPU (AI Inference)** | 2× A10G | 8× A100 | 20× H100 | Queue >100 / Latency >5s |

### 2.3.3 Security Requirements (Detailed)

#### Authentication & Authorization

```yaml
# Auth Configuration (Laravel Sanctum + Custom Policies)
auth:
  defaults:
    guard: web
    password: bcrypt
  guards:
    web:
      driver: session
      provider: users
    api:
      driver: sanctum
      provider: users
      token_expiry: 3600  # 1 hour access token
      refresh_expiry: 2592000  # 30 days refresh token
    websocket:
      driver: sanctum
      provider: users
  providers:
    users:
      driver: eloquent
      model: App\Models\User
  passwords:
    users:
      provider: users
      table: password_resets
      expire: 60
      throttle: 60
```

#### Role-Permission Matrix

| Permission \ Role | Farmer | Expert | Vendor | NGO | Gov | Admin | SuperAdmin |
|-------------------|:------:|:------:|:------:|:---:|:---:|:-----:|:----------:|
| **Farm CRUD (own)** | ✅ | ❌ | ❌ | ❌ | 👁️ | ✅ | ✅ |
| **Farm View (shared)** | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Post Create** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Post Moderate** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Course Create** | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| **Course Enroll** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **AI Consult** | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| **AI Train/Config** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Marketplace Buy** | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| **Marketplace Sell** | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| **Vendor Manage** | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| **Cert Apply** | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| **Cert Inspect** | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Cert Issue** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Consult Book** | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| **Consult Provide** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Analytics View (own)** | ✅ | ✅ | ✅ | ✅ | 👁️ | ✅ | ✅ |
| **Analytics View (platform)** | ❌ | ❌ | ❌ | 👁️ | 👁️ | ✅ | ✅ |
| **User Manage** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **System Config** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

#### Data Protection

| Data Category | Classification | Encryption | Retention | Access Control |
|---------------|----------------|------------|-----------|----------------|
| **PII (Name, Phone, ID)** | Restricted | AES-256 field-level | 7yr post-account | Role-based + audit |
| **Farm Location (GPS)** | Confidential | AES-256 at rest | Indefinite | Owner + shared + gov (anonymized) |
| **Financial (Income, Expense)** | Restricted | AES-256 field-level | 10yr (tax) | Owner + expert (consult) |
| **Health (Crop Disease)** | Confidential | AES-256 at rest | 5yr | Owner + expert + AI (anonymized) |
| **Biometric (Voice, Face)** | Restricted | AES-256 + separate key | Session only | Transient; not stored |
| **Chat Messages** | Confidential | TLS + at-rest | 2yr | Participants + moderation |
| **AI Prompts/Responses** | Internal | Encrypted logs | 1yr | AI team + audit |
| **Audit Logs** | Restricted | Append-only; WORM | 7yr immutable | Security + compliance only |

#### Security Headers (Nginx / Cloudflare)

```nginx
# Security Headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://js.stripe.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com data:;
    img-src 'self' data: https://*.r2.cloudflarestorage.com https://*.s3.amazonaws.com;
    media-src 'self' https://*.r2.cloudflarestorage.com;
    connect-src 'self' wss://reverb.farmjumnoy.com https://api.farmjumnoy.com https://*.sentry.io;
    frame-src https://js.stripe.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
" always;
add_header Permissions-Policy "
    geolocation=(),
    microphone=(self),
    camera=(self),
    payment=(self)
" always;
```

### 2.3.4 Observability Requirements

#### Metrics (Prometheus + Grafana)

| Metric Category | Key Metrics | Alert Threshold |
|-----------------|-------------|-----------------|
| **Golden Signals** | Latency (p50/p95/p99), Traffic (RPS), Errors (5xx%), Saturation (CPU/MEM) | p99 >1s, Error >1%, CPU >80% |
| **Business** | DAU, MAU, GMV, Certifications, AI Consults, Revenue | DAU drop >20% WoW |
| **Queue** | Jobs pending, processing, failed, latency | Pending >10K, Failed >5% |
| **WebSocket** | Connections, messages/s, failed deliveries, rooms | Connections drop >30% |
| **Database** | Connections, slow queries, replication lag, deadlocks | Lag >1s, Slow query >1s |
| **Cache** | Hit rate, memory, evictions, keys | Hit rate <90% |
| **AI** | Inference latency, queue depth, GPU utilization, error rate | Latency >5s, GPU >90% |
| **Storage** | Used %, throughput, errors, CDN hit rate | Used >80%, Errors >0.1% |

#### Logging (Structured JSON)

```json
{
  "timestamp": "2025-06-11T10:30:00.123Z",
  "level": "info",
  "service": "api",
  "trace_id": "abc123",
  "span_id": "def456",
  "user_id": 12345,
  "role": "farmer",
  "action": "crop_diagnosis",
  "duration_ms": 1250,
  "result": "success",
  "metadata": {
    "crop": "yardlong_bean",
    "disease": "bean_fly",
    "confidence": 0.87,
    "model_version": "v3.2.1"
  }
}
```

#### Tracing (OpenTelemetry → Jaeger/Tempo)

- 100% request tracing (head-based sampling 10%, tail-based 100% errors)
- Spans: HTTP, DB, Redis, External API, AI Inference, Queue Job
- Custom attributes: user_id, role, feature_flag, experiment_variant

#### Alerting (Alertmanager → PagerDuty/Slack)

| Severity | Response Time | Escalation |
|----------|---------------|------------|
| **Critical (P0)** | 5 min | Page on-call → 15 min → Manager → 30 min → VP |
| **High (P1)** | 15 min | Page on-call → 30 min → Team Lead |
| **Medium (P2)** | 1 hour | Slack → Team channel → Next business day |
| **Low (P3)** | 4 hours | Slack → Team channel → Sprint planning |

---

## 2.4 MoSCoW Prioritization (Expanded)

### MVP Scope (Months 1-6) — "Launch Ready"

#### MUST HAVE - Authentication & User Management
- [ ] Multi-role registration (Farmer, Expert, Vendor, Admin)
- [ ] Phone/Email + OTP verification (SMS via Twilio/Vonage, Voice fallback)
- [ ] Social login (Facebook, Google, Apple) — Khmer UI
- [ ] RBAC with 8 roles, policy-based permissions
- [ ] Session management (device list, revoke, limits)
- [ ] Password reset, email verification
- [ ] Account soft/hard delete (GDPR/PDPA compliant)

#### MUST HAVE - Farmer Social Network
- [ ] Profile: avatar, bio, farm summary, verification badge
- [ ] Posts: text, photos (≤5), video (≤2min), crop tags, location
- [ ] Feed: following + algorithmic (crop/region relevance)
- [ ] Interactions: comments, 4 reactions, shares
- [ ] Follow system: Farmer↔Farmer, Farmer→Expert, Farmer→Vendor
- [ ] 1:1 Real-time chat (text, voice note, image, location)
- [ ] Notifications: in-app, push (FCM), SMS (critical), email
- [ ] Notification preferences per channel/type

#### MUST HAVE - Educational Platform
- [ ] Course catalog with categories, levels, pricing (Free/Premium)
- [ ] Course structure: modules → lessons → topics
- [ ] Content: video (HLS adaptive), PDF, quiz (MCQ, multi-select)
- [ ] Progress tracking: per lesson, module, course
- [ ] Certificates: PDF generation, QR verification, blockchain anchor (optional)
- [ ] Student dashboard: progress, certificates, bookmarks, notes
- [ ] Instructor tools: course builder, analytics, revenue, Q&A
- [ ] Revenue split: 70/30 instructor/platform

#### MUST HAVE - AI Agricultural Assistant
- [ ] Multimodal chat: Khmer text, voice (STT/TTS), image upload
- [ ] Crop diagnosis: image → disease/pest/nutrient (TensorFlow Lite on-device)
- [ ] Advisory chat: RAG over Khmer knowledge base (MAFF, CARDI, expert content)
- [ ] Weather alerts: hyperlocal (1km), Khmer voice, actionable
- [ ] Expert escalation: AI → Human handoff with context (<30 min queue)
- [ ] Feedback loop: farmer rates AI → retrains; expert corrects → KB

#### MUST HAVE - AgriTech Marketplace
- [ ] Product catalog: categories, variants, specs, expert-verified badge
- [ ] Vendor dashboard: inventory, orders, analytics, promotions, payouts
- [ ] Search: filters (crop, region, price, cert, rating), Khmer search
- [ ] Checkout: COD, Wing, TrueMoney, ABA, Card; installment (partner)
- [ ] Order management: tracking, delivery confirmation, dispute, 7-day return
- [ ] Reviews: verified purchase only, photo/video, expert endorsement
- [ ] Vendor onboarding: KYC, bank account, commission agreement, CSV import

#### MUST HAVE - Certification System
- [ ] Certification types: Organic, GAP, Fair Trade, Carbon (configurable)
- [ ] Application workflow: apply → docs → review → inspect → decide
- [ ] Inspector app (mobile): offline checklists, GPS photos, voice notes, auto-report
- [ ] Certificate issuance: PDF + QR + blockchain hash; validity; renewal
- [ ] Traceability: Farm → Plot → Crop → Input → Practice → Harvest (EUDR-ready)
- [ ] Marketplace integration: certified badge, filter, premium placement

#### MUST HAVE - Expert Consultation
- [ ] Expert profiles: credentials, specialties, rates, availability, ratings
- [ ] Booking: packages (15/30/60 min), pay-per-question
- [ ] Video consultation: Jitsi/Reverb, screen share, recording (consent)
- [ ] Payment: escrow hold → release after session; platform fee 15%
- [ ] Ratings: detailed (knowledge, communication, value); expert response
- [ ] Earnings dashboard: sessions, revenue, tax docs, withdrawal

#### MUST HAVE - Farm Management
- [ ] Farm registry: multiple farms, plots (polygon GPS), crops, soil tests
- [ ] Crop cycle tracking: planting → activities → harvest → post-harvest
- [ ] Activity logging: inputs, labor, machinery, irrigation (voice entry)
- [ ] Expense/Income tracking: categories, vendors, receipts (photo), KHR/USD
- [ ] Analytics dashboard: yield/ha, cost/ha, profit/crop, ROI, peer benchmark

#### MUST HAVE - Dashboards
- [ ] Farmer Dashboard: crop health, income, learning, marketplace, cert (single screen)
- [ ] Expert Dashboard: consultations, courses, certs, earnings, impact
- [ ] Vendor Dashboard: sales, inventory, customers, reviews, payouts
- [ ] Admin Dashboard: platform health, users, revenue, content, moderation, security

#### MUST HAVE - Infrastructure
- [ ] Laravel 12 (Octane/Swoole) + Next.js 16 (App Router, TS, Tailwind, Shadcn)
- [ ] MySQL 8 (InnoDB Cluster) + Redis Cluster + Meilisearch
- [ ] Laravel Reverb (WebSocket) + Horizon (Queues)
- [ ] S3/Cloudflare R2 + Cloudflare Images + CDN
- [ ] Docker + Kubernetes (EKS/GKE) + GitHub Actions CI/CD
- [ ] Monitoring: Prometheus + Grafana + Alertmanager + PagerDuty
- [ ] Logging: Structured JSON → Loki/ELK; Tracing: OpenTelemetry → Tempo/Jaeger

---

### SHOULD HAVE (Months 6-12) — "Differentiation & Scale"

#### SHOULD HAVE - Enhanced Auth
- [ ] 2FA (TOTP, SMS, Email) mandatory for Expert/Vendor/NGO/Gov
- [ ] Delegated access (Farmer→Family, Coop→Leader)
- [ ] Impersonation (Admin, audit logged, MFA required)

#### SHOULD HAVE - Social Groups & Moderation
- [ ] Groups/Communities: public/private/invite; roles; max 10K members
- [ ] Stories/Highlights: 24hr ephemeral, auto-caption, save to profile
- [ ] Content moderation: AI filter (Khmer), user reports, human review queue

#### SHOULD HAVE - Learning Paths & Marketplace
- [ ] Learning paths: curated sequences, career mapping
- [ ] Bulk enrollment (Coop/NGO/Corp): SCIM, cohort tracking, custom branding
- [ ] Content marketplace: expert courses, coupons, regional pricing

#### SHOULD HAVE - Advanced AI
- [ ] Yield prediction: satellite + weather + practice → forecast (per field)
- [ ] Market price forecast: 30-day prediction (MAFF + marketplace data)
- [ ] Farm planner: seasonal calendar, task scheduler, input calculator, budget
- [ ] Offline model updates: federated learning approach

#### SHOULD HAVE - Marketplace Expansion
- [ ] Group buying: pooled orders → volume discount → split delivery
- [ ] Subscriptions: seasonal input packages, sensor data plans
- [ ] Produce marketplace (Farmer→Buyer): grades, logistics, escrow

#### SHOULD HAVE - Certification Depth
- [ ] Group certification: Coop ICS, sampling protocol, shared cost
- [ ] Auditor/Regulator portal: read-only, audit trails, sampling tools
- [ ] Blockchain anchoring: optional, configurable (Polygon/Hedera)

#### SHOULD HAVE - Consultation Enhancement
- [ ] Chat consultation: async, threaded, multimedia, SLA-based
- [ ] Subscription packages: monthly access to expert
- [ ] Tax documentation automation

#### SHOULD HAVE - Farm Management Depth
- [ ] Inventory: inputs on hand, expiry alerts, usage rate, reorder suggestions
- [ ] Task management: recurring, weather-dependent, assigned, reminders
- [ ] Equipment/IoT: sensor pairing (MQTT/LoRaWAN), data viz, alerts

#### SHOULD HAVE - Advanced Dashboards
- [ ] Coop/NGO Dashboard: member adoption, yield aggregates, training, cert status
- [ ] Government Dashboard: anonymized aggregates, compliance, pest surveillance

#### SHOULD HAVE - Infrastructure Scale
- [ ] Kubernetes: multi-AZ, HPA, VPA, cluster autoscaler
- [ ] Multi-region: active-passive (SG primary, BKK secondary)
- [ ] Meilisearch cluster for search
- [ ] Advanced observability: profiling, continuous profiling, chaos engineering

---

### COULD HAVE (Year 2) — "Innovation & Expansion"

- [ ] Live streaming (farm tours, expert Q&A)
- [ ] AR/VR: crop disease AR overlay, VR farm tours
- [ ] AI-generated personalized courses from expert content
- [ ] Carbon credit estimation per farm practice
- [ ] Satellite-based pest detection (Sentinel-2 + ML)
- [ ] Dynamic pricing & vendor bidding
- [ ] Trade finance & futures contracts
- [ ] Biodiversity credits certification
- [ ] Predictive maintenance for IoT equipment
- [ ] Automated irrigation control integration
- [ ] Consumer app (farm-to-table, traceability, subscription)
- [ ] Agri-tourism marketplace
- [ ] Equipment rental marketplace

---

### WON'T HAVE (Explicitly Out of Scope)

- ❌ Cryptocurrency/token economy
- ❌ Autonomous drone operations
- ❌ Genetic engineering advisory
- ❌ Commodity futures trading
- ❌ Full ERP for large agribusiness (partner instead)
- ❌ Hardware manufacturing (IoT devices — platform only)
- ❌ Banking license (partner with regulated entities)
- ❌ Insurance underwriting (partner with insurers)

---

## 2.5 Release Criteria

### MVP Release (Month 6) — "Go/No-Go" Gate

| Criterion | Target | Verification |
|-----------|--------|--------------|
| **All MUST HAVE features** | 100% done, tested, documented | QA sign-off; automated test coverage >80% |
| **Performance** | All Lighthouse >90; API p95 <200ms | CI/CD gates; load test (10K VU) |
| **Security** | Zero critical/high vulns; pen test passed | External audit; SAST/DAST clean |
| **Accessibility** | WCAG 2.1 AA (all user flows) | axe-core automated + manual audit |
| **Khmer Parity** | 100% UI strings; 90% content | Translation checklist; native speaker review |
| **Offline** | 90% core flows work offline | Offline test matrix; 3G/2G simulation |
| **Reliability** | 99.9% uptime (staging, 30 days) | Chaos engineering; failover drills |
| **Data Privacy** | Consent flow; export/delete; DPA signed | Legal review; DPO sign-off |
| **Monitoring** | 100% golden signals alerting; dashboards live | Alert firing test; runbook validation |
| **Rollback** | <5 min full rollback capability | Dry-run; blue/green validated |

---

## Appendix: Feature Flag Strategy

| Flag | Default | Rollout | Purpose |
|------|---------|---------|---------|
| `feature.ai_diagnosis` | off | 10% → 50% → 100% | Gradual AI model rollout |
| `feature.marketplace_installment` | off | Vendor opt-in → all | Payment partner integration |
| `feature.cert_blockchain` | off | Pilot coops only | Regulatory uncertainty |
| `feature.group_certification` | off | 5 coops → all | Complex workflow validation |
| `feature.produce_marketplace` | off | Region pilot → national | Logistics partnership readiness |
| `feature.consumer_app` | off | Beta users only | Separate app bundle |