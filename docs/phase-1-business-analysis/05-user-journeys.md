# FarmJumnoy - Phase 1: User Journey Maps

## Journey Mapping Framework

Each journey follows: **Trigger → Discovery → Onboarding → Core Value → Habit → Advocacy**

---

## Journey 1: Sreyneath (Young Farmer) — "First Harvest with FarmJumnoy"

### Phase 1: Trigger & Discovery (Week 1)

| Step | Channel | Action | Thought/Feeling | Pain Point | FarmJumnoy Touchpoint |
|------|---------|--------|-----------------|------------|----------------------|
| 1.1 | Village meeting | Cooperative chief announces "Digital farming app with free expert advice" | "Maybe this can help my yardlong bean problem" | Distrust of new tech | Cooperative endorsement (trust signal) |
| 1.2 | Agro-dealer | Dealer shows app on his phone: "See this disease ID? I use it now" | "Dealer I trust uses it..." | Dealer influence | Dealer as Digital Champion |
| 1.3 | Phone | Downloads from Play Store (50MB, works on 3G) | "Hope it's in Khmer" | Language barrier | Khmer-first onboarding |
| 1.4 | App open | Voice-guided onboarding (Khmer): "Welcome! Let's set up your farm" | "Oh, it speaks Khmer!" | Low literacy | Voice-first UX |

### Phase 2: Onboarding (Week 1-2)

| Step | Screen/Flow | Action | Key Design Decision |
|------|-------------|--------|---------------------|
| 2.1 | Farm Setup | Draws farm boundary on satellite map (tap corners) | Offline-capable; auto-save to local DB |
| 2.2 | Crop Calendar | Selects "Yardlong Bean" → auto-populates planting calendar | Pre-filled from MAFF calendar; editable |
| 2.3 | Problem Report | Takes photo of yellow leaves → AI: "Possible Bean Fly — 87% confidence" | On-device TensorFlow Lite; works offline |
| 2.4 | Expert Chat | Taps "Ask Expert" → types voice message in Khmer | Speech-to-text (Khmer); queue <30 min |
| 2.5 | Recommendation | Receives: "Spray Neem oil 2ml/L every 7 days. Buy verified here →" | Direct marketplace link; vendor verified |

### Phase 3: Core Value Realization (Month 1-3)

| Milestone | Feature | Value Delivered | Metric |
|-----------|---------|-----------------|--------|
| First AI diagnosis | Disease ID | Saved crop, avoided wrong pesticide | 1 diagnosis/week |
| First expert reply | Consultation | Trusted advice, learned IPM | 2 consults/month |
| First course complete | Education | "IPM Basics" certificate earned | 1 course/month |
| First marketplace order | Commerce | Drip kit delivered, pay-later via Wing | 1 order/season |
| First harvest log | Farm Mgmt | Digital record: 1.2 ton/ha (vs 0.9 baseline) | Yield tracked |

### Phase 4: Habit Formation (Month 3-6)

| Habit | Trigger | Action | Reward |
|-------|---------|--------|--------|
| Morning check | Push: "Rain forecast 80% — delay spray" | Opens app, adjusts task | Avoided wash-off loss |
| Weekly market price | Notification: "Yardlong bean ₭8,500/kg (+12%)" | Checks price, plans harvest | Better sale timing |
| Monthly course | "New course: Organic Cert Prep" | Enrolls, watches 15 min/day | Certification progress |
| Seasonal planning | Calendar alert: "Land prep in 2 weeks" | Opens farm planner | Organized season |

### Phase 5: Advocacy (Month 6+)

| Action | Motivation | FarmJumnoy Support |
|--------|------------|-------------------|
| Refers 3 neighbor farmers | "You saved my crop" | Referral bonus: 1 month Premium free |
| Shares harvest photo on FB | Pride in yield increase | Auto-generated share card with FarmJumnoy watermark |
| Becomes cooperative digital helper | Respected in village | "Digital Champion" badge, training access |
| Gives app 5★ review | Genuine satisfaction | Prompted after certification milestone |

---

## Journey 2: Vuthy (Coop Leader) — "Digitizing the Cooperative"

### Phase 1: Trigger (Quarterly Planning)

| Context | Trigger |
|---------|---------|
| Coop AGM approaching; EU buyer requires digital traceability; donor demands real-time reporting | "We need a system, not more spreadsheets" |

### Phase 2: Evaluation & Pilot (Month 1)

| Step | Activity | Decision Criteria |
|------|----------|-------------------|
| 2.1 | Demo call with FarmJumnoy sales (Khmer/English) | Feature fit: EUDR, multi-farm, offline, Khmer |
| 2.2 | Pilot with 10 progressive farmers (3 months) | Adoption >70%; data quality; farmer feedback |
| 2.3 | Board presentation with pilot data | ROI: time saved, error reduction, buyer interest |
| 2.4 | Signs coop enterprise contract | Volume discount; dedicated support; data ownership |

### Phase 3: Rollout (Month 2-4)

| Week | Activity | Success Indicator |
|------|----------|-------------------|
| 1-2 | Admin setup: Farm registry import (CSV/GPS), member roles | 150 farms mapped |
| 3-4 | Digital Champion training: 5 youth members as field agents | 5 agents certified |
| 5-8 | Member onboarding: Village meetings + agent-assisted signup | 100+ farmers active |
| 9-12 | Parallel run: Paper + digital; reconcile weekly | <5% discrepancy |

### Phase 4: Value Realization (Month 4-12)

| Capability | Before FarmJumnoy | After FarmJumnoy | Impact |
|------------|-------------------|------------------|--------|
| EUDR Audit Prep | 3 weeks manual | 2 hours auto-report | 95% time saved |
| Input Bulk Order | Phone calls, errors | Pooled cart, auto-split | 15% cost reduction |
| Member Communication | Loudspeaker, LINE blast | Targeted in-app + SMS | 90% read rate |
| Donor Reporting | 6 weeks manual | Real-time dashboard | Continuous compliance |
| Youth Engagement | Low | High (tech role) | Succession pipeline |

---

## Journey 3: Dr. Sopheak (Expert) — "Scaling Expertise"

### Phase 1: Onboarding (Week 1)

| Step | Action | Platform Support |
|------|--------|------------------|
| 1.1 | Applies via "Become Expert" → uploads degrees, MAFF license | Auto-verify via MAFF API |
| 1.2 | Profile creation: Specialties, languages, rates, availability | Template + AI suggestions |
| 1.3 | Calibration: Answers 20 test questions (quality baseline) | AI scoring; human review |
| 1.4 | Goes live: Profile visible to farmers | Featured in "Plant Pathology" category |

### Phase 2: Daily Workflow (Ongoing)

| Time | Activity | Platform Feature |
|------|----------|------------------|
| 7:00 AM | Reviews overnight queries (AI pre-screened) | AI triage: routes simple → FAQ, complex → expert |
| 7:30 AM | Answers 5 voice messages (Khmer) via mobile | Voice replies transcribed; saved to knowledge base |
| 8:00 AM | Live video consult: 30 min with farmer in Takeo | Integrated Jitsi; screen share; auto-record |
| 9:00 AM | Reviews certification inspection (digital checklist) | Inspector app: GPS, photos, offline sync |
| 10:00 AM | Records 15-min lesson for "Rice Blast Management" | In-app recorder; auto-captions; chapter markers |

### Phase 3: Passive Income Growth (Month 3+)

| Product | Creation Effort | Monthly Revenue (Projected) |
|---------|-----------------|----------------------------|
| "Rice Disease Masterclass" (6 hrs) | 2 weeks recording | $500 (50 students × $10) |
| Monthly subscription: "Ask Dr. Sopheak" | Ongoing (5 hrs/wk) | $800 (40 subs × $20) |
| Certification inspections | 4/month × 2 hrs | $600 ($150/inspection) |
| **Total** | | **$1,900/mo** |

---

## Journey 4: Sokha (Vendor) — "Digital Transformation"

### Phase 1: Pain-Driven Adoption

| Pain | FarmJumnoy Solution |
|------|---------------------|
| "Farmers message me 10pm on Messenger asking prices" | Public catalog with real-time prices; auto-reply bot |
| "I deliver wrong fertilizer, farmer angry" | Expert-verified product tags; farmer sees "Recommended for Yardlong Bean" |
| "Cash only, no Records for Bank Loan" | Digital payments → transaction history → credit score |
| "Stock expires, I lose money" | Demand forecast: "Next month: 200 bags NPK predicted" |

### Phase 2: Vendor Dashboard Adoption

| Feature | Week 1 | Month 1 | Month 3 |
|---------|--------|---------|---------|
| Product Catalog | 50 SKUs uploaded | 200 SKUs + bundles | 500 SKUs + expert tags |
| Orders | 5/week (test) | 50/week | 200/week |
| Installment Sales | 0 | 10% of orders | 35% of orders |
| Inventory Alerts | Manual | Auto (AI) | Predictive (ML) |

---

## Journey 5: Makara (NGO) — "Program Digitalization"

### Phase 1: Partnership Setup

| Step | Activity | Outcome |
|------|----------|---------|
| 1.1 | MOU signed: Data sharing, co-branding, M&E integration | Legal framework |
| 1.2 | Custom dashboard configured: Donor indicators, language | Branded "CARE-FarmJumnoy" |
| 1.3 | Field staff trained (ToT on digital M&E) | 20 enumerators certified |

### Phase 2: Program Execution

| Traditional M&E | FarmJumnoy Digital M&E |
|-----------------|------------------------|
| Paper survey → 3 mo lag | In-app survey → Real-time |
| 20% data loss | <2% (offline sync) |
| Enumerator bias | Photo/GPS verification |
| $15/farmer survey cost | $2/farmer (digital) |
| Static report | Live donor dashboard |

---

## Cross-Cutting Journey Elements

### Offline-First Flow (All Personas)

```
User Action → Local DB (IndexedDB/SQLite) → Queue → Background Sync (when online)
     ↓
UI shows "Pending sync" badge → Auto-retry → Conflict resolution → Confirmed
```

### Multilingual Flow

```
Content Language Priority: User Pref → Device Locale → Geo-IP → Default (Khmer)
     ↓
Missing Translation → Fallback to English → Flag for Translation → Community/Pro Review
```

### Notification Cascade (All Personas)

| Channel | Priority | Use Case |
|---------|----------|----------|
| In-App | Real-time | Chat, price alerts, task due |
| Push (FCM) | High | Weather warning, expert reply, order status |
| SMS | Critical | Pest outbreak, payment failure, certification deadline |
| IVR/Voice Call | Emergency | Flood warning, urgent recall |
| LINE/Telegram | Opt-in | Daily price, weekly summary |

---

## Journey Metrics Dashboard

| Journey | Activation Metric | Retention Metric | Monetization Metric | Advocacy Metric |
|---------|-------------------|------------------|---------------------|-----------------|
| **Farmer (Sreyneath)** | Farm setup complete | MAU Month 3 > 60% | First purchase < 30 days | Referral code used |
| **Coop Leader (Vuthy)** | 50% members onboarded | Monthly admin login | Enterprise renewal | Member NPS > 50 |
| **Expert (Dr. Sopheak)** | First paid consult | Monthly active weeks | $500+ mo revenue | Course rating > 4.5 |
| **Vendor (Sokha)** | Catalog > 50 SKUs | Weekly order check | 20% online revenue | Farmer rating > 4.0 |
| **NGO (Makara)** | Dashboard configured | Monthly report export | Program renewal | Data quality score |

---

## Journey Optimization Opportunities

### Quick Wins (Month 1-3)
- [ ] Voice onboarding in 5 Khmer dialects
- [ ] Dealer-assisted signup QR codes (scan → pre-filled)
- [ ] Offline disease ID for top 20 crops
- [ ] SMS-based price alerts (no app needed)

### Medium Term (Month 3-6)
- [ ] AI-generated personalized crop calendar
- [ ] Peer-to-peer farmer matching (same crop, nearby)
- [ ] Gamified learning: streaks, badges, leaderboards
- [ ] Group buying: "5 farmers = bulk discount unlocked"

### Long Term (Month 6-12)
- [ ] Predictive yield forecast per farm (satellite + AI)
- [ ] Automated certification renewal reminders
- [ ] Dynamic pricing: vendor bids for farmer orders
- [ ] Carbon credit estimation per farm practice