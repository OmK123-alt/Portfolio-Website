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
      title: "Automotive Photography",
      category: "Photography",
      description: "Automotive event coverage focused on raw power, design, and emotion across Underground 9th Edition, India Bike Week 2024, Cars & Coffee by Pune Supercar Club, Pitstop by Symbhav, and Piston Wolves meets.",
      thumbnail: "/portfolio/automotive-photography.jpg",
      primaryVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      optionalVideoUrls: [],
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "Event coverage",
      year: 2024
    },
    {
      id: 2,
      title: "Underground 9th Edition",
      category: "Event Photography",
      description: "Covered Tapaswi Racing's high-adrenaline automotive event featuring national car communities, custom builders, superbike groups, professional drift talent, and Bajaj Pulsar NS 400 stunt showcases.",
      thumbnail: "/portfolio/underground-9-edition.jpg",
      primaryVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      optionalVideoUrls: [],
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "Event story",
      year: 2024
    },
    {
      id: 3,
      title: "Team Screwdrivers Social Media",
      category: "Social Media",
      description: "Managed a Formula Student team's Instagram for two years, growing from around 1,000 to 2,000 followers, reaching up to 610k views on a single reel, and supporting a People's Choice Award nomination.",
      thumbnail: "/portfolio/team-screwdrivers-social.jpg",
      primaryVideoUrl: "https://drive.google.com/file/d/17mu43WtaPN7SmJu5azkKWuwCckykVin8/preview",
      optionalVideoUrls: [
        "https://www.instagram.com/p/C3aIoSCyPHn/?igsh=ZGJmamlzaWh0OTho"
      ],
      videoUrl: "https://drive.google.com/file/d/17mu43WtaPN7SmJu5azkKWuwCckykVin8/preview",
      linkUrl: "https://www.instagram.com/p/C3aIoSCyPHn/?igsh=ZGJmamlzaWh0OTho",
      duration: "2 years",
      year: 2024
    },
    {
      id: 4,
      title: "Freelance Video Editing & Cinematography",
      category: "Video Editing",
      description: "Freelance trial work for Softcadd Consultancy & Services and a food-based vlogging page, creating three reels, crossing 50k views on each reel, and operating a Canon 2000D for shoots.",
      thumbnail: "/portfolio/freelance-video-work.jpg",
      primaryVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      optionalVideoUrls: [],
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "3 reels",
      year: 2024
    },
    {
      id: 5,
      title: "Sharda Academy Media Handling",
      category: "Video Editing",
      description: "Current video editor, social media handler, and technical head work covering 50+ education reels, audio edits, long and short edits, Photoshop/CorelDraw carousel design, DaVinci Resolve editing, camera handling, Meta Business Suite, SEO captions, and Zoho CRM practice.",
      thumbnail: "/portfolio/sharda-academy-media.jpg",
      primaryVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      optionalVideoUrls: [],
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "50+ reels",
      year: 2026
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
