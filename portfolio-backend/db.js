import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data.json');
const IS_VERCEL = process.env.VERCEL === '1';

// Default portfolio data structure
const DEFAULT_DATA = {
  profile: {
    name: "Shakkya Belhekar",
    title: "Video Editor & Content Creator",
    bio: "Crafting compelling narratives through motion and sound. Specializing in educational content, YouTube videos, and brand campaigns.",
    email: "shakkya@email.com",
    whatsapp: "+91 XXXXX XXXXX",
    location: "Pune, India",
    profileImage: "https://via.placeholder.com/150"
  },
  hero: {
    headline: "Professional Video Editing & Content Production",
    subheadline: "I transform ideas into engaging visual stories for educational platforms, YouTube channels, and brands."
  },
  skills: {
    title: "Technical & Creative Skills",
    subtitle: "Here's what I bring to your projects:",
    categories: [
      {
        name: "Software & Tools",
        items: [
          "Adobe Premiere Pro (Advanced)",
          "Adobe After Effects (Advanced)",
          "DaVinci Resolve (Professional)",
          "CapCut & Mobile Editing",
          "Photoshop & Graphic Design",
          "YouTube Studio & Analytics"
        ]
      },
      {
        name: "Core Competencies",
        items: [
          "Storytelling & Narrative Structure",
          "Color Grading & Color Correction",
          "Sound Design & Audio Mixing",
          "Motion Graphics & Animation",
          "Video Compression & Optimization",
          "Multi-Platform Content Adaptation"
        ]
      }
    ]
  },
  works: [
    {
      id: 1,
      title: "MPSC Batch Promotional Video",
      category: "Educational Content",
      description: "High-energy promotional video for competitive exam batches",
      thumbnail: "https://via.placeholder.com/400x300?text=MPSC+Video",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "2 min 15 sec",
      year: 2024
    },
    {
      id: 2,
      title: "YouTube Channel Intro Sequence",
      category: "Motion Graphics",
      description: "Custom intro and branding package for education channel",
      thumbnail: "https://via.placeholder.com/400x300?text=Intro+Video",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "30 sec",
      year: 2024
    },
    {
      id: 3,
      title: "Student Testimonial Reel",
      category: "Social Media",
      description: "Instagram-optimized testimonial video for student success stories",
      thumbnail: "https://via.placeholder.com/400x300?text=Testimonial",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "45 sec",
      year: 2024
    },
    {
      id: 4,
      title: "Brand Campaign Commercial",
      category: "Commercial",
      description: "30-second commercial for brand awareness campaign",
      thumbnail: "https://via.placeholder.com/400x300?text=Commercial",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "30 sec",
      year: 2024
    }
  ],
  contact: {
    heading: "Let's Work Together",
    subheading: "Whether you need video editing, motion graphics, or content production – I'm here to bring your vision to life.",
    links: [
      {
        name: "Email",
        value: "shakkya@email.com",
        icon: "✉️",
        url: "mailto:shakkya@email.com"
      },
      {
        name: "WhatsApp",
        value: "+91 XXXXX XXXXX",
        icon: "💬",
        url: "https://wa.me/91XXXXXXXXXX"
      },
      {
        name: "LinkedIn",
        value: "linkedin.com/in/shakkya",
        icon: "💼",
        url: "https://linkedin.com/in/shakkya"
      },
      {
        name: "Instagram",
        value: "@shakkya",
        icon: "📸",
        url: "https://instagram.com/shakkya"
      }
    ]
  }
};

const cloneDefaultData = () => JSON.parse(JSON.stringify(DEFAULT_DATA));
let useMemoryStore = false;
let memoryData = cloneDefaultData();

// Initialize database
export function initDB() {
  if (useMemoryStore) {
    return;
  }

  if (fs.existsSync(DATA_FILE)) {
    return;
  }

  if (IS_VERCEL) {
    useMemoryStore = true;
    memoryData = cloneDefaultData();
    console.warn('Using in-memory data store on Vercel (non-persistent).');
    return;
  }

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2));
    console.log('✅ Database initialized');
  } catch (error) {
    useMemoryStore = true;
    memoryData = cloneDefaultData();
    console.warn('Falling back to in-memory data store:', error.message);
  }
}

// Read data
export function readData() {
  if (useMemoryStore) {
    return memoryData;
  }

  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (IS_VERCEL || error.code === 'EROFS' || error.code === 'ENOENT') {
      useMemoryStore = true;
      memoryData = cloneDefaultData();
      return memoryData;
    }

    console.error('Error reading data:', error);
    return cloneDefaultData();
  }
}

// Write data
export function writeData(data) {
  if (useMemoryStore) {
    memoryData = data;
    return true;
  }

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    if (IS_VERCEL || error.code === 'EROFS' || error.code === 'EACCES') {
      useMemoryStore = true;
      memoryData = data;
      return true;
    }

    console.error('Error writing data:', error);
    return false;
  }
}

// Get section
export function getSection(section) {
  const data = readData();
  return data[section] || null;
}

// Update section
export function updateSection(section, newData) {
  const data = readData();
  data[section] = newData;
  return writeData(data);
}

initDB();
