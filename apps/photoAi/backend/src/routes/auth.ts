// apps/your-project/backend/src/routes/auth.ts
import { Router } from 'express';
import { db } from '../db';
import { mailer } from '../utils/mailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();


// POST
// /api/sendmagic 
router.post('/magic-link', async (req, res, next) => {
  try {
  const {email} = req.body as { email: string };
  if (!email ||  !/^\S+@\S+\.\S+$/.test(email)) {
     return res.status(200).json({ message: "메일이 잘못되었습니다." });
  }
  const token = crypto.randomUUID()
  await db.query('INSERT INTO magic_links (email, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))', [email, token, Number(process.env.MAGIC_TOKEN_TTL_MINUTES || 10)]);

  const link = `${process.env.BACKEND_URL}/api/auth/magic/callback?token=${token}`
  await mailer.sendMail({
      from: '"photoAi" <no-reply@photoai.local>',
      to: email,
      subject: "로그인 링크 (유효 10분)",
      text: `아래 링크를 클릭해 로그인하세요:\n${link}`,
      html: `
        <div style="font-family:system-ui,AppleSDGothicNeo,Segoe UI,Roboto">
          <h2>로그인 링크</h2>
          <p>아래 버튼을 눌러 로그인하세요. 링크는 <b>${process.env.MAGIC_TOKEN_TTL_MINUTES}분</b>간 유효합니다.</p>
          <p><a href="${link}" style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">로그인하기</a></p>
          <p style="color:#666;font-size:12px">링크가 안 되면 아래 URL을 복사해 브라우저에 붙여넣으세요.<br>${link}</p>
        </div>
      `,
    });
    return res.status(200).json({ message: "메일을 전송했습니다." });

} catch(e) {
  next(e)
}

})

// api/signup
router.post('/signup',async(req, res) => {
  const { email, password, name } = req.body;
  const password_hash = await bcrypt.hash(password, 10);
  await db.query('INSERT INTO users (email, name, password_hash) VALUES(?,?,?)', [email, name, password_hash])
  res.status(201).json({ message: 'User created successfully' })
})

// /api/login
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



// GET 

// /api/magicLink
router.get("/magic/callback", async (req, res, next) => {
  try {
    const token = String(req.query.token || "");
    if (!token) return res.status(400).send("잘못된 요청");

    const [rows] = await db.query(
      "SELECT * FROM magic_links WHERE token=? LIMIT 1",
      [token]
    );
    const rec = (rows as any[])[0];
    if (!rec) return res.status(400).send("유효하지 않은 링크");
    if (rec.used) return res.status(400).send("이미 사용된 링크");
     // 토큰 사용 처리
    await db.query("UPDATE magic_links SET used=1 WHERE token=?", [token]);

     // 사용자 정보 조회
    const [userRows] = await db.query(
      "SELECT id, email, name FROM users WHERE email=? LIMIT 1",
      [rec.email]
    );
    const user = (userRows as any[])[0];
    if (!user) return res.status(404).send("사용자를 찾을 수 없습니다.");

    // JWT 발급
    await db.query("UPDATE magic_links SET used=1 WHERE id=?", [rec.id]);
    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "10m" });

    // 클라이언트에 토큰과 사용자 정보 반환
    return res.redirect(`${process.env.FRONTEND_URL}/signup?token=${jwtToken}`)

  } catch (e) {
    next(e);
  }
});

// /api/profile
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