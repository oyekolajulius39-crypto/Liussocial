# 📱 Social Media Web App - Project Overview

## 🎨 Design Theme

**Purple Elegance**
- Primary: #7F3FBF (Deep Purple)
- Secondary: #9B59B6 (Soft Purple)
- Background: #F5F0FA (Light Lavender)
- Accents: Gradients, shadows, and smooth animations

## ✨ Key Features

### 1️⃣ User Authentication & Profiles
- Secure signup/login with JWT tokens
- Customizable profiles (avatar, bio)
- Level system (1-5 stars) based on followers
- Verified badge (✓) for Level 4+ users
- Progress tracking to next level

### 2️⃣ Social Feed
- Create text posts with images/videos
- Like, comment, and share posts
- Anonymous posting option
- Real-time interaction counts
- Beautiful card-based layout

### 3️⃣ Stories (24-hour content)
- Upload photos/videos as stories
- Auto-expire after 24 hours
- View count tracking
- Smooth navigation between stories
- Anonymous story posting

### 4️⃣ Private Messaging
- One-on-one conversations
- Send text, images, or videos
- Anonymous messaging option
- Conversation list view
- Message timestamps

### 5️⃣ Discovery & Search
- Search users by username
- View user profiles and stats
- Follow/unfollow from search results
- See level and verified status

### 6️⃣ Notifications
- Real-time activity updates
- Like, comment, share notifications
- Follow and message alerts
- Unread count badges
- Mark as read functionality

### 7️⃣ Upload Center
- Create posts or stories
- Drag-and-drop file upload
- Preview before posting
- 100MB file size limit
- Anonymous posting toggle

## 📊 Level System Breakdown

| Level | Followers Required | Stars | Verified Badge |
|-------|-------------------|-------|----------------|
| 1     | 0-9               | ⭐    | ❌             |
| 2     | 10-19             | ⭐⭐  | ❌             |
| 3     | 20-29             | ⭐⭐⭐ | ❌             |
| 4     | 30-59             | ⭐⭐⭐⭐ | ✅           |
| 5     | 60+               | ⭐⭐⭐⭐⭐ | ✅         |

## 🗂️ Project Structure

```
social-app/
│
├── 📁 backend/                    # Node.js/Express Server
│   ├── server.js                  # Main server file (all routes)
│   ├── package.json               # Backend dependencies
│   ├── 📁 data/                   # JSON Database
│   │   ├── users.json            # User accounts
│   │   ├── posts.json            # Social posts
│   │   ├── messages.json         # Private messages
│   │   ├── stories.json          # 24-hour stories
│   │   └── notifications.json    # User notifications
│   └── 📁 uploads/                # User-uploaded media
│
└── 📁 frontend/                   # React Application
    ├── 📁 public/
    │   ├── index.html            # HTML entry point
    │   └── favicon.svg           # App logo (L icon)
    │
    ├── 📁 src/
    │   ├── App.js                # Main app component
    │   ├── index.js              # React entry point
    │   │
    │   ├── 📁 components/
    │   │   └── BottomNav.js      # Navigation bar
    │   │
    │   ├── 📁 pages/
    │   │   ├── Login.js          # Login page
    │   │   ├── Signup.js         # Registration
    │   │   ├── Home.js           # Main feed
    │   │   ├── Profile.js        # User profiles
    │   │   ├── Messages.js       # Messaging
    │   │   ├── Stories.js        # Stories view
    │   │   ├── Search.js         # User search
    │   │   ├── Upload.js         # Content upload
    │   │   └── Notifications.js  # Alerts
    │   │
    │   └── 📁 styles/
    │       └── App.css           # All styling
    │
    └── package.json              # Frontend dependencies
```

## 🔧 Technology Stack

### Frontend
- ⚛️ React 18 (UI framework)
- 🧭 React Router (navigation)
- 📡 Axios (API calls)
- 🎨 CSS3 (custom styling)
- 🎭 Font Awesome (icons)

### Backend
- 🟢 Node.js (runtime)
- 🚂 Express (web framework)
- 🔐 JWT (authentication)
- 🔒 Bcrypt (password hashing)
- 📤 Multer (file uploads)
- 📄 JSON files (database)

## 🚀 Getting Started

1. **Install Backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Install Frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Login:** Use test account `alex_creator` / `password123`

## 🎯 API Endpoints Summary

### Authentication
- POST `/api/signup` - Register
- POST `/api/login` - Login

### Users
- GET `/api/users/me` - Current user
- PUT `/api/users/me` - Update profile
- POST `/api/users/:id/follow` - Follow
- GET `/api/users/search/:query` - Search

### Posts
- GET `/api/posts` - All posts
- POST `/api/posts` - Create post
- POST `/api/posts/:id/like` - Like
- POST `/api/posts/:id/comment` - Comment

### Stories
- GET `/api/stories` - Active stories
- POST `/api/stories` - Create story

### Messages
- GET `/api/messages` - Conversations
- POST `/api/messages` - Send message

### Notifications
- GET `/api/notifications` - All notifications
- PUT `/api/notifications/:id/read` - Mark read

## 🎨 Design Highlights

- **Gradient Headers:** Eye-catching purple gradients
- **Smooth Animations:** Hover effects, transitions
- **Card-Based Layout:** Modern, clean cards
- **Responsive Design:** Works on all devices
- **Professional Icons:** Font Awesome throughout
- **Loading States:** Elegant spinners
- **Empty States:** Helpful placeholder messages

## 📱 Bottom Navigation

| Icon | Page | Purpose |
|------|------|---------|
| 🏠 Home | Feed | View all posts |
| ✉️ Messages | Messaging | Private chats |
| ➕ Upload | Create | Post/story upload |
| 🔄 Stories | Stories | 24h content |
| 🔍 Search | Discover | Find users |
| 🔔 Alerts | Notifications | Activity feed |
| 👤 Profile | Profile | Your account |

## 🔐 Security Features

- JWT token authentication
- Bcrypt password hashing
- Secure file upload validation
- Input sanitization
- Protected API routes

## 📦 What's Included

✅ Complete backend with all routes
✅ Full React frontend with routing
✅ Sample data (3 test users, posts, stories)
✅ Beautiful purple theme
✅ Responsive design
✅ All features working
✅ Clean, commented code
✅ Setup instructions
✅ Ready to run locally

## 🎓 Learning Resources

This project demonstrates:
- Full-stack JavaScript development
- RESTful API design
- React state management
- File upload handling
- JWT authentication
- CSS animations
- Responsive design
- Component architecture

## 🌟 Next Steps

After setup, you can:
1. Create a new account or login
2. Customize your profile
3. Create posts with media
4. Follow other users
5. Send messages
6. Upload stories
7. Receive notifications
8. Reach higher levels!

## 💡 Customization Tips

- **Colors:** Edit CSS variables in `App.css`
- **Levels:** Modify `calculateLevel()` in `server.js`
- **Features:** Add new routes and components
- **Styling:** Update `App.css` styles

---

**Built with ❤️ using React & Express**
**Ready for development and learning! 🚀**
