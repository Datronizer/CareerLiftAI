const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const GeminiClient = require('./services/geminiClient');
const ANALYSIS_SCHEMA = require('./constants/analysisSchema');
const LEARNING_SCHEMA = require('./constants/learningSchema');
const RECOMMENDATIONS_DB = require('./data/recommendations');
const { cleanupFile } = require('./utils/fileUtils');

dotenv.config();

// --- Config & Constants ---

const app = express();
const PORT = process.env.PORT || 4000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-preview-09-2025';

if (!GEMINI_API_KEY) {
  console.warn('Warning: GEMINI_API_KEY is not set. The /api/analyze endpoint will fail until you add it to your .env file.');
}

const UPLOAD_DIR = path.join(__dirname, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// --- Middleware ---

app.use(cors());
app.use(express.json({ limit: '2mb' }));

const geminiClient = new GeminiClient({
  apiKey: GEMINI_API_KEY,
  model: GEMINI_MODEL,
  schema: ANALYSIS_SCHEMA,
  learningSchema: LEARNING_SCHEMA
});

const upload = multer({
  storage: multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, UPLOAD_DIR);
    },
    filename: function (_req, file, cb) {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${unique}-${file.originalname}`);
    }
  })
});

// --- Routes ---

app.post('/api/analyze', async (req, res) => {
  try {
    const { resumeText, careerGoal } = req.body || {};

    if (!resumeText || !careerGoal) {
      return res.status(400).json({ error: 'resumeText and careerGoal are required.' });
    }

    const analysisWithMetadata = await geminiClient.generateStructuredAnalysis(resumeText, careerGoal);
    return res.json(analysisWithMetadata);
  } catch (error) {
    console.error('Error in /api/analyze:', error?.response?.data || error.message || error);
    return res.status(500).json({
      error: 'Failed to analyze resume with Gemini.',
      details: error?.response?.data || error.message
    });
  }
});

app.post('/api/upload-resume', upload.single('file'), async (req, res) => {
  let filePath;
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded.' });
    }

    const { careerGoal } = req.body || {};
    filePath = req.file.path;

    const text = await geminiClient.extractTextFromFile(req.file);

    let analysis = null;
    if (careerGoal) {
      analysis = await geminiClient.generateStructuredAnalysis(text, careerGoal);
    }

    return res.json({
      extractedText: text,
      characterCount: text.length,
      analysis
    });
  } catch (error) {
    console.error('Upload error:', error?.response?.data || error.message || error);
    return res.status(500).json({
      error: "Failed to process uploaded resume.",
      details: error?.response?.data || error.message
    });
  } finally {
    cleanupFile(filePath);
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const { role, skills } = req.body || {};

    if (!role) {
      return res.status(400).json({ error: 'role is required.' });
    }

    const skillsText = Array.isArray(skills) ? skills.join(', ') : (skills || '');

    const discovery = await geminiClient.discoverLearningResources(role, skillsText);
    const structured = await geminiClient.structureLearningResources(discovery.text);

    return res.json({
      role,
      skills: skillsText,
      courses: structured.courses || [],
      opportunities: structured.opportunities || [],
      sources: discovery.sources || []
    });
  } catch (error) {
    console.error('Error in /api/courses:', error?.response?.data || error.message || error);
    return res.status(500).json({
      error: 'Failed to fetch courses/opportunities.',
      details: error?.response?.data || error.message
    });
  }
});

app.get('/api/recommendations/details', (req, res) => {
  const { type } = req.query;

  if (!type || !RECOMMENDATIONS_DB[type]) {
    return res.status(400).json({ error: "Invalid type parameter." });
  }

  res.json({
    type,
    items: RECOMMENDATIONS_DB[type]
  });
});

app.get('/', (_req, res) => {
  res.send('CareerLift AI backend is running.');
});

app.listen(PORT, () => {
  console.log(`CareerLift AI backend listening on port ${PORT}`);
});
