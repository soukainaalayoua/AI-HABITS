# 🚀 AI-HABITS Backend API

Complete REST API for the AI-HABITS platform with authentication, habit management, artificial intelligence, and notification system.

## 🌟 Features

### 🔐 **Authentication & Security**

- User registration and login
- JWT tokens with expiration
- Route protection middleware
- Secure password hashing (bcrypt)
- Input data validation

### 📊 **Habit Management**

- Complete CRUD for habits
- Types: Build or Break
- Frequencies: Daily, Weekly, etc.
- Customizable goals and durations
- Automatic reminders

### 📈 **Tracking and Statistics**

- Tracking recording (done/missed)
- Automatic statistics calculation
- Performance history
- Trend analysis

### 🤖 **Artificial Intelligence**

- OpenAI GPT-4o-mini integration
- Contextual chat with user data
- Performance analysis
- Personalized advice
- Context-adaptive responses

### 📧 **Communication System**

- Email sending with Nodemailer
- Automatic reminders via cron jobs
- Integrated contact form
- HTML templates for emails

## 🛠️ Technologies

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email sending
- **OpenAI** - Artificial intelligence API
- **Cron** - Task scheduling
- **CORS** - Cross-origin configuration

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB configuration
├── controllers/
│   ├── authController.js  # Authentication
│   ├── habitController.js # Habit management
│   ├── trackingController.js # Habit tracking
│   ├── chatController.js  # AI chat
│   └── contactController.js # Contact form
├── middleware/
│   └── authMiddleware.js  # Route protection
├── models/
│   ├── userModel.js       # User model
│   ├── habitModel.js      # Habit model
│   └── trackingModel.js   # Tracking model
├── routes/
│   ├── authRoutes.js      # Authentication routes
│   ├── habitRoutes.js     # Habit routes
│   ├── trackingRoutes.js  # Tracking routes
│   ├── chatRoutes.js      # AI chat routes
│   └── contactRoutes.js   # Contact routes
├── services/
│   └── reminderService.js # Reminder service
├── utils/
│   └── mailer.js          # Email configuration
├── server.js              # Entry point
└── package.json           # Dependencies
```

## 🚀 Installation

### **Prerequisites**

- Node.js 18+
- MongoDB (local or cloud)
- OpenAI account
- Gmail account (for emails)

### **1. Install Dependencies**

```bash
cd backend
npm install
```

### **2. Environment Variables Configuration**

Create a `.env` file at the root of the backend folder:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ai-habits

# JWT
JWT_SECRET=your-super-secure-jwt-secret

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# OpenAI
OPENAI_API_KEY=sk-proj-your-openai-key

# Email (optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### **3. Start the Server**

```bash
# Development mode with nodemon
npm run dev

# Production mode
node server.js
```

## 🔧 API Endpoints

### **Authentication** (`/api/auth`)

- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Current user profile

### **Habits** (`/api/habits`)

- `GET /` - List user habits
- `POST /` - Create new habit
- `PUT /:id` - Modify habit
- `DELETE /:id` - Delete habit

### **Tracking** (`/api/tracking`)

- `POST /` - Record tracking (done/missed)
- `GET /` - Tracking history

### **AI Chat** (`/api/chat`)

- `POST /` - Send message to AI chat

### **Contact** (`/api/contact`)

- `POST /` - Send contact message

### **Health Check**

- `GET /health` - Server status

## 📊 Data Models

### **User**

```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: String (default: 'user'),
  createdAt: Date
}
```

### **Habit**

```javascript
{
  title: String,
  type: String ('build' | 'break'),
  target: String,
  frequency: String,
  reminderTime: String,
  duration: Number,
  user: ObjectId (ref: User),
  createdAt: Date
}
```

### **Tracking**

```javascript
{
  habit: ObjectId (ref: Habit),
  user: ObjectId (ref: User),
  date: Date,
  status: String ('done' | 'missed'),
  createdAt: Date
}
```

## 🤖 Artificial Intelligence

### **OpenAI Configuration**

- Model: `gpt-4o-mini`
- Token limit: 200-250 tokens
- Temperature: 0.3 (precise responses)
- Contextual analysis of user data

### **Response Types**

- **Greetings**: Natural and welcoming responses
- **Dashboard Questions**: Direct performance analysis
- **Vague Questions**: Request for clarification
- **Specific Questions**: Concrete and actionable responses

### **Context Provided to AI**

- Total number of habits
- Success statistics per habit
- Best/worst performing habit
- Recent tracking history
- Detected question type

## 📧 Email System

### **Gmail Configuration**

1. Enable two-factor authentication
2. Generate an app password
3. Use this password in `EMAIL_PASS`

### **Email Types**

- **Habit Reminders**: Automatic notifications
- **Contact Messages**: User form
- **Confirmations**: Action validation

### **Templates**

- Styled HTML with gradients
- Responsive design
- Contextual information
- AI-HABITS branding

## ⏰ Reminder System

### **Cron Jobs**

- Daily habit verification
- Reminder sending according to configured time
- Timezone management
- Duplicate avoidance

### **Configuration**

```javascript
// Daily execution at 6:00 AM
cron.schedule("0 6 * * *", async () => {
  await sendDailyReminders();
});
```

## 🔒 Security

### **Authentication**

- JWT tokens with expiration (24h)
- Automatic refresh on client side
- Protection middleware on all sensitive routes

### **Validation**

- Input data validation
- Request sanitization
- Injection protection

### **CORS**

- Secure configuration
- Limited authorized origins
- Appropriate headers

## 📈 Performance

### **Optimizations**

- MongoDB indexes on frequent fields
- Pagination for lists
- Cached calculated statistics
- Optimized queries

### **Monitoring**

- Detailed error logs
- Health check endpoint
- Performance metrics

## 🧪 Testing

### **Manual Tests**

```bash
# Health test
curl http://localhost:3000/health

# Registration test
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@test.com","password":"password123"}'

# Contact test
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Test message"}'
```

## 🚀 Deployment

### **Production Environment Variables**

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=super-secure-production-secret
OPENAI_API_KEY=sk-proj-...
EMAIL_USER=production@domain.com
EMAIL_PASS=production-app-password
```

### **Recommended Platform**

- **Railway**: Modern and reliable deployment platform

## 📝 Logs and Debug

### **Log Levels**

- **Info**: Normal operations
- **Warn**: Attention situations
- **Error**: Critical errors

### **Log Format**

```javascript
console.log(`✅ Database connected successfully`);
console.error(`❌ Failed to connect DB: ${error.message}`);
console.log(`📧 Contact email sent from ${name} (${email})`);
```

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Implement your changes
4. Test thoroughly
5. Submit a Pull Request

## 📞 Support

- **Email**: salayoua@gmail.com
- **Documentation**: Main README
- **Issues**: GitHub Issues

---

**AI-HABITS Backend - Robust and secure API for AI-powered habit management**
