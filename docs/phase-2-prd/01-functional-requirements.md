# FarmJumnoy - Phase 2: Product Requirements Document (PRD)

## Document Control

| Field | Value |
|-------|-------|
| **Version** | 1.0 |
| **Status** | Draft for Review |
| **Author** | Product Team (Multi-disciplinary) |
| **Last Updated** | 2025-06-11 |
| **Reviewers** | CTO, CPO, VP Engineering, Security Lead, UX Lead |
| **Approval** | Pending |

---

## 2.1 Product Overview

### 2.1.1 Vision Statement
> **FarmJumnoy** is the unified digital ecosystem that empowers Southeast Asian farmers to learn, connect, trade, certify, and thrive — combining agricultural education, social networking, marketplace, certification, expert consultation, and AI advisory in one Khmer-first, offline-capable platform.

### 2.1.2 Product Principles

| Principle | Description | Decision Rule |
|-----------|-------------|---------------|
| **Farmer-First** | Every feature must demonstrably increase farmer yield, income, or knowledge | Reject features without farmer value proof |
| **Khmer-First** | Full parity in Khmer (UI, content, voice, support) before any other language | Block release if Khmer < 100% |
| **Offline-Capable** | Core flows work without internet; sync when online | No feature ships without offline design |
| **Trust-by-Design** | Verified identities, expert credentials, transparent ratings, audit trails | No anonymous high-stakes actions |
| **Inclusive Access** | Works on $50 phones, 2G/3G, low literacy, disabilities | Test on lowest-spec target device |
| **Data Sovereignty** | Farmer owns their data; consent-first; portable; deletable | Privacy-by-design in every feature |
| **Regulatory Alignment** | Built for MAFF/GDA compliance; EUDR-ready; PDPA-compliant | Legal review for every data flow |

---

## 2.2 Functional Requirements

### Module 1: Authentication & User Management (AUTH)

| ID | Requirement | Priority | Details |
|----|-------------|----------|---------|
| AUTH-001 | Multi-role registration (Farmer, Expert, Vendor, NGO, Gov, Admin) | P0 | Role-specific onboarding flows; KYC for Expert/Vendor/NGO/Gov |
| AUTH-002 | Social login (Facebook, Google, Apple) + Phone/Email + OTP | P0 | SMS OTP (Twilio/Vonage); Voice OTP fallback; Khmer SMS templates |
| AUTH-003 | RBAC with 8 roles + granular permissions | P0 | Policy-based (Laravel Gates/Policies); resource-level permissions |
| AUTH-004 | Two-Factor Authentication (TOTP, SMS, Email) | P1 | Required for Expert/Vendor/NGO/Gov/Admin; optional for Farmer |
| AUTH-005 | Session management: device list, revoke, concurrent limit | P1 | Max 3 devices (Farmer), 5 (Expert), unlimited (Admin) |
| AUTH-006 | Account recovery: trusted contacts, backup codes, support escalation | P1 | Khmer support flow; 24hr SLA for Expert+ |
| AUTH-007 | Impersonation (Admin only, audit logged) | P2 | For support; requires MFA + reason; 15-min expiry |
| AUTH-008 | Delegated access (Farmer → Family member, Coop → Leader) | P2 | Time-bound, scope-limited, revocable |

### Module 2: Farmer Social Network (SOCIAL)

| ID | Requirement | Priority | Details |
|----|-------------|----------|---------|
| SOC-001 | User profiles: avatar, bio, farm summary, badges, verification status | P0 | Public/private toggles; Khmer/English bilingual |
| SOC-002 | Posts: text, photos (multi), videos (≤5min), polls, crop updates | P0 | Rich text editor; hashtags; location tag; crop tag |
| SOC-003 | Feed algorithm: following + relevance (crop, region, language) | P0 | Chronological + ML ranking; "Latest" toggle |
| SOC-004 | Comments, reactions (like, celebrate, learn, question), shares | P0 | Reaction types map to learning/support |
| SOC-005 | Follow/Unfollow; Farmer-to-Farmer, Farmer-to-Expert, Farmer-to-Vendor | P0 | Mutual follow = connection; Expert follow = subscription |
| SOC-006 | Groups/Communities: public, private, invite-only; roles (admin, mod, member) | P1 | Coop groups, crop-specific, region-based; max 10K members |
| SOC-007 | Real-time chat: 1:1, group; text, voice note, image, location, contact card | P0 | Laravel Reverb; E2E encryption option; offline queue |
| SOC-008 | Notifications: in-app, push, SMS, email; preferences per type/channel | P0 | Smart batching; quiet hours (22:00-06:00 local) |
| SOC-009 | Content moderation: user reports, AI filter (Khmer), human review queue | P1 | Khmer hate speech, misinformation, spam detection |
| SOC-010 | Stories/Highlights: 24hr ephemeral content for daily farm updates | P2 | Vertical video; auto-caption (Khmer); save to profile |

### Module 3: Educational Learning Platform (EDU)

| ID | Requirement | Priority | Details |
|----|-------------|----------|---------|
| EDU-001 | Course catalog: categories, levels, languages, duration, price, ratings | P0 | Free + Premium tiers; Khmer mandatory; video + text + quiz |
| EDU-002 | Course structure: modules → lessons → topics; prerequisites; drip schedule | P0 | SCORM-compliant export; progress tracking per lesson |
| EDU-003 | Content types: video (HLS/DASH), audio, PDF, interactive, AR demo | P0 | Offline download (DRM for paid); adaptive bitrate |
| EDU-004 | Assessments: quiz (MCQ, multi-select, order), assignment (peer/expert review), exam (proctored) | P1 | Question bank; randomized; time limits; certificate gate |
| EDU-005 | Certificates: PDF + blockchain anchor (optional); QR verification; expired/renewable | P0 | MAFF-co-branded for official courses; shareable |
| EDU-006 | Learning paths: curated sequences (e.g., "Organic Rice Specialist") | P1 | Prerequisite enforcement; progress dashboard; career mapping |
| EDU-007 | Instructor tools: course builder, analytics, revenue, student Q&A, live sessions | P0 | Revenue split: 70/30 (instructor/platform) after fees |
| EDU-008 | Student dashboard: progress, certificates, bookmarks, notes, study reminders | P0 | Offline progress sync; streak gamification |
| EDU-009 | Corporate/Coop/NGO bulk enrollment + group analytics | P1 | SCIM provisioning; cohort tracking; custom branding |
| EDU-010 | Content marketplace: experts sell courses; platform takes commission | P1 | Price tiers: KHR/USD; regional pricing; coupon codes |

### Module 4: AI Agricultural Assistant (AI)

| ID | Requirement | Priority | Details |
|----|-------------|----------|---------|
| AI-001 | Multimodal chat: text (Khmer/English), voice (Khmer STT/TTS), image (crop photo) | P0 | Primary interface; fallback to menu-based for low literacy |
| AI-002 | Crop diagnosis: image → disease/pest/nutrient ID + confidence + treatment protocol | P0 | TensorFlow Lite on-device (offline); cloud fallback for complex |
| AI-003 | Advisory chat: RAG over Khmer knowledge base (MAFF, CARDI, FAO, expert content) | P0 | Citations shown; confidence score; "Ask Expert" escalation |
| AI-004 | Personalized recommendations: variety, planting date, fertilizer, irrigation | P1 | Based on farm profile, soil, weather, history, market prices |
| AI-005 | Yield prediction: satellite (Sentinel-2) + weather + practice → harvest forecast | P1 | Per-field; update weekly; confidence interval |
| AI-006 | Weather alerts: hyperlocal (1km), Khmer voice, actionable advice | P0 | Push/SMS/IVR; "Rain in 2hr → delay spray" |
| AI-007 | Market price forecast: commodity + region + seasonality → 30-day prediction | P1 | Source: MAFF, AMIS, marketplace transactions |
| AI-008 | Farm planner: seasonal calendar, task scheduler, input calculator, budget | P1 | Voice-guided; offline; exports to calendar |
| AI-009 | Expert escalation: seamless handoff AI → Human with context transfer | P1 | Queue <30 min; expert sees AI transcript + farm data |
| AI-010 | Feedback loop: farmer rates AI advice → retrains model; expert corrects → knowledge base | P0 | Continuous learning; hallucination tracking <5% |

### Module 5: AgriTech Marketplace (MARKET)

| ID | Requirement | Priority | Details |
|----|-------------|----------|---------|
| MKT-001 | Product catalog: categories (seeds, fertilizer, equipment, IoT, services), variants, specs | P0 | Expert-verified badge; certification tags (organic, GAP); Khmer specs |
| MKT-002 | Vendor dashboard: inventory, orders, analytics, promotions, reviews, payouts | P0 | Multi-location stock; auto-reorder alerts; commission reporting |
| MKT-003 | Search & discovery: filters (crop, region, price, cert, rating), semantic search | P0 | Khmer search; voice search; "Recommended for your farm" |
| MKT-004 | Cart & checkout: guest + logged in; split vendor orders; COD, Wing, TrueMoney, ABA, Card, Installment | P0 | Khmer checkout; installment via partner (Wing/TrueMoney); COD default |
| MKT-005 | Order management: tracking (vendor → farmer), delivery confirmation, dispute, return | P0 | Real-time driver tracking (optional); photo POD; 7-day return |
| MKT-006 | Reviews & ratings: verified purchase only; photo/video; expert endorsement | P0 | Helpful votes; vendor response; AI summary ("Great for rice, fast delivery") |
| MKT-007 | Vendor onboarding: KYC, bank account, commission agreement, catalog import (CSV/API) | P0 | Tiered commissions: 5-12% by category; premium placement auction |
| MKT-008 | Group buying: farmers pool orders → volume discount → split delivery | P1 | Coop-led; min quantity trigger; deadline; auto-split |
| MKT-009 | Subscription/Recurring: seasonal input packages, sensor data plans | P1 | Pause/skip; prorate; farm-linked |
| MKT-010 | Produce marketplace (Farmer → Buyer): listings, grades, logistics, escrow | P2 | Grade standards (MAFF); cold chain partners; trade finance |

### Module 6: Certification System (CERT)

| ID | Requirement | Priority | Details |
|----|-------------|----------|---------|
| CERT-001 | Certification types: Organic, GAP, Fair Trade, Carbon, Custom (NGO/Gov) | P0 | Configurable standards; versioned; multi-language |
| CERT-002 | Application workflow: Farmer/Coop applies → docs upload → review → inspect → decide | P0 | Digital forms (Khmer); required docs checklist; auto-save |
| CERT-003 | Inspector app (mobile): offline checklists, GPS-tagged photos, voice notes, auto-report | P0 | Assigned by cert body; calendar sync; sync on WiFi |
| CERT-004 | Certificate issuance: PDF + QR + blockchain hash (optional); validity period; renewal | P0 | MAFF co-sign for official; public verification page |
| CERT-005 | Traceability: Farm → Plot → Crop → Input → Practice → Harvest → Buyer | P1 | EUDR-ready: geoJSON polygons, harvest dates, input records |
| CERT-006 | Group certification: Coop manages member compliance; sampling protocol; shared cost | P1 | Internal control system (ICS); lead farmer roles |
| CERT-007 | Marketplace integration: Certified products get badge, filter, premium placement | P0 | Premium buyers filter by cert; price premium tracking |
| CERT-008 | Auditor/Regulator portal: read-only access, audit trails, sampling tools | P2 | MAFF/GDA access; data export; compliance dashboards |

### Module 7: Expert Consultation (CONSULT)

| ID | Requirement | Priority | Details |
|----|-------------|----------|---------|
| CON-001 | Expert profiles: credentials, specialties, languages, rates, availability, ratings | P0 | Verified badge; MAFF license check; calendar sync |
| CON-002 | Booking: packages (15/30/60 min), subscription (monthly), pay-per-question | P0 | Khmer UI; timezone auto; buffer time; cancellation policy |
| CON-003 | Video consultation: Jitsi/Reverb; screen share; recording (consent); notes | P0 | Low-bandwidth mode; offline queue; Khmer captions |
| CON-004 | Chat consultation: async, threaded, multimedia, expert sets response SLA | P1 | Triage by AI first; expert sees summary |
| CON-005 | Payment: escrow hold → release after session; refund policy; platform fee 15% | P0 | Wing/TrueMoney/ABA/Card; instant payout to expert wallet |
| CON-006 | Ratings & reviews: detailed (knowledge, communication, value); expert response | P0 | Verified session only; weighted by session length |
| CON-007 | Expert earnings dashboard: sessions, revenue, ratings, tax docs, withdrawal | P0 | Monthly statement; KHR/USD; withholding tax calc |

### Module 8: Farm Management (FARM)

| ID | Requirement | Priority | Details |
|----|-------------|----------|---------|
| FRM-001 | Farm registry: multiple farms, plots (polygon GPS), crops, varieties, soil tests | P0 | Satellite-assisted boundary; offline edit; MAFF parcel ID link |
| FRM-002 | Crop cycle tracking: planting → activities → harvest → post-harvest per plot | P0 | Stage-based tasks; AI suggestions; photo timeline |
| FRM-003 | Activity logging: inputs (fertilizer, pesticide, seed), labor, machinery, irrigation | P0 | Voice entry; barcode scan (input packaging); unit conversion |
| FRM-004 | Expense & income tracking: categories, vendors, payment method, receipts (photo) | P0 | Multi-currency (KHR/USD); offline; export CSV/PDF |
| FRM-005 | Inventory: inputs on hand, expiry alerts, usage rate, reorder suggestions | P1 | QR scan to log usage; shared coop inventory |
| FRM-006 | Analytics dashboard: yield/ha, cost/ha, profit/crop, ROI, benchmark vs peers | P0 | Visual charts (Khmer labels); voice summary; export for loans |
| FRM-007 | Task management: recurring, weather-dependent, assigned (self/worker), reminders | P1 | Push/SMS/Voice; priority; completion proof (photo) |
| FRM-008 | Equipment/IoT: sensor pairing (soil moisture, weather station), data viz, alerts | P2 | MQTT/LoRaWAN; device marketplace; firmware OTA |

### Module 9: Dashboards & Analytics (DASH)

| ID | Requirement | Priority | Details |
|----|-------------|----------|---------|
| DSH-001 | Farmer Dashboard: crop health, income, learning, marketplace, certifications | P0 | Single screen; Khmer; voice summary; offline cached |
| DSH-002 | Expert Dashboard: consultations, courses, certifications, earnings, impact | P0 | Real-time; export; tax-ready |
| DSH-003 | Vendor Dashboard: sales, inventory, customers, reviews, payouts, ads | P0 | Cohort analysis; demand forecast |
| DSH-004 | Coop/NGO Dashboard: member adoption, yield aggregates, training completion, cert status | P0 | Role-based; data sharing agreements |
| DSH-005 | Admin Dashboard: platform health, users, revenue, content, moderation, security | P0 | Real-time; alerting; audit log |
| DSH-006 | Government/Regulator Dashboard: anonymized aggregates, compliance, pest surveillance | P1 | MAFF/GDA dedicated; official reporting formats |

---

## 2.3 Non-Functional Requirements

### 2.3.1 Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| **API Response (p95)** | <200ms | /api/* endpoints; exclude AI inference |
| **AI Inference (p95)** | <3s | Diagnosis, chat, recommendation |
| **Page Load (LCP)** | <2s | Mobile 3G; Next.js SSR + hydration |
| **Time to Interactive** | <3s | Lighthouse CI gate |
| **Realtime Latency** | <100ms | Reverb WebSocket; chat, notifications |
| **Offline Sync** | <5s | Background sync on reconnect |
| **Concurrent Users** | 100K | WebSocket connections; Reverb cluster |
| **Daily Active Users** | 1M | Horizontal scaling design |

### 2.3.2 Scalability

| Dimension | Target | Architecture |
|-----------|--------|--------------|
| **Registered Users** | 10M | Sharded user DB; read replicas |
| **Concurrent WebSocket** | 100K | Reverb + Redis Cluster + Horizon workers |
| **API Requests/Day** | 500M | Laravel Octane (Swoole/RoadRunner); CDN |
| **Media Storage** | 50TB | S3/R2 + Cloudflare Images; signed URLs |
| **Search Index** | 10M docs | Meilisearch cluster; multi-tenant |
| **AI Inferences/Day** | 10M | vLLM/Triton; GPU autoscaling; batch queue |

### 2.3.3 Security (OWASP Top 10 + Agri-Specific)

| Requirement | Implementation |
|-------------|----------------|
| **Authentication** | Laravel Sanctum (SPA) + Passport (API); JWT short-lived; refresh rotation |
| **Authorization** | Policy-based; resource-level; deny-by-default; audit all decisions |
| **Input Validation** | Laravel Form Requests; strict typing; XSS sanitization (HTMLPurifier) |
| **SQL Injection** | Eloquent ORM only; raw queries prohibited; static analysis (Psalm) |
| **CSRF** | Sanctum CSRF tokens; SameSite=Strict cookies; double-submit for APIs |
| **Rate Limiting** | Per-user, per-IP, per-endpoint; Redis-backed; adaptive (AI endpoints stricter) |
| **Encryption** | TLS 1.3 everywhere; AES-256 at rest (DB, S3); field-level encryption for PII |
| **Secrets** | HashiCorp Vault / AWS Secrets Manager; rotation; no .env in repo |
| **Audit Logging** | All authz decisions, data exports, admin actions, AI advice (immutable) |
| **Penetration Testing** | Quarterly external; continuous SAST/DAST in CI/CD |
| **Bug Bounty** | HackerOne/Intigriti; scope: *.farmjumnoy.com; rewards up to $10K |

### 2.3.4 Reliability & Availability

| Metric | Target | Strategy |
|--------|--------|----------|
| **Uptime (API)** | 99.9% | Multi-AZ; health checks; graceful degradation |
| **Uptime (Realtime)** | 99.5% | Reverb cluster; connection resume; offline queue |
| **RPO (Data Loss)** | 0 | Synchronous replication; point-in-time recovery |
| **RTO (Recovery)** | <15 min | Automated failover; runbook automation |
| **Backup** | Daily + hourly WAL | Cross-region; encrypted; tested monthly |

### 2.3.5 Accessibility & Inclusion

| Standard | Target |
|----------|--------|
| **WCAG 2.1** | AA compliance (all user-facing) |
| **Khmer Language** | 100% UI + content; RTL-ready for future |
| **Voice UI** | All core flows via voice (STT/TTS Khmer) |
| **Offline** | 90% core flows work offline |
| **Low-Spec Devices** | Tested on 2GB RAM, Android 10+, 320px width |
| **Color Blind** | Palettes tested; patterns + color |

### 2.3.6 Compliance & Legal

| Regulation | Scope | Implementation |
|------------|-------|----------------|
| **Cambodia Data Protection (Draft)** | All farmer data | Consent management; DPO; breach notification 72hr |
| **EUDR (EU Deforestation Regulation)** | Export farms | GeoJSON traceability; due diligence statements |
| **PDPA (Thailand/Vietnam/Indonesia)** | Regional users | Data localization options; cross-border transfer tools |
| **PCI DSS** | Payments | SAQ-A (outsourced to Wing/TrueMoney/Stripe); no card storage |
| **Accessibility Law** | Cambodia (pending) | WCAG 2.1 AA baseline |

---

## 2.4 MoSCoW Prioritization

### MUST HAVE (MVP - Months 1-6)
*Without these, product cannot launch*

| Module | Features |
|--------|----------|
| **AUTH** | Multi-role registration, OTP login, RBAC (Farmer/Expert/Vendor/Admin), session mgmt |
| **SOCIAL** | Profiles, posts (text/photo), feed, follow, 1:1 chat, push notifications |
| **EDU** | Course catalog, video lessons, quizzes, certificates (PDF), student dashboard |
| **AI** | Multimodal chat (text/voice/image), crop diagnosis (on-device), RAG advisory, weather alerts |
| **MARKET** | Product catalog, vendor dashboard, search, checkout (COD/Wing/TrueMoney), orders, reviews |
| **CERT** | Application workflow, inspector app (offline), certificate issuance (PDF+QR), traceability basics |
| **CONSULT** | Expert profiles, booking, video chat, payment (escrow), ratings |
| **FARM** | Farm/plot registry, crop cycle, activity logging, expense/income, analytics dashboard |
| **DASH** | Farmer, Expert, Vendor, Admin dashboards (core metrics) |
| **INFRA** | Laravel 12 + Next.js 16; MySQL 8 + Redis; Reverb; S3/R2; CI/CD; monitoring |

### SHOULD HAVE (Months 6-12)
*High value, differentiators, but not launch-blocking*

| Module | Features |
|--------|----------|
| **AUTH** | 2FA, delegated access, account recovery enhancements |
| **SOCIAL** | Groups/communities, stories, content moderation (AI + human) |
| **EDU** | Learning paths, instructor tools, bulk enrollment, content marketplace |
| **AI** | Yield prediction, market price forecast, farm planner, expert escalation, feedback loop |
| **MARKET** | Group buying, subscriptions, produce marketplace (Farmer→Buyer), escrow |
| **CERT** | Group certification, auditor portal, blockchain anchoring, EUDR full compliance |
| **CONSULT** | Chat consultation, subscription packages, tax docs |
| **FARM** | Inventory, task management, equipment/IoT pairing |
| **DASH** | Coop/NGO dashboard, Gov dashboard, advanced visualizations |
| **INFRA** | Meilisearch, Kubernetes, multi-region, advanced observability |

### COULD HAVE (Year 2)
*Nice-to-have, experimental, or deferred*

| Module | Features |
|--------|----------|
| **SOCIAL** | Live streaming, farmer influencers, social commerce |
| **EDU** | AR demos, VR farm tours, AI-generated personalized courses |
| **AI** | Carbon credit estimation, satellite pest detection, generative farm reports |
| **MARKET** | Dynamic pricing, vendor bidding, trade finance, futures contracts |
| **CERT** | Carbon certification, biodiversity credits, supply chain passport |
| **FARM** | Predictive maintenance (IoT), automated irrigation control |
| **NEW** | Consumer app (farm-to-table), agri-tourism, equipment rental marketplace |

### WON'T HAVE (Explicitly Deferred)
*Not in 2-year horizon*

- Cryptocurrency/token economy
- Autonomous drone operations
- Genetic engineering advisory
- Commodity futures trading
- Full ERP for large agribusiness (partner instead)
- Hardware manufacturing (IoT devices — platform only)

---

## 2.5 Acceptance Criteria Template

Each feature must pass:

```gherkin
Feature: [Feature Name]
  As a [role]
  I want to [action]
  So that [benefit]

  Scenario: [Happy Path]
    Given [precondition]
    When [action]
    Then [expected result]
    And [performance: <200ms API]
    And [accessibility: WCAG AA]
    And [offline: works without network]
    And [language: Khmer parity verified]
    And [security: no PII in logs, audit logged]

  Scenario: [Error/Edge Case]
    Given [failure condition]
    When [action]
    Then [graceful degradation]
    And [user-friendly Khmer error message]
    And [retry/offline queue behavior]
```

---

## 2.6 Dependencies & Risks

| Dependency | Risk | Mitigation |
|------------|------|------------|
| **Khmer STT/TTS quality** | Poor accuracy → voice UI unusable | Evaluate Google, Azure, local models; build evaluation set; fallback to menu |
| **Rural connectivity** | Offline sync conflicts; stale data | Conflict-free replicated data types (CRDT); last-write-wins + user resolution |
| **MAFF data sharing** | API unavailable; data quality | Build direct integrations where possible; cached fallback; periodic sync |
| **Payment gateway reliability** | Wing/TrueMoney downtime | Multi-gateway abstraction; COD fallback; status page monitoring |
| **AI hallucination** | Wrong advice → crop loss | Human-in-loop for high-stakes; confidence thresholds; insurance; disclaimer UI |
| **Talent acquisition** | Laravel/Next.js experts scarce in Cambodia | Remote-first; train juniors; partner with universities; competitive equity |

---

## 2.7 Success Metrics (KPIs)

### Primary (North Star)
- **Active Farmers with Verified Yield Increase** ≥ 25,000 by Month 12

### Leading Indicators

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| **Farmer MAU** | 5,000 | 15,000 | 25,000 |
| **Expert Active** | 50 | 150 | 300 |
| **Vendor Active** | 20 | 80 | 200 |
| **Courses Completed** | 500 | 3,000 | 10,000 |
| **AI Consultations/Month** | 1,000 | 10,000 | 50,000 |
| **Marketplace GMV** | $10K | $100K | $500K |
| **Certifications Issued** | 50 | 200 | 500 |
| **Consultation Sessions** | 100 | 1,000 | 5,000 |
| **NPS (Farmer)** | >30 | >40 | >50 |
| **NPS (Expert)** | >40 | >50 | >60 |

### Financial
- **ARR Month 12**: $500K (Conservative) / $1.5M (Aggressive)
- **CAC (Farmer)**: <$5 (organic/coop) / <$20 (paid)
- **LTV (Farmer)**: >$100 (Year 1) → >$300 (Year 3)
- **Gross Margin**: >70% (platform fees, low marginal cost)

---

## Appendix: Glossary

| Term | Definition |
|------|------------|
| **MAFF** | Ministry of Agriculture, Forestry and Fisheries (Cambodia) |
| **GDA** | General Directorate of Agriculture (Cambodia) |
| **CARDI** | Cambodian Agricultural Research and Development Institute |
| **PDA** | Provincial Department of Agriculture |
| **EUDR** | EU Deforestation Regulation (2023) |
| **GAP** | Good Agricultural Practices |
| **ICS** | Internal Control System (for group certification) |
| **MRV** | Measurement, Reporting, Verification (carbon) |
| **POD** | Proof of Delivery |
| **KYC** | Know Your Customer |
| **RAG** | Retrieval-Augmented Generation |
| **CRDT** | Conflict-free Replicated Data Type |