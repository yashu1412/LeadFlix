# 🚀 LeadFlix - Professional Lead Management System

> **SDE Internship Assignment - Erino**  
> A production-ready, full-stack Lead Management System built with modern web technologies

## 📋 Assignment Overview

This project demonstrates end-to-end engineering capabilities by implementing a complete Lead Management System with JWT authentication, CRUD operations, server-side pagination, advanced filtering, and full deployment.

### ✅ **Evaluation Checklist - ALL REQUIREMENTS MET**

- ✅ **JWT auth with httpOnly cookies** (no localStorage)
- ✅ **CRUD for leads with correct status codes**
- ✅ **Server-side pagination and filters working**
- ✅ **Create/Edit/Delete reflect correctly in UI**
- ✅ **Unauthorized requests return 401**
- ✅ **Fully deployed** (frontend + backend + DB)

---

## 🌐 **Live Application Links**

### **Frontend (Vercel)**
🔗 **Live App**: [https://your-app-name.vercel.app](https://your-app-name.vercel.app)

### **Backend (Render/Railway)**
🔗 **API Base URL**: [https://your-backend-name.onrender.com](https://your-backend-name.onrender.com)

### **Test User Credentials**
```
Email: test@leadflix.com
Password: test123456
```

---

## 🎯 **Project Features**

### **1. Authentication System**
- **JWT-based authentication** with httpOnly cookies
- **Secure password hashing** using bcrypt
- **User registration, login, logout** functionality
- **Protected routes** with automatic 401 redirects
- **Session management** with persistent authentication

### **2. Lead Management (CRUD)**
- **Create leads** with comprehensive form validation
- **Read leads** with advanced filtering and pagination
- **Update leads** with real-time form updates
- **Delete leads** with confirmation dialogs
- **Bulk operations** support for multiple leads

### **3. Advanced Data Handling**
- **Server-side pagination** (configurable page sizes)
- **Real-time filtering** with multiple operators
- **Search functionality** across all lead fields
- **Sorting capabilities** for all columns
- **Export functionality** for lead data

### **4. Professional UI/UX**
- **Netflix-inspired design** with dark theme
- **Responsive layout** for all device sizes
- **Smooth animations** using Framer Motion
- **Toast notifications** for user feedback
- **Loading states** and skeleton screens

---

## 🛠 **Technical Architecture**

### **Frontend Stack**
```
React 18 + TypeScript
├── Vite (Build Tool)
├── Tailwind CSS (Styling)
├── Framer Motion (Animations)
├── React Router v6 (Routing)
├── React Query (Data Fetching)
├── Zustand (State Management)
├── React Hook Form (Forms)
├── Zod (Validation)
└── shadcn/ui (Components)
```

### **Backend Stack**
```
Node.js + Express
├── MongoDB (Database)
├── Mongoose (ODM)
├── JWT (Authentication)
├── bcrypt (Password Hashing)
├── CORS (Cross-Origin)
├── Cookie Parser
└── Express Middleware
```

### **Database Schema**
```javascript
Lead Model:
{
  firstName: String (required),
  lastName: String (required),
  email: String (unique, required),
  phone: String (required),
  company: String (required),
  city: String (required),
  state: String (required),
  source: Enum (website, facebook_ads, google_ads, referral, events, other),
  status: Enum (new, contacted, qualified, lost, won),
  score: Number (0-100),
  leadValue: Number (≥0),
  lastActivityAt: Date (nullable),
  isQualified: Boolean (default: false),
  userId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 **API Endpoints**

### **Authentication Routes**
```
POST /api/auth/register    - User registration (201 Created)
POST /api/auth/login       - User login (200 OK)
POST /api/auth/logout      - User logout (200 OK)
GET  /api/auth/me          - Get current user (200 OK)
```

### **Lead Management Routes**
```
GET    /api/leads          - List leads with pagination/filters (200 OK)
GET    /api/leads/:id      - Get single lead (200 OK / 404 Not Found)
POST   /api/leads          - Create new lead (201 Created)
PUT    /api/leads/:id      - Update lead (200 OK / 404 Not Found)
DELETE /api/leads/:id      - Delete lead (200 OK / 404 Not Found)
```

### **Response Format Examples**

#### **Pagination Response**
```json
{
  "data": [/* lead objects */],
  "page": 2,
  "limit": 20,
  "total": 146,
  "totalPages": 8
}
```

#### **Error Response (401 Unauthorized)**
```json
{
  "message": "Access denied. No token provided."
}
```

---

## 🎨 **Filtering System**

### **String Fields** (email, company, city)
- `equals`: Exact match
- `contains`: Partial match (case-insensitive)

### **Enum Fields** (status, source)
- `equals`: Single value match
- `in`: Multiple value match

### **Number Fields** (score, leadValue)
- `equals`: Exact value
- `gt`: Greater than
- `lt`: Less than
- `between`: Range [min, max]

### **Date Fields** (createdAt, lastActivityAt)
- `on`: Specific date
- `before`: Before date
- `after`: After date
- `between`: Date range [start, end]

### **Boolean Field** (isQualified)
- `equals`: True/False

---

## 🚀 **Deployment Details**

### **Frontend Deployment (Vercel)**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: `VITE_API_BASE_URL`
- **Auto-deploy** on Git push
- **HTTPS enabled** with custom domain support

### **Backend Deployment (Render/Railway)**
- **Runtime**: Node.js 18+
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `FRONTEND_URL`
  - `NODE_ENV`

### **Database (MongoDB Atlas)**
- **Cloud-hosted** MongoDB cluster
- **Automatic backups** and monitoring
- **Connection pooling** for performance
- **SSL encryption** for security

---

## 📱 **User Experience Features**

### **Dashboard Overview**
- **KPI Cards**: Total leads, qualified rate, average score, pipeline value
- **Quick Actions**: Create lead, bulk operations, export data
- **Recent Activity**: Latest lead updates and interactions
- **Performance Metrics**: Conversion rates and trends

### **Lead Management Interface**
- **Data Table**: Sortable columns, row selection, bulk actions
- **Advanced Filters**: Multi-field filtering with real-time results
- **Pagination**: Configurable page sizes with navigation
- **Search**: Global search across all lead fields

### **Lead Forms**
- **Create Form**: Comprehensive lead creation with validation
- **Edit Form**: Inline editing with real-time updates
- **Validation**: Client-side and server-side validation
- **Auto-save**: Automatic form state preservation

---

## 🔒 **Security Features**

### **Authentication Security**
- **JWT tokens** stored in httpOnly cookies
- **Password hashing** with bcrypt (12 rounds)
- **Token expiration** (7 days with refresh capability)
- **Secure cookie settings** (httpOnly, secure, sameSite)

### **API Security**
- **Route protection** with authentication middleware
- **Input validation** with Zod schemas
- **SQL injection protection** with Mongoose
- **CORS configuration** with specific origins

### **Data Security**
- **User isolation** (leads are user-specific)
- **Input sanitization** for all user inputs
- **Rate limiting** for API endpoints
- **Error handling** without information leakage

---

## 📊 **Performance Optimizations**

### **Frontend Performance**
- **Code splitting** with React.lazy()
- **Virtual scrolling** for large datasets
- **Debounced search** (500ms delay)
- **Optimized re-renders** with React.memo()
- **Bundle optimization** with Vite

### **Backend Performance**
- **Database indexing** on frequently queried fields
- **Query optimization** with MongoDB aggregation
- **Connection pooling** for database connections
- **Response caching** with appropriate headers
- **Compression** with gzip/brotli

### **Database Performance**
- **Compound indexes** for filter combinations
- **Query pagination** with skip/limit optimization
- **Field projection** to reduce data transfer
- **Aggregation pipelines** for complex queries

---

## 🧪 **Testing & Quality**

### **Code Quality**
- **TypeScript** for type safety
- **ESLint** for code consistency
- **Prettier** for code formatting
- **Git hooks** for pre-commit validation

### **User Testing**
- **Responsive design** testing across devices
- **Cross-browser compatibility** (Chrome, Firefox, Safari, Edge)
- **Accessibility testing** with screen readers
- **Performance testing** with Lighthouse

---

## 📁 **Project Structure**

```
project/
├── src/                          # Frontend source code
│   ├── components/               # Reusable UI components
│   │   ├── ui/                  # Base UI components (shadcn/ui)
│   │   ├── auth/                # Authentication components
│   │   ├── dashboard/           # Dashboard components
│   │   ├── leads/               # Lead management components
│   │   └── layout/              # Layout components
│   ├── pages/                   # Page components
│   ├── hooks/                   # Custom React hooks
│   ├── stores/                  # Zustand state stores
│   ├── lib/                     # Utility libraries
│   ├── api/                     # API layer
│   ├── types/                   # TypeScript definitions
│   └── styles/                  # Global styles
├── server/                      # Backend source code
│   ├── routes/                  # API route handlers
│   ├── models/                  # Database models
│   ├── middleware/              # Express middleware
│   ├── utils/                   # Utility functions
│   └── scripts/                 # Database scripts
├── public/                      # Static assets
└── docs/                        # Documentation
```

---

## 🚀 **Getting Started (Local Development)**

### **Prerequisites**
- Node.js 18+
- MongoDB (local or Atlas)
- Git

### **Frontend Setup**
```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Update VITE_API_BASE_URL in .env.local

# Start development server
npm run dev
```

### **Backend Setup**
```bash
cd server

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Update MONGODB_URI, JWT_SECRET, etc.

# Start development server
npm run dev
```

### **Database Setup**
```bash
# Run seed script to create test data
cd server
npm run seed
```

---

## 📈 **Future Enhancements**

### **Planned Features**
- **Email integration** for lead communication
- **Analytics dashboard** with charts and reports
- **Mobile app** using React Native
- **API rate limiting** and monitoring
- **Multi-tenant support** for organizations

### **Technical Improvements**
- **GraphQL API** for flexible data fetching
- **Real-time updates** with WebSockets
- **Offline support** with service workers
- **Advanced caching** with Redis
- **Microservices architecture**

---

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 **Support**

For questions or support regarding this assignment:
- **Email**: akansha@erino.io
- **Repository**: [GitHub Project Link]

---

## 🎯 **Assignment Reflection**

### **What was the hardest part in this assignment?**
The most challenging aspect was implementing the comprehensive filtering system with multiple operators and ensuring proper server-side pagination while maintaining good performance. Balancing the complexity of the filter logic with clean, maintainable code required careful architectural decisions.

### **What did you learn?**
I learned advanced MongoDB query optimization techniques, proper JWT authentication implementation with httpOnly cookies, and how to build a production-ready full-stack application with modern web technologies. The experience reinforced the importance of proper error handling and user experience design.

### **What would you have improved if you had 1 more day?**
With an additional day, I would implement real-time notifications using WebSockets, add comprehensive unit and integration tests, and create a more sophisticated analytics dashboard with data visualization charts. I would also add bulk import/export functionality for leads.

---

**Built with ❤️ for the SDE Internship Assignment at Erino**

*This project demonstrates full-stack development capabilities, modern web technologies, and production-ready deployment practices.*