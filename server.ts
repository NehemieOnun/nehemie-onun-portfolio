import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API client if key exists
  const aiApiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (aiApiKey) {
    ai = new GoogleGenAI({ apiKey: aiApiKey });
  }

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Contact Form Endpoint
  app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    console.log(`[Contact Form Received] From: ${name} (${email}) - Subject: ${subject}`);
    res.json({ success: true, message: 'Message received successfully!' });
  });

  // Gemini AI Assistant Chat Endpoint
  app.post('/api/chat', async (req, res) => {
    const language = req.body?.language || 'fr';
    try {
      const { message } = req.body;

      if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      if (!aiApiKey || !ai) {
        // High quality persona fallback reply
        const fallbackReply = language === 'fr'
          ? "Bonjour ! Néhémie Onun Kambongh est un développeur Full Stack et étudiant en Génie Informatique basé à Lubumbashi (RDC). Ses compétences principales incluent React, TypeScript, Node.js, Java, Python, MySQL, Cisco TCP/IP et la cybersécurité. Vous pouvez le contacter directement par e-mail à nehemieonun182@gmail.com ou via WhatsApp !"
          : "Hello! Néhémie Onun Kambongh is a Full Stack Developer and Computer Engineering student based in Lubumbashi (DRC). His core skills include React, TypeScript, Node.js, Java, Python, MySQL, Cisco TCP/IP, and cybersecurity. You can contact him directly via email at nehemieonun182@gmail.com or via WhatsApp!";
        
        res.json({ reply: fallbackReply });
        return;
      }

      const prompt = `You are "Néhémie AI", an enthusiastic, polite, and highly intelligent AI representative for Néhémie Onun Kambongh.
      Profile of Néhémie Onun Kambongh:
      - Full Stack Developer & Computer Engineering student based in Lubumbashi, DRC.
      - Core stack: React 19, TypeScript, Node.js, Express, Java, Python, C, MySQL, SQLite, Firebase, Tailwind CSS.
      - Networks & Security: Cisco Networking, TCP/IP, OSI Model, VLANs, Cybersecurity Audits.
      - Major Projects:
        1. UR-GEDT Portal Management System (Academic document management portal with PDF QR-codes).
        2. SmartFix AI RDC (AI diagnostic app for hardware and motherboard fault detection).
        3. Site Web Invitation Mariage (Luxury wedding invitation site with real-time RSVP).
        4. Mobile Inventory App (Offline-first stock management app for local merchants).
        5. Admin Security Dashboard (Real-time network packet telemetry and audit logs).
      - Certifications: HP LIFE, Coursera (Google IT), Orange Digital Center, PIX, UNDP (PNUD), UNV, TOSA Excel.
      - Email: nehemieonun182@gmail.com | Location: Lubumbashi, RDC.
      
      Respond in ${language === 'fr' ? 'French' : 'English'} concisely, professionally, and warmly. Keep responses under 120 words.
      User Question: ${message}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const replyText = response.text || (language === 'fr' ? "Je suis disponible pour répondre à vos questions sur Néhémie !" : "I am available to answer your questions about Néhémie!");

      res.json({ reply: replyText });
    } catch (err) {
      console.error('Gemini Chat error:', err);
      const fallbackReply = language === 'fr'
        ? "Néhémie Onun Kambongh est disponible pour des projets de développement web, mobile, et de cybersécurité. N'hésitez pas à lui laisser un message direct dans la section contact !"
        : "Néhémie Onun Kambongh is available for web, mobile, and cybersecurity projects. Feel free to send him a direct message in the contact section!";
      res.json({ reply: fallbackReply });
    }
  });

  // Vite Middleware in Dev vs Static Files in Prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
