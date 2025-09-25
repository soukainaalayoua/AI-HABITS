# 🎨 AI-HABITS Frontend

Modern and responsive user interface for the AI-HABITS platform, built with React and modern web technologies.

## 🌟 Features

### 🎨 **Modern Design**

- Elegant and intuitive user interface
- Responsive design (mobile-first)
- Smooth animations with Framer Motion
- Consistent theme (fuchsia/violet/cyan)
- Glassmorphism effects and gradients
- Navigation with active page detection

### 🔐 **Authentication**

- Secure registration and login
- Protected routes with JWT
- Automatic token management
- Real-time form validation
- Loading states and user feedback

### 📊 **Advanced Dashboard**

- Statistics overview
- Interactive and visual charts
- Habit creation and management
- Daily tracking with instant feedback
- Detailed statistics per habit

### 🤖 **Integrated AI Chat**

- Modern chat interface
- Contextual and personalized responses
- User performance analysis
- Adaptive advice based on data
- Conversation history

### 📧 **Communication**

- Integrated contact form
- Client and server-side validation
- Confirmation messages
- Integrated FAQ
- Accessible customer support

## 🛠️ Technologies

- **React 19** - Modern JavaScript framework
- **Vite** - Fast and modern build tool
- **TailwindCSS 4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Router DOM 7** - Client-side navigation
- **Axios** - HTTP client with interceptors

## 📁 Project Structure

```
frontend/src/
├── components/              # Reusable components
│   ├── Header.jsx          # Main navigation
│   ├── Footer.jsx          # Footer
│   ├── Charts.jsx          # Charts and statistics
│   ├── ChatBox.jsx         # Chat component
│   ├── FiltersBar.jsx      # Filter bar
│   ├── StatsCards.jsx      # Statistics cards
│   ├── AreaChart.jsx       # Area chart
│   ├── BarChartMini.jsx    # Mini bar chart
│   ├── MiniDonutChart.jsx  # Donut chart
│   ├── SparklineChart.jsx  # Sparkline chart
│   └── WeeklyTrendChart.jsx # Trend chart
├── pages/                  # Application pages
│   ├── Home.jsx           # Homepage
│   ├── Login.jsx          # Login
│   ├── Register.jsx       # Registration
│   ├── Dashboard.jsx     # Dashboard
│   ├── ChatPage.jsx       # AI Chat
│   ├── Contact.jsx        # Contact form
│   ├── About.jsx          # About
│   ├── Suggestions.jsx    # Suggestions
│   └── Profile.jsx        # User profile
├── context/               # React context
│   └── AuthContext.jsx    # Authentication management
├── routes/                # Protected routes
│   └── ProtectedRoutes.jsx # Route protection
├── services/              # API services
│   └── api.js             # Axios configuration
├── App.jsx                # Main component
├── main.jsx              # Entry point
└── index.css             # Global styles
```

## 🚀 Installation

### **Prerequisites**
- Node.js 18+
- Functional backend API

### **1. Install Dependencies**
```bash
cd frontend
npm install
```

### **2. Configuration**
The frontend automatically connects to the backend on `http://localhost:3000/api`.

To change the API URL, create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### **3. Start**
```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`

## 🎨 Design System

### **Color Palette**
- **Primary** : Fuchsia (`#D946EF`)
- **Secondary** : Violet (`#8B5CF6`)
- **Accent** : Cyan (`#06B6D4`)
- **Background** : Indigo-black-slate gradient
- **Text** : White and gray

### **Typography**
- **Main font** : Inter, system-ui, sans-serif
- **Display font** : Poppins (titles)
- **Sizes** : Responsive (sm, base, lg, xl, 2xl, etc.)

### **Components**
- **Borders** : Rounded (lg, xl, 2xl)
- **Shadows** : Subtle with hover effects
- **Animations** : Framer Motion for transitions
- **States** : Loading, hover, focus, disabled

## 📱 Pages and Features

### **🏠 Homepage**
- Hero section with animated gradient
- Feature presentation
- Call-to-action for registration
- Modern and welcoming design

### **🔐 Authentication**
- **Login** : Login with validation
- **Register** : Registration with confirmation
- Real-time validation
- Error handling
- Loading states

### **📊 Dashboard**
- Global statistics
- Interactive charts:
  - Habit types (build/break)
  - Habit frequencies
  - Weekly progression
  - Success rate per habit
  - Monthly trends
  - Constructive/destructive comparison
- Habit creation
- Daily tracking
- Management of existing habits

### **🤖 AI Chat**
- Modern chat interface
- Messages with timestamps
- Typing indicator
- History clearing
- Contextual responses
- Question suggestions

### **📧 Contact**
- Complete contact form
- Client-side validation
- Confirmation messages
- Integrated FAQ
- Contact information
- Responsive design

### **ℹ️ Informational Pages**
- **About** : About the project
- **Suggestions** : Tips and suggestions
- **Profile** : User profile management

## 🔧 API Integration

### **Axios Configuration**
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
});
```

### **Interceptors**
- **Request** : Automatic JWT token addition
- **Response** : 401 error handling with redirection

### **Used Endpoints**
- `POST /auth/register` - Registration
- `POST /auth/login` - Login
- `GET /auth/me` - User profile
- `GET /habits` - Habit list
- `POST /habits` - Create habit
- `DELETE /habits/:id` - Delete habit
- `POST /tracking` - Record tracking
- `POST /chat` - Chat with AI
- `POST /contact` - Send message

## 🎭 Animations and Interactions

### **Framer Motion**
- Page entry animations
- Smooth state transitions
- Hover and tap effects
- Loading animations
- Micro-interactions

### **Animation Examples**
```javascript
// Entry animation
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>

// Hover animation
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

## 📊 Charts and Visualizations

### **Chart Components**
- **HabitTypeChart** : Distribution by type
- **FrequencyChart** : Frequency analysis
- **WeeklyProgressChart** : Weekly progression
- **SuccessRateChart** : Success rate
- **MonthlyTrendChart** : Monthly trends
- **BuildVsBreakChart** : Constructive/destructive comparison

### **Features**
- Consistent design with theme
- Appearance animations
- Harmonized colors
- Responsive design
- Real-time data

## 🔒 Frontend Security

### **Route Protection**
- Protected routes with `ProtectedRoute`
- Automatic redirection if not authenticated
- JWT token verification

### **Token Management**
- Secure storage in localStorage
- Automatic deletion on expiration
- Automatic addition to API requests

### **Form Validation**
- Client-side validation
- Clear error messages
- Prevention of invalid submissions

## 📱 Responsive Design

### **Tailwind Breakpoints**
- **Mobile** : `< 640px`
- **Tablet** : `640px - 1024px`
- **Desktop** : `> 1024px`

### **Adaptations**
- Mobile navigation with hamburger menu
- Adaptive grids
- Responsive texts and spacing
- Adaptive images and charts

## 🚀 Build and Deployment

### **Production Build**
```bash
npm run build
```

### **Preview**
```bash
npm run preview
```

### **Deployment**
- **Vercel** : Automatic deployment
- **Netlify** : Drag & drop of `dist/` folder
- **GitHub Pages** : Automatic actions

## 🧪 Testing and Quality

### **Linting**
```bash
npm run lint
```

### **Manual Tests**
- Navigation between pages
- Complete authentication
- Habit creation and management
- Functional AI chat
- Contact form
- Responsive design

## 🔧 Customization

### **Theme**
Modify colors in `tailwind.config.js`:
```javascript
colors: {
  primary: '#D946EF',    // Fuchsia
  secondary: '#8B5CF6',  // Violet
  accent: '#06B6D4',     // Cyan
}
```

### **Animations**
Adjust animations in Framer Motion components.

### **Components**
All components are modular and customizable.

## 📝 Changelog

### **Version 1.0.0**
- ✅ Complete user interface
- ✅ Integrated authentication
- ✅ Dashboard with charts
- ✅ Functional AI chat
- ✅ Contact form
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Smart navigation

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Implement your changes
4. Test on different devices
5. Submit a Pull Request

## 📞 Support

- **Email** : salayoua@gmail.com
- **Documentation** : Main README
- **Issues** : GitHub Issues

---

**AI-HABITS Frontend - Modern and intuitive interface for AI-powered habit management**
