# Luna Social App - Complete Setup Guide

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** v14 or higher ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- A code editor (VS Code recommended)
- Two terminal windows

## 🚀 Step-by-Step Installation

### 1. Extract the Project

Extract the `social-app` folder to your desired location.

### 2. Open Two Terminal Windows

You'll need two separate terminal windows:
- **Terminal 1**: For the backend server
- **Terminal 2**: For the frontend React app

### 3. Install Backend Dependencies

In **Terminal 1**:

```bash
cd social-app/backend
npm install
```

Wait for all packages to install (express, cors, multer).

### 4. Install Frontend Dependencies

In **Terminal 2**:

```bash
cd social-app/frontend
npm install
```

This will install React and all frontend dependencies (may take a few minutes).

### 5. Start the Backend Server

In **Terminal 1** (still in `backend` folder):

```bash
npm start
```

You should see: `Server running on http://localhost:5000`

**Keep this terminal running!**

### 6. Start the Frontend App

In **Terminal 2** (still in `frontend` folder):

```bash
npm start
```

Your default browser will automatically open to `http://localhost:3000`

If it doesn't, manually open your browser and go to `http://localhost:3000`

## ✅ Verify Installation

You should see:
1. Backend terminal showing "Server running on http://localhost:5000"
2. Frontend terminal showing "Compiled successfully!"
3. Browser showing the Luna login page

## 🎉 You're Ready!

Use one of the demo accounts to log in:

**Account 1:**
- Email: `emma@example.com`
- Password: `password123`

**Account 2:**
- Email: `alex@example.com`
- Password: `password123`

**Account 3:**
- Email: `sarah@example.com`
- Password: `password123`

## 🔧 Common Issues & Solutions

### Issue: "Port 5000 is already in use"

**Solution**: Another app is using port 5000.

1. Stop any other servers running on port 5000
2. Or edit `backend/server.js` line 10 to use a different port (e.g., 5001)
3. If you change the port, also update API_BASE in frontend components

### Issue: "Port 3000 is already in use"

**Solution**: Another React app is running.

Option 1: Run on different port (terminal will prompt you, press 'Y')  
Option 2: Stop other React apps  
Option 3: Create `.env` file in frontend folder with `PORT=3001`

### Issue: "npm install" fails

**Solution**: 
1. Delete `node_modules` folder and `package-lock.json`
2. Run `npm install` again
3. Ensure you have Node.js v14 or higher: `node --version`

### Issue: "Cannot GET /api/posts" or API errors

**Solution**:
1. Verify backend server is running on terminal 1
2. Check for errors in backend terminal
3. Make sure you're in the correct directory
4. Restart the backend server

### Issue: Blank page or white screen

**Solution**:
1. Check browser console for errors (F12)
2. Verify frontend compiled successfully
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try a different browser

### Issue: File uploads not working

**Solution**:
1. Check `uploads` folder exists in project root
2. Verify file size is under 100MB
3. Check backend terminal for upload errors

## 📁 File Structure Reference

```
social-app/
├── backend/
│   ├── server.js              # Backend server
│   ├── package.json           # Backend dependencies
│   └── node_modules/          # (created after npm install)
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── styles/            # CSS files
│   │   ├── App.js            # Main React app
│   │   └── index.js          # Entry point
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── package.json          # Frontend dependencies
│   └── node_modules/         # (created after npm install)
├── data/                     # JSON database
│   ├── users.json
│   ├── posts.json
│   ├── messages.json
│   └── stories.json
├── uploads/                  # Media storage
└── README.md                 # Documentation
```

## 🎯 Testing the App

After logging in, try these features:

1. **View Feed**: See existing posts on the home page
2. **Create Post**: Click the purple + button → Post
3. **Upload Media**: Add an image or video to your post
4. **Like & Comment**: Interact with posts
5. **View Profile**: Click profile in bottom nav
6. **Follow Users**: Go to Search → Find users → Follow
7. **Send Messages**: Go to Messages → Select a user
8. **Create Story**: Click + button → Story → Upload media
9. **View Stories**: Go to Stories page → Click story thumbnails
10. **Check Notifications**: Click bell icon in header

## 💡 Tips

- Keep both terminals running while using the app
- If you close terminals, you'll need to restart both servers
- Data persists in JSON files - your posts and interactions are saved
- Use Ctrl+C in terminal to stop a server
- Check browser DevTools (F12) for any errors

## 🛑 Stopping the App

To stop the app:

1. In **Terminal 1** (backend): Press `Ctrl+C`
2. In **Terminal 2** (frontend): Press `Ctrl+C`

## 🔄 Restarting the App

To use the app again:

1. Open two terminals
2. Terminal 1: `cd social-app/backend` → `npm start`
3. Terminal 2: `cd social-app/frontend` → `npm start`

(No need to run `npm install` again!)

## 📞 Need Help?

If you encounter issues:

1. Read the error message carefully
2. Check the terminal output for clues
3. Verify both servers are running
4. Try restarting both servers
5. Clear browser cache
6. Ensure all npm packages installed successfully

## 🎨 Customization

Want to change colors? Edit `frontend/src/App.css`:

```css
:root {
  --primary: #7F3FBF;      /* Change this for different primary color */
  --secondary: #9B59B6;    /* Change this for different secondary color */
  --background: #F5F0FA;   /* Change this for different background */
}
```

---

## ✨ Enjoy Luna!

You now have a fully functional social media app running locally!

Happy posting! 🚀
