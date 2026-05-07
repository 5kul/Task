# Complete Authentication & State Management Approach - DOMY Project

## Overview
This is a **full-stack MERN application** with JWT-based authentication and React Context API for state management. The system ensures secure user authentication, persistent sessions, and global auth state across the application.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ App.jsx (Entry Point)                                    │   │
│  │ - Routes setup                                           │   │
│  │ - Navigation with user state                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ AuthProvider (Context) - AuthContext.jsx                │   │
│  │ - Wraps entire app                                       │   │
│  │ - Manages: user state, login, register, logout, refresh │   │
│  │ - Stores token in localStorage                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Pages (Login, Register, Stories, Bookmarks)             │   │
│  │ - useAuth() hook for consuming context                  │   │
│  │ - API calls via axios instance                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ API Instance (api.js)                                    │   │
│  │ - Axios configured with base URL                        │   │
│  │ - setToken() sets Authorization header globally         │   │
│  │ - All requests include token automatically              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                       │
└─────────────────────────────────────────────────────────────────┘
                           ↓
              ┌────────────────────────────┐
              │ HTTP Requests + JWT Token  │
              │ Authorization: Bearer ...  │
              └────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Express)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ server.js                                                │   │
│  │ - Express app setup                                      │   │
│  │ - CORS enabled for frontend communication              │   │
│  │ - Routes mounting                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Auth Routes (routes/auth.js)                             │   │
│  │ - POST /api/auth/register                               │   │
│  │ - POST /api/auth/login                                  │   │
│  │ - GET /api/auth/me (protected)                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Auth Middleware (middleware/auth.js)                     │   │
│  │ - Extracts token from Authorization header              │   │
│  │ - Verifies JWT signature                                │   │
│  │ - Attaches decoded user (id) to req.user                │   │
│  │ - Returns 401 if invalid/missing                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Auth Controller (controllers/authController.js)          │   │
│  │ - register(): Hash password, create user, sign JWT      │   │
│  │ - login(): Verify credentials, sign JWT                 │   │
│  │ - me(): Fetch full user data + bookmarks               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ User Model (models/User.js)                              │   │
│  │ - Schema: username, email, password (hashed),          │   │
│  │           bookmarks (array of Story IDs)                │   │
│  │ - Enforces unique: username, email                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ MongoDB                                                  │   │
│  │ - Stores user data (hashed passwords)                   │   │
│  │ - Stores story references in bookmarks array            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Flow

### 1. **User Registration Flow**

**Frontend:**
```
User fills register form (username, email, password)
       ↓
Calls: register(username, email, password) from useAuth()
       ↓
API.post('/auth/register', { username, email, password })
       ↓
Receives: { token, user }
       ↓
setToken(token) → Axios sets Authorization header
       ↓
localStorage.setItem('token', token) → Persistent storage
       ↓
setUser(userData) → Updates global auth state
       ↓
Navigate to dashboard / home page
```

**Backend:**
```
Receives POST /api/auth/register
       ↓
Validates: username, email, password (6+ chars)
       ↓
Checks if user already exists (by username or email)
       ↓
bcrypt.hash(password, 10) → Securely hash password
       ↓
User.create({ username, email, password: hashed })
       ↓
jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' })
       ↓
Returns: { token, user: { id, username, email, bookmarks: [] } }
```

---

### 2. **User Login Flow**

**Frontend:**
```
User fills login form (username/email, password)
       ↓
Calls: login(identifier, password) from useAuth()
       ↓
API.post('/auth/login', { identifier, password })
       ↓
Receives: { token, user }
       ↓
setToken(token) → Axios sets Authorization header
       ↓
localStorage.setItem('token', token) → Persistent storage
       ↓
setUser(userData) → Updates global auth state
       ↓
Navigate to dashboard / home page
```

**Backend:**
```
Receives POST /api/auth/login
       ↓
Finds user by username OR email
       ↓
bcrypt.compare(password, user.password) → Verify password
       ↓
If valid:
  jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' })
  Returns: { token, user: { id, username, email, bookmarks } }
       ↓
If invalid:
  Returns 400: "Invalid credentials"
```

---

### 3. **Session Persistence (Auto-Login on Refresh)**

**Frontend (on App Load):**
```
App mounts
       ↓
useEffect runs (only once)
       ↓
Check: const token = localStorage.getItem('token')
       ↓
If token exists:
  setToken(token) → Set Authorization header
  Call: refresh() → GET /api/auth/me
       ↓
If valid:
  setUser(userData) → Restore user state
  User stays logged in
       ↓
If invalid:
  localStorage.removeItem('token')
  setToken(null)
  setUser(null)
  User logged out
```

---

### 4. **Protected Requests (Bookmarking Stories)**

**Frontend:**
```
User clicks bookmark button
       ↓
Calls: API.post('/stories/:id/bookmark')
       ↓
Axios automatically includes:
  Headers: { Authorization: 'Bearer <token>' }
       ↓
Request sent to backend
```

**Backend:**
```
Receives: POST /api/stories/:id/bookmark
       ↓
Auth Middleware (auth.js) runs:
  Extracts token from header: Authorization: Bearer ...
  jwt.verify(token, JWT_SECRET)
  Attaches: req.user = { id }
       ↓
Controller accesses req.user.id
  Finds user in database
  Toggles bookmark (add/remove story ID)
  Returns updated user with bookmarks
```

---

### 5. **Logout Flow**

**Frontend:**
```
User clicks logout button
       ↓
Calls: logout() from useAuth()
       ↓
localStorage.removeItem('token') → Clear persistent storage
       ↓
setToken(null) → Remove Authorization header from axios
       ↓
setUser(null) → Clear user state
       ↓
User redirect to login page
```

---

## Key Components Explained

### **Backend - Authentication Layer**

#### **models/User.js** (Database Schema)
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed with bcrypt),
  bookmarks: [ObjectId] (references to Story documents),
  timestamps: true (createdAt, updatedAt)
}
```

#### **controllers/authController.js** (Business Logic)
- **signToken(id)**: Creates JWT with user ID, expires in 7 days
- **userSafe(u)**: Returns safe user object (no password exposed)
- **register**: Validates input → hashes password → creates user → signs token
- **login**: Finds user → verifies password → signs token
- **me**: Returns current user with populated bookmarks

#### **middleware/auth.js** (Protection Layer)
- Extracts token from `Authorization: Bearer <token>` header
- Verifies JWT signature using JWT_SECRET
- Decodes token to get user ID
- Attaches to `req.user` for controllers to access
- Returns 401 if invalid/missing

#### **routes/auth.js** (Endpoints)
- `POST /auth/register` - PUBLIC
- `POST /auth/login` - PUBLIC
- `GET /auth/me` - PROTECTED (needs auth middleware)

---

### **Frontend - State Management Layer**

#### **context/AuthContext.jsx** (Global Auth State)
```javascript
AuthContext provides:
{
  user: { id, username, email, bookmarks },  // null if not logged in
  login(identifier, password),               // Returns user
  register(username, email, password),       // Returns user
  logout(),                                  // Clears state
  refresh()                                  // Syncs with server
}
```

**How it works:**
1. Created with `createContext()`
2. Wrapped around entire app in `AuthProvider`
3. Accessed via `useAuth()` hook in components
4. Automatically persists token to localStorage
5. Automatically restores user on page refresh

#### **api.js** (HTTP Client)
```javascript
- Axios instance with baseURL: 'http://localhost:5000/api'
- setToken(token) function adds token to all request headers
- All components use same API instance → consistent auth
```

---

## Security Features

### 1. **Password Security**
- Passwords hashed with bcrypt (cost factor: 10) before storage
- Never returned to frontend
- Compared using `bcrypt.compare()` during login

### 2. **JWT Token Security**
- Signed with `JWT_SECRET` environment variable
- 7-day expiration
- Contains only user ID (minimal payload)
- Verified on every protected request

### 3. **Token Storage**
- Stored in localStorage (accessible on refresh)
- Automatically included in Authorization header
- Removed on logout

### 4. **Protected Routes**
- Backend middleware validates token before processing
- Frontend can conditionally render (e.g., show login if !user)
- Some pages redirect if user not authenticated

### 5. **Input Validation**
- Email format validation (regex check)
- Password length requirement (6+ characters)
- Duplicate username/email prevention
- Trimmed and sanitized inputs

---

## Data Flow Example: Complete User Session

### **Initial Visit (No Token)**
```
1. Browser loads app
2. App.jsx mounts → AuthProvider wraps children
3. useEffect in AuthContext checks localStorage
4. No token found → user remains null
5. Nav shows: [Login] [Register] buttons
6. /bookmarks redirect to /login (protected page)
```

### **After Registration**
```
1. User fills form: username="john", email="john@test.com", password="pass123"
2. Frontend calls: POST /auth/register
3. Backend: bcrypt.hash("pass123") → hash stored in DB
4. Backend: jwt.sign({ id: "user123" }) → token = "eyJhbGc..."
5. Returns: { token, user: { id, username, email, bookmarks: [] } }
6. Frontend: localStorage.setItem('token', "eyJhbGc...")
7. Frontend: setToken("eyJhbGc...") → axios default header set
8. Frontend: setUser({ id, username, email, bookmarks: [] })
9. Nav shows: "Hi john" [Logout] button
10. User can now bookmark stories
```

### **On Bookmark Click (Protected Request)**
```
1. User clicks bookmark on story
2. Frontend: API.post('/stories/123/bookmark')
3. Axios adds: Authorization: Bearer eyJhbGc...
4. Backend receives token in header
5. Auth middleware: jwt.verify("eyJhbGc...") → { id: "user123" }
6. Sets: req.user = { id: "user123" }
7. Controller: User.findById("user123")
8. Toggles bookmark: add/remove story ID from bookmarks array
9. Returns: updated user with new bookmarks list
10. Frontend: setUser(newUserData) → bookmark count updates
```

### **On Page Refresh (Session Persistence)**
```
1. Page reloads
2. App.jsx mounts → AuthProvider's useEffect runs
3. localStorage.getItem('token') → "eyJhbGc..."
4. setToken("eyJhbGc...") → header set
5. Call: refresh() → GET /api/auth/me
6. Backend auth middleware validates token
7. Controller returns: User with all bookmarks populated
8. setUser(userData) → user state restored
9. User stays logged in without re-entering credentials
10. Page renders with user context immediately
```

### **On Logout**
```
1. User clicks logout button
2. logout() called:
   - localStorage.removeItem('token')
   - setToken(null) → removes Authorization header
   - setUser(null)
3. Nav shows: [Login] [Register] buttons
4. User redirected to /login or /
5. Protected pages now inaccessible
```

---

## Environment Variables Required

**Backend (.env file)**
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
JWT_SECRET=your-secret-key-here-keep-it-safe
PORT=5000
```

**Frontend**
```
No .env needed (baseURL hardcoded to http://localhost:5000/api)
```

---

## Key Concepts Summary

| Concept | Purpose | Example |
|---------|---------|---------|
| **JWT Token** | Stateless authentication | eyJhbGc... |
| **Context API** | Global state without prop drilling | useAuth() hook |
| **localStorage** | Persistent token storage | survives page refresh |
| **Auth Middleware** | Protects routes on backend | validates token on /me |
| **Axios Instance** | Centralized HTTP client | auto-includes header |
| **bcrypt** | One-way password hashing | can't reverse hash |
| **Authorization Header** | Sends token to backend | Bearer <token> |

---

## Common Flows & Debugging

### **User stays logged in after refresh**
- ✅ Token in localStorage
- ✅ useEffect runs and calls refresh()
- ✅ Server returns valid user
- ✅ setUser() updates state

### **User logs out automatically**
- ❌ Token expired (7 days)
- ❌ Token tampered with
- ❌ JWT_SECRET changed on server
- ❌ Logout button clicked

### **Bookmarks not saving**
- ❌ Token not included in request (setToken not called)
- ❌ Token invalid (expired or wrong secret)
- ❌ User ID mismatch
- ❌ MongoDB connection error

### **Protected page accessible without login**
- ❌ Frontend doesn't check user state
- ❌ useAuth() not imported
- ❌ AuthProvider not wrapping component

---

## Best Practices Implemented

✅ **Separation of Concerns**: Auth logic in context, API calls in api.js  
✅ **DRY (Don't Repeat Yourself)**: One axios instance, one token management  
✅ **Stateless Auth**: JWT doesn't require server session storage  
✅ **Secure Storage**: Passwords hashed, tokens in localStorage  
✅ **Error Handling**: Try-catch blocks, proper HTTP status codes  
✅ **Token Refresh**: Auto-restore session on page load  
✅ **Protected Routes**: Middleware validates every protected request  
✅ **Clean Code**: Helper functions (signToken, userSafe)  

---

## Questions This Approach Answers

**Q: How does the user stay logged in after refresh?**  
A: Token is saved in localStorage and restored on app load via useEffect

**Q: How do we prevent password exposure?**  
A: Passwords are hashed with bcrypt and never returned in API responses

**Q: How do we know who the user is on protected routes?**  
A: JWT token contains user ID, verified and decoded by auth middleware

**Q: How do bookmarks stay with the user?**  
A: MongoDB stores bookmark array on User document, populated on /auth/me

**Q: How do we prevent unauthorized bookmarking?**  
A: Auth middleware validates token before controller processes request

**Q: How is state shared across all pages?**  
A: Context API provides user state globally, useAuth() hook accesses it anywhere

