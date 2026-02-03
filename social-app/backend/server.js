const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

const app = express();
const PORT = 5000;

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
    
    // Check if user already exists
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

// Follow user
app.post('/api/users/:userId/follow', async (req, res) => {
  try {
    const { followerId } = req.body;
    const users = await readJSON(USERS_FILE);
    
    const follower = users.find(u => u.id === followerId);
    const targetUser = users.find(u => u.id === req.params.userId);
    
    if (!follower || !targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Add to following list
    if (!follower.following.includes(req.params.userId)) {
      follower.following.push(req.params.userId);
    }
    
    // Add to followers list
    if (!targetUser.followers.includes(followerId)) {
      targetUser.followers.push(followerId);
    }
    
    await writeJSON(USERS_FILE, users);
    await updateUserLevel(req.params.userId);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unfollow user
app.post('/api/users/:userId/unfollow', async (req, res) => {
  try {
    const { followerId } = req.body;
    const users = await readJSON(USERS_FILE);
    
    const follower = users.find(u => u.id === followerId);
    const targetUser = users.find(u => u.id === req.params.userId);
    
    if (!follower || !targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove from following list
    follower.following = follower.following.filter(id => id !== req.params.userId);
    
    // Remove from followers list
    targetUser.followers = targetUser.followers.filter(id => id !== followerId);
    
    await writeJSON(USERS_FILE, users);
    await updateUserLevel(req.params.userId);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search users
app.get('/api/users/search/:query', async (req, res) => {
  try {
    const users = await readJSON(USERS_FILE);
    const query = req.params.query.toLowerCase();
    
    const results = users
      .filter(u => u.username.toLowerCase().includes(query))
      .map(({ password, ...user }) => user);
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== POST ROUTES ====================

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await readJSON(POSTS_FILE);
    const users = await readJSON(USERS_FILE);
    
    // Enrich posts with user data
    const enrichedPosts = posts.map(post => {
      if (post.anonymous) {
        return {
          ...post,
          user: {
            id: 'anonymous',
            username: 'Anonymous',
            profilePicture: '/uploads/anonymous-avatar.png',
            level: 0,
            verified: false
          }
        };
      }
      
      const user = users.find(u => u.id === post.userId);
      return {
        ...post,
        user: user ? {
          id: user.id,
          username: user.username,
          profilePicture: user.profilePicture,
          level: user.level,
          verified: user.verified
        } : null
      };
    });
    
    // Sort by creation date (newest first)
    enrichedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(enrichedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get posts by user
app.get('/api/posts/user/:userId', async (req, res) => {
  try {
    const posts = await readJSON(POSTS_FILE);
    const userPosts = posts
      .filter(p => p.userId === req.params.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(userPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create post
app.post('/api/posts', upload.single('media'), async (req, res) => {
  try {
    const posts = await readJSON(POSTS_FILE);
    const { userId, content, anonymous } = req.body;
    
    const newPost = {
      id: `post${Date.now()}`,
      userId: anonymous === 'true' ? 'anonymous' : userId,
      content,
      mediaUrl: req.file ? `/uploads/${req.file.filename}` : null,
      mediaType: req.file ? (req.file.mimetype.startsWith('image') ? 'image' : 'video') : null,
      likes: [],
      comments: [],
      shares: 0,
      anonymous: anonymous === 'true',
      createdAt: new Date().toISOString()
    };
    
    posts.push(newPost);
    await writeJSON(POSTS_FILE, posts);
    
    res.json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like post
app.post('/api/posts/:postId/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const posts = await readJSON(POSTS_FILE);
    const post = posts.find(p => p.id === req.params.postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
    } else {
      post.likes = post.likes.filter(id => id !== userId);
    }
    
    await writeJSON(POSTS_FILE, posts);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Comment on post
app.post('/api/posts/:postId/comment', async (req, res) => {
  try {
    const { userId, content } = req.body;
    const posts = await readJSON(POSTS_FILE);
    const post = posts.find(p => p.id === req.params.postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const newComment = {
      id: `c${Date.now()}`,
      userId,
      content,
      createdAt: new Date().toISOString()
    };
    
    post.comments.push(newComment);
    await writeJSON(POSTS_FILE, posts);
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Share post
app.post('/api/posts/:postId/share', async (req, res) => {
  try {
    const posts = await readJSON(POSTS_FILE);
    const post = posts.find(p => p.id === req.params.postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    post.shares = (post.shares || 0) + 1;
    await writeJSON(POSTS_FILE, posts);
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== STORY ROUTES ====================

// Get active stories
app.get('/api/stories', async (req, res) => {
  try {
    const stories = await readJSON(STORIES_FILE);
    const users = await readJSON(USERS_FILE);
    const now = new Date();
    
    // Filter expired stories
    const activeStories = stories.filter(s => new Date(s.expiresAt) > now);
    
    // Group by user
    const groupedStories = {};
    activeStories.forEach(story => {
      if (story.anonymous) {
        if (!groupedStories['anonymous']) {
          groupedStories['anonymous'] = {
            user: {
              id: 'anonymous',
              username: 'Anonymous',
              profilePicture: '/uploads/anonymous-avatar.png'
            },
            stories: []
          };
        }
        groupedStories['anonymous'].stories.push(story);
      } else {
        const user = users.find(u => u.id === story.userId);
        if (user) {
          if (!groupedStories[user.id]) {
            groupedStories[user.id] = {
              user: {
                id: user.id,
                username: user.username,
                profilePicture: user.profilePicture,
                level: user.level,
                verified: user.verified
              },
              stories: []
            };
          }
          groupedStories[user.id].stories.push(story);
        }
      }
    });
    
    res.json(Object.values(groupedStories));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create story
app.post('/api/stories', upload.single('media'), async (req, res) => {
  try {
    const stories = await readJSON(STORIES_FILE);
    const { userId, anonymous } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Media file is required' });
    }
    
    const newStory = {
      id: `story${Date.now()}`,
      userId: anonymous === 'true' ? 'anonymous' : userId,
      mediaUrl: `/uploads/${req.file.filename}`,
      mediaType: req.file.mimetype.startsWith('image') ? 'image' : 'video',
      views: [],
      anonymous: anonymous === 'true',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };
    
    stories.push(newStory);
    await writeJSON(STORIES_FILE, stories);
    
    res.json(newStory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View story
app.post('/api/stories/:storyId/view', async (req, res) => {
  try {
    const { userId } = req.body;
    const stories = await readJSON(STORIES_FILE);
    const story = stories.find(s => s.id === req.params.storyId);
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    if (!story.views.includes(userId)) {
      story.views.push(userId);
    }
    
    await writeJSON(STORIES_FILE, stories);
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== MESSAGE ROUTES ====================

// Get conversations for user
app.get('/api/messages/conversations/:userId', async (req, res) => {
  try {
    const messages = await readJSON(MESSAGES_FILE);
    const users = await readJSON(USERS_FILE);
    const userId = req.params.userId;
    
    // Find all unique conversation partners
    const conversationPartners = new Set();
    messages.forEach(msg => {
      if (msg.senderId === userId) conversationPartners.add(msg.receiverId);
      if (msg.receiverId === userId) conversationPartners.add(msg.senderId);
    });
    
    // Get conversation data
    const conversations = Array.from(conversationPartners).map(partnerId => {
      const partner = users.find(u => u.id === partnerId);
      const conversationMessages = messages
        .filter(m => 
          (m.senderId === userId && m.receiverId === partnerId) ||
          (m.senderId === partnerId && m.receiverId === userId)
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      const unreadCount = conversationMessages.filter(
        m => m.receiverId === userId && !m.read
      ).length;
      
      return {
        partner: partner ? {
          id: partner.id,
          username: partner.username,
          profilePicture: partner.profilePicture,
          level: partner.level,
          verified: partner.verified
        } : null,
        lastMessage: conversationMessages[0] || null,
        unreadCount
      };
    });
    
    // Sort by last message time
    conversations.sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt) : 0;
      const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt) : 0;
      return timeB - timeA;
    });
    
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages between two users
app.get('/api/messages/:userId1/:userId2', async (req, res) => {
  try {
    const messages = await readJSON(MESSAGES_FILE);
    const { userId1, userId2 } = req.params;
    
    const conversation = messages
      .filter(m => 
        (m.senderId === userId1 && m.receiverId === userId2) ||
        (m.senderId === userId2 && m.receiverId === userId1)
      )
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    // Mark messages as read
    conversation.forEach(msg => {
      if (msg.receiverId === userId1 && !msg.read) {
        msg.read = true;
      }
    });
    
    await writeJSON(MESSAGES_FILE, messages);
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message
app.post('/api/messages', upload.single('media'), async (req, res) => {
  try {
    const messages = await readJSON(MESSAGES_FILE);
    const { senderId, receiverId, content, anonymous } = req.body;
    
    const newMessage = {
      id: `msg${Date.now()}`,
      senderId: anonymous === 'true' ? 'anonymous' : senderId,
      receiverId,
      content,
      mediaUrl: req.file ? `/uploads/${req.file.filename}` : null,
      mediaType: req.file ? (req.file.mimetype.startsWith('image') ? 'image' : 'video') : null,
      anonymous: anonymous === 'true',
      read: false,
      createdAt: new Date().toISOString()
    };
    
    messages.push(newMessage);
    await writeJSON(MESSAGES_FILE, messages);
    
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== NOTIFICATION ROUTES ====================

// Get notifications for user
app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const posts = await readJSON(POSTS_FILE);
    const messages = await readJSON(MESSAGES_FILE);
    const users = await readJSON(USERS_FILE);
    const userId = req.params.userId;
    
    const notifications = [];
    
    // Get user's posts
    const userPosts = posts.filter(p => p.userId === userId);
    
    // Likes notifications
    userPosts.forEach(post => {
      post.likes.forEach(likerId => {
        const liker = users.find(u => u.id === likerId);
        if (liker && likerId !== userId) {
          notifications.push({
            id: `like-${post.id}-${likerId}`,
            type: 'like',
            user: {
              id: liker.id,
              username: liker.username,
              profilePicture: liker.profilePicture,
              level: liker.level,
              verified: liker.verified
            },
            post: { id: post.id, content: post.content },
            createdAt: post.createdAt
          });
        }
      });
    });
    
    // Comments notifications
    userPosts.forEach(post => {
      post.comments.forEach(comment => {
        const commenter = users.find(u => u.id === comment.userId);
        if (commenter && comment.userId !== userId) {
          notifications.push({
            id: comment.id,
            type: 'comment',
            user: {
              id: commenter.id,
              username: commenter.username,
              profilePicture: commenter.profilePicture,
              level: commenter.level,
              verified: commenter.verified
            },
            post: { id: post.id, content: post.content },
            comment: comment.content,
            createdAt: comment.createdAt
          });
        }
      });
    });
    
    // New followers notifications
    const user = users.find(u => u.id === userId);
    if (user && user.followers) {
      user.followers.forEach(followerId => {
        const follower = users.find(u => u.id === followerId);
        if (follower) {
          notifications.push({
            id: `follow-${followerId}`,
            type: 'follow',
            user: {
              id: follower.id,
              username: follower.username,
              profilePicture: follower.profilePicture,
              level: follower.level,
              verified: follower.verified
            },
            createdAt: follower.createdAt
          });
        }
      });
    }
    
    // Unread messages notifications
    const unreadMessages = messages.filter(m => m.receiverId === userId && !m.read);
    unreadMessages.forEach(msg => {
      const sender = users.find(u => u.id === msg.senderId);
      if (sender) {
        notifications.push({
          id: msg.id,
          type: 'message',
          user: {
            id: sender.id,
            username: sender.username,
            profilePicture: sender.profilePicture,
            level: sender.level,
            verified: sender.verified
          },
          message: msg.content,
          createdAt: msg.createdAt
        });
      }
    });
    
    // Sort by date (newest first)
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
