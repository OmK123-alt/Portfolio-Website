import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB, readData, writeData, getSection, updateSection, isSupabaseEnabled } from './db.js';
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

await initDB();

const MAX_OPTIONAL_VIDEO_LINKS = 5;

function normalizeVideoLink(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeOptionalVideoLinks(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(normalizeVideoLink)
    .filter(Boolean)
    .slice(0, MAX_OPTIONAL_VIDEO_LINKS);
}

function buildWorkPayload(payload, existingWork = {}) {
  const primaryVideoUrl = normalizeVideoLink(
    payload.primaryVideoUrl || payload.videoUrl || existingWork.primaryVideoUrl || existingWork.videoUrl
  );

  const optionalFromPayload = payload.optionalVideoUrls ?? payload.videoLinks;
  const optionalVideoUrls = normalizeOptionalVideoLinks(
    optionalFromPayload ?? existingWork.optionalVideoUrls ?? existingWork.videoLinks
  );

  return {
    ...existingWork,
    ...payload,
    primaryVideoUrl,
    optionalVideoUrls,
    // Keep legacy key in sync for compatibility with existing clients.
    videoUrl: primaryVideoUrl
  };
}

function validateWorkPayload(payload) {
  if (!payload.title || typeof payload.title !== 'string' || !payload.title.trim()) {
    return 'Title is required';
  }

  if (!payload.primaryVideoUrl) {
    return 'Primary video link is required';
  }

  if (!Array.isArray(payload.optionalVideoUrls)) {
    return 'Optional video links must be an array';
  }

  if (payload.optionalVideoUrls.length > MAX_OPTIONAL_VIDEO_LINKS) {
    return `You can add up to ${MAX_OPTIONAL_VIDEO_LINKS} optional video links`;
  }

  return null;
}

// ═══════════════════════════════════════════════════════
// PUBLIC ROUTES
// ═══════════════════════════════════════════════════════

// Get all portfolio data
app.get('/api/public/portfolio', async (req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific section
app.get('/api/public/:section', async (req, res) => {
  const { section } = req.params;
  let data;

  try {
    data = await getSection(section);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

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
app.get('/api/admin/data', verifyToken, async (req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile
app.put('/api/admin/profile', verifyToken, async (req, res) => {
  try {
    const profile = req.body;
    if (await updateSection('profile', profile)) {
      res.json({ success: true, message: '✅ Profile updated!' });
    } else {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update hero section
app.put('/api/admin/hero', verifyToken, async (req, res) => {
  try {
    const hero = req.body;
    if (await updateSection('hero', hero)) {
      res.json({ success: true, message: '✅ Hero updated!' });
    } else {
      res.status(500).json({ error: 'Failed to update hero' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update skills
app.put('/api/admin/skills', verifyToken, async (req, res) => {
  try {
    const skills = req.body;
    if (await updateSection('skills', skills)) {
      res.json({ success: true, message: '✅ Skills updated!' });
    } else {
      res.status(500).json({ error: 'Failed to update skills' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get works
app.get('/api/admin/works', verifyToken, async (req, res) => {
  try {
    const works = await getSection('works');
    res.json(works);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

// Upload image (data URL passthrough for lightweight deployments)
app.post('/api/admin/upload/image', verifyToken, (req, res) => {
  const { fileData } = req.body || {};

  if (!fileData || typeof fileData !== 'string') {
    return res.status(400).json({ error: 'Invalid image payload' });
  }

  if (!fileData.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Only image data URLs are supported' });
  }

  return res.json({ success: true, url: fileData });
});

// Add work
app.post('/api/admin/works', verifyToken, async (req, res) => {
  try {
    const data = await readData();
    const normalizedWork = buildWorkPayload(req.body);
    const validationError = validateWorkPayload(normalizedWork);

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const newWork = {
      id: Math.max(...data.works.map(w => w.id), 0) + 1,
      ...normalizedWork,
      createdAt: new Date().toISOString()
    };
    data.works.push(newWork);

    if (await writeData(data)) {
      res.json({ success: true, message: '✅ Work added!', data: newWork });
    } else {
      res.status(500).json({ error: 'Failed to add work' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update work
app.put('/api/admin/works/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readData();
    const index = data.works.findIndex(w => w.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ error: 'Work not found' });
    }

    const normalizedWork = buildWorkPayload(req.body, data.works[index]);
    const validationError = validateWorkPayload(normalizedWork);

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    data.works[index] = normalizedWork;
    if (await writeData(data)) {
      res.json({ success: true, message: '✅ Work updated!' });
    } else {
      res.status(500).json({ error: 'Failed to update work' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete work
app.delete('/api/admin/works/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readData();
    const initialLength = data.works.length;
    data.works = data.works.filter(w => w.id !== parseInt(id));

    if (data.works.length < initialLength && await writeData(data)) {
      res.json({ success: true, message: '✅ Work deleted!' });
    } else {
      res.status(500).json({ error: 'Failed to delete work' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update contact
app.put('/api/admin/contact', verifyToken, async (req, res) => {
  try {
    const contact = req.body;
    if (await updateSection('contact', contact)) {
      res.json({ success: true, message: '✅ Contact updated!' });
    } else {
      res.status(500).json({ error: 'Failed to update contact' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: '✅ Backend is running!', message: 'Use /api/* endpoints for data access.' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Backend is running!', supabase: isSupabaseEnabled() });
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


