// apps/your-project/backend/src/routes/auth.ts
import { Router } from 'express';
import { db } from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

// POST /api/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.query('SELECT id, name, password_hash FROM users WHERE email = ?', [email]);
  const user = (rows as any[])[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '2h' });
  res.json({ token, user: { id: user.id, name: user.name } });
});

// GET /api/profile
router.get('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).end();
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const [rows] = await db.query('SELECT id, email, name FROM users WHERE id = ?', [payload.userId]);
    return res.json((rows as any[])[0]);
  } catch {
    return res.status(401).end();
  }
});

export default router;