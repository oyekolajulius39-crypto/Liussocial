# Luna - Full-Stack Social Media Application

A modern, feature-rich social media platform with a beautiful purple-themed UI, built with React and Node.js.

## 🌟 Features

### User System
- ✅ User registration and login
- ✅ Profile management (avatar, bio, username)
- ✅ Level system based on followers (1-5 stars)
- ✅ Verified badge for Level 4+ users
- ✅ Follow/unfollow functionality

### Content Features
- ✅ Create posts (text, images, videos)
- ✅ Anonymous posting option
- ✅ Like, comment, and share posts
- ✅ Stories with 24-hour expiry
- ✅ View stories with view counter
- ✅ Upload button with preview (max 100MB)

### Social Features
- ✅ Private messaging (text, images, videos)
- ✅ Anonymous messaging option
- ✅ Search users by username
- ✅ Real-time notifications
- ✅ Notification badge counter

### UI/UX
- ✅ Modern purple gradient theme
- ✅ Smooth animations and hover effects
- ✅ Fully responsive design
- ✅ Bottom navigation bar
- ✅ Font Awesome icons
- ✅ Professional card-style layouts

## 🎨 Design Theme

- **Primary Color**: #7F3FBF
- **Secondary Color**: #9B59B6
- **Background**: #F5F0FA
- **Fonts**: Crimson Pro (headers), DM Sans (body)
- **Distinctive Design**: Refined minimalist aesthetic with purposeful gradients

## 📁 Project Structure

```
social-app/
├── backend/          # Node.js Express server
├── frontend/         # React application
├── data/            # JSON database files
└── uploads/         # Media storage
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm

### Installation

1. **Install Backend Dependencies**
```bash
cd backend
npm install
```

2. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

3. **Start Backend** (Terminal 1)
```bash
cd backend
npm start
```
Server runs on `http://localhost:5000`

4. **Start Frontend** (Terminal 2)
```bash
cd frontend
npm start
```
App opens at `http://localhost:3000`

## 👤 Demo Accounts

- **Email**: emma@example.com | **Password**: password123
- **Email**: alex@example.com | **Password**: password123
- **Email**: sarah@example.com | **Password**: password123

## 🎯 Level System

| Level | Followers | Stars | Verified |
|-------|-----------|-------|----------|
| 1     | 0-9       | ★     | ❌       |
| 2     | 10-19     | ★★    | ❌       |
| 3     | 20-29     | ★★★   | ❌       |
| 4     | 30-59     | ★★★★  | ✅       |
| 5     | 60+       | ★★★★★ | ✅       |

## 🛠️ Tech Stack

**Frontend**: React, Axios, Font Awesome  
**Backend**: Node.js, Express, Multer  
**Storage**: JSON files, Local filesystem

## 🔐 Security Note

⚠️ This is a demo. For production:
- Hash passwords (bcrypt)
- Add JWT authentication
- Use proper database
- Add HTTPS & CSRF protection

## 📱 Usage Guide

**Create Posts**: Click + button → Post → Add content → Create  
**Create Stories**: Click + button → Story → Upload media → Create  
**Send Messages**: Messages page → Select chat → Type & send  
**Follow Users**: Search page → Find users → Click Follow

## 🎨 Customization

Edit CSS variables in `frontend/src/App.css`:
```css
:root {
  --primary: #7F3FBF;
  --secondary: #9B59B6;
  --background: #F5F0FA;
}
```

## 🐛 Troubleshooting

- **Port in use**: Change port in server.js or .env
- **CORS errors**: Verify backend runs on port 5000
- **Upload errors**: Check uploads folder permissions

---

Built with ❤️ for demonstration purposes
