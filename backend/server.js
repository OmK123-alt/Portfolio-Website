import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB, readData, writeData, getSection, updateSection } from './db.js';
import { verifyToken, generateToken } from './middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Credentials (change in production!)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@shakkya.dev';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

initDB();

// ═══════════════════════════════════════════════════════
// PUBLIC ROUTES
// ═══════════════════════════════════════════════════════

// Get all portfolio data
app.get('/api/public/portfolio', (req, res) => {
  const data = readData();
  res.json(data);
});

// Get specific section
app.get('/api/public/:section', (req, res) => {
  const { section } = req.params;
  const data = getSection(section);

  if (!data) {
    return res.status(404).json({ error: 'Section not found' });
  }
  res.json(data);
});

// ═══════════════════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════════════════

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = generateToken(email);
    res.json({ 
      success: true, 
      token,
      message: '✅ Login successful!' 
    });
  } else {
    res.status(401).json({ error: '❌ Invalid credentials' });
  }
});

// ═══════════════════════════════════════════════════════
// PROTECTED ADMIN ROUTES
// ═══════════════════════════════════════════════════════

// Get all data (admin)
app.get('/api/admin/data', verifyToken, (req, res) => {
  const data = readData();
  res.json(data);
});

// Update profile
app.put('/api/admin/profile', verifyToken, (req, res) => {
  const profile = req.body;
  if (updateSection('profile', profile)) {
    res.json({ success: true, message: '✅ Profile updated!' });
  } else {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Update hero section
app.put('/api/admin/hero', verifyToken, (req, res) => {
  const hero = req.body;
  if (updateSection('hero', hero)) {
    res.json({ success: true, message: '✅ Hero updated!' });
  } else {
    res.status(500).json({ error: 'Failed to update hero' });
  }
});

// Update skills
app.put('/api/admin/skills', verifyToken, (req, res) => {
  const skills = req.body;
  if (updateSection('skills', skills)) {
    res.json({ success: true, message: '✅ Skills updated!' });
  } else {
    res.status(500).json({ error: 'Failed to update skills' });
  }
});

// Get works
app.get('/api/admin/works', verifyToken, (req, res) => {
  const works = getSection('works');
  res.json(works);
});

// Upload video (data URL passthrough for lightweight deployments)
app.post('/api/admin/upload/video', verifyToken, (req, res) => {
  const { fileData } = req.body || {};

  if (!fileData || typeof fileData !== 'string') {
    return res.status(400).json({ error: 'Invalid video payload' });
  }

  if (!fileData.startsWith('data:video/')) {
    return res.status(400).json({ error: 'Only video data URLs are supported' });
  }

  return res.json({ success: true, url: fileData });
});

// Add work
app.post('/api/admin/works', verifyToken, (req, res) => {
  const data = readData();
  const newWork = {
    id: Math.max(...data.works.map(w => w.id), 0) + 1,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  data.works.push(newWork);

  if (writeData(data)) {
    res.json({ success: true, message: '✅ Work added!', data: newWork });
  } else {
    res.status(500).json({ error: 'Failed to add work' });
  }
});

// Update work
app.put('/api/admin/works/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const data = readData();
  const index = data.works.findIndex(w => w.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Work not found' });
  }

  data.works[index] = { ...data.works[index], ...req.body };
  if (writeData(data)) {
    res.json({ success: true, message: '✅ Work updated!' });
  } else {
    res.status(500).json({ error: 'Failed to update work' });
  }
});

// Delete work
app.delete('/api/admin/works/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const data = readData();
  const initialLength = data.works.length;
  data.works = data.works.filter(w => w.id !== parseInt(id));

  if (data.works.length < initialLength && writeData(data)) {
    res.json({ success: true, message: '✅ Work deleted!' });
  } else {
    res.status(500).json({ error: 'Failed to delete work' });
  }
});

// Update contact
app.put('/api/admin/contact', verifyToken, (req, res) => {
  const contact = req.body;
  if (updateSection('contact', contact)) {
    res.json({ success: true, message: '✅ Contact updated!' });
  } else {
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: '✅ Backend is running!', message: 'Use /api/* endpoints for data access.' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Backend is running!' });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🎬 PORTFOLIO BACKEND                 ║
╠════════════════════════════════════════╣
║   Server: http://localhost:${PORT}        ║
║   Public API: /api/public/*            ║
║   Admin API: /api/admin/*              ║
║   Auth: POST /api/auth/login           ║
╚════════════════════════════════════════╝
  `);
});


