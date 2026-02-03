const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000; // Updated for Render deployment

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// File paths
const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const STORIES_FILE = path.join(DATA_DIR, 'stories.json');
const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Ensure directories exist
if (!fsSync.existsSync(DATA_DIR)) {
  fsSync.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fsSync.existsSync(UPLOADS_DIR)) {
  fsSync.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Helper functions for file operations
async function readJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Calculate user level based on followers
function calculateLevel(followersCount) {
  if (followersCount >= 60) return 5;
  if (followersCount >= 30) return 4;
  if (followersCount >= 20) return 3;
  if (followersCount >= 10) return 2;
  return 1;
}

// Update user level and verified status
async function updateUserLevel(userId) {
  const users = await readJSON(USERS_FILE);
  const user = users.find(u => u.id === userId);
  
  if (user) {
    const followersCount = user.followers ? user.followers.length : 0;
    user.level = calculateLevel(followersCount);
    user.verified = user.level >= 4;
    await writeJSON(USERS_FILE, users);
  }
}

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const users = await readJSON(USERS_FILE);
    
    if (users.find(u => u.email === email || u.username === username)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const newUser = {
      id: `user${Date.now()}`,
      username,
      email,
      password, // In production, hash this!
      profilePicture: '/uploads/default-avatar.png',
      bio: '',
      followers: [],
      following: [],
      level: 1,
      verified: false,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await writeJSON(USERS_FILE, users);
    
    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await readJSON(USERS_FILE);
    
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== USER ROUTES ====================

// Get user by ID
app.get('/api/users/:userId', async (req, res) => {
  try {
    const users = await readJSON(USERS_FILE);
    const user = users.find(u => u.id === req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
app.put('/api/users/:userId', upload.single('profilePicture'), async (req, res) => {
  try {
    const users = await readJSON(USERS_FILE);
    const userIndex = users.findIndex(u => u.id === req.params.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const updates = JSON.parse(req.body.data || '{}');
    if (req.file) {
      updates.profilePicture = `/uploads/${req.file.filename}`;
    }
    
    users[userIndex] = { ...users[userIndex], ...updates };
    await writeJSON(USERS_FILE, users);
    
    const { password, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Follow/unfollow, posts, stories, messages, notifications, etc.
// (Rest of your code remains unchanged, no PORT changes needed)


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
