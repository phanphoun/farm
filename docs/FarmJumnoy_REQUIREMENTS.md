# FARMJUMNOY – COMPLETE PROJECT REQUIREMENTS DOCUMENT

# 1. PROJECT OVERVIEW
FarmJumnoy is a Cambodia Agritech Super App combining social networking, marketplace, AI farming assistant, learning platform, and farm management tools.

# 2. BUSINESS ANALYSIS
Problem: Farmers lack knowledge, market access, and digital tools.
Solution: Unified AI-powered agritech platform.
Revenue: subscriptions, marketplace fees, consultations, certifications.

# 3. SYSTEM ARCHITECTURE

Frontend: Next.js 16 (PWA, React 19, Tailwind, Shadcn UI)
Backend: NestJS (modular monolith, Node.js, Prisma)
Database: PostgreSQL + PostGIS
Cache/Queue: Redis + BullMQ
AI: OpenAI + LangChain + Qdrant
Realtime: Socket.io
Storage: AWS S3

Architecture:
Frontend -> API Gateway (NestJS) -> Modules -> DB / Redis / AI / Storage

# 4. CORE MODULES
- Social Network (posts, comments, likes, feed)
- Marketplace (products, cart, orders)
- Learning (courses, quizzes, certificates)
- AI Assistant (chat + crop disease detection)
- Farm Management (GIS, crops, tasks, finance)
- Consultation (booking system)
- Certification (verification system)
- Notifications (real-time + email)

# 5. API CONTRACT

AUTH:
POST /api/auth/login
POST /api/auth/register
GET /api/auth/me

SOCIAL:
GET /api/feed
POST /api/posts
POST /api/comments

MARKETPLACE:
GET /api/products
POST /api/orders

AI:
POST /api/ai/chat
POST /api/ai/image-analysis

FARM:
POST /api/farms
GET /api/farms

# 6. DATABASE MODELS
Users, Posts, Comments, Products, Orders, Farms, Courses, AILogs, Notifications

# 7. SYSTEM FLOW
User -> Frontend -> Backend -> Services -> DB / AI / Queue -> Response

# 8. DEPLOYMENT
MVP: Docker Compose
Production: AWS (RDS, S3, CloudFront, ECS/K8s later)

# 9. SECURITY
JWT auth, RBAC, rate limiting, validation, encryption

# 10. FINAL GOAL
Full production agritech ecosystem for Cambodia farmers.
