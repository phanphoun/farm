export type UserRole = "farmer" | "vendor" | "expert" | "ngo" | "admin";

export interface User {
  id: string;
  name?: string;
  displayName?: string;
  email: string;
  phone?: string;
  avatar?: string;
  avatarUrl?: string;
  role: UserRole;
  roles?: UserRole[];
  bio?: string;
  location?: string;
  isVerified?: boolean;
  status?: string;
  createdAt: string;
  followersCount?: number;
  followingCount?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Post {
  id: string;
  content: string;
  images?: string[];
  videos?: string[];
  author: User;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  tags?: string[];
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  postId: string;
  parentId?: string;
  createdAt: string;
  likesCount: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  category: string;
  condition: "new" | "used";
  location: string;
  seller: User;
  stock: number;
  rating: number;
  reviewsCount: number;
  isOrganic: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: User;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  lessonsCount: number;
  studentsCount: number;
  rating: number;
  isFree: boolean;
  price?: number;
  progress?: number;
  language: "km" | "en";
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  questions: Question[];
  timeLimit?: number;
  passingScore: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Farm {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  address: string;
  size: number;
  sizeUnit: string;
  crops: Crop[];
  owner: User;
  createdAt: string;
}

export interface Crop {
  id: string;
  name: string;
  variety: string;
  plantedDate: string;
  expectedHarvest: string;
  area: number;
  status: "growing" | "harvested" | "failed";
  health: "good" | "fair" | "poor";
  image?: string;
}

export interface FarmTask {
  id: string;
  title: string;
  description: string;
  farmId: string;
  assignedTo?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  dueDate: string;
  createdAt: string;
}

export interface FinanceRecord {
  id: string;
  farmId: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface Transaction extends FinanceRecord {}

export interface Expert {
  id: string;
  user: User;
  specialization: string;
  experience: number;
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  availability: string[];
  bio: string;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  expert: Expert;
  user: User;
  date: string;
  timeSlot: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  type: "video" | "in_person" | "phone";
  notes?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: "text" | "image" | "file";
  createdAt: string;
  readAt?: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: ChatMessage | null;
  unreadCount: number;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type:
    | "like"
    | "comment"
    | "follow"
    | "message"
    | "order"
    | "system"
    | "reminder"
    | "booking";
  title: string;
  description: string;
  userId: string;
  fromUser?: User;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  images?: string[];
  createdAt: string;
}

export interface AIConversation {
  id: string;
  title: string;
  messages: AIChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  membersCount: number;
  members?: User[];
  isJoined: boolean;
  category: string;
  createdBy?: string;
  createdAt: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  completedAt: string;
  answers: number[];
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  certificateNumber: string;
  issuedAt: string;
  expiresAt?: string;
  qrToken: string;
  status: "valid" | "revoked" | "expired";
}

export interface CertificationApplication {
  id: string;
  userId: string;
  inspectorId?: string;
  type: string;
  status: "submitted" | "under_review" | "inspections_scheduled" | "approved" | "rejected" | "issued";
  documents: string[];
  notes?: string;
  inspectionDate?: string;
  certificateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inspection {
  id: string;
  applicationId: string;
  inspectorId: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  result?: "passed" | "failed";
  notes?: string;
}

export interface Order {
  id: string;
  buyerId: string;
  items: CartItem[];
  total: number;
  currency: string;
  address: string;
  phone: string;
  paymentMethod: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
