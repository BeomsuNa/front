// apps/your-project/backend/src/routes/auth.ts
import { Router } from 'express';
import { db } from '../db.js';
import { mailer } from '../utils/mailer.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// POST
// /api/sendmagic 
router.post('/magic-link', async (req, res, next) => {
  try {
  const {email} = req.body ;
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
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.json({ token, user: { id: user.id, name: user.name } });
});

// /api/google
router.post('/auth/google', async(req, res)=>{
  const {credentials} = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credentials,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
   const [rows] = await db.query(
      "SELECT * FROM users WHERE provider=? AND provider_id=? LIMIT 1",
      ["google", payload.sub]
    );
    let user = rows[0]

    if (!user) {
      const [result] = await db.query(
        "INSERT INTO users (email, name, provider, provider_id, profile_image) VALUES (?, ?, ?, ?, ?)",
        [payload.email, payload.name, "google", payload.sub, payload.picture]
      );
      user = { id: result.insertId, email: payload.email, name: payload.name };
    }

        // 4. JWT 발급
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
})



// GET 

// /api/magicLink
router.get("/magic/callback", async (req, res, next) => {
  const cookieBase = {
        credentials: "include",
        httpOnly: true,
        secure: true, // 로컬 개발 false, 배포 true
        sameSite: "none",
        path: "/",
        maxAge: 10 * 60 * 1000
      };

  try {
    const token = String(req.query.token || "");
    // 링크를 통해 받은 토큰을 검증
    if (!token) return res.status(400).send("잘못된 요청");
    const [tokenRows] = await db.query(
      "SELECT * FROM magic_links WHERE token=? AND used=0 AND expires_at > NOW() LIMIT 1",
      [token]
    );
    // 에러처리, 없는 링크 이거나 사용한 링크의 경우
    const rec = tokenRows[0];

    if (!rec) return res.status(400).send("유효하지 않은 링크");
    if (rec.used) return res.status(400).send("이미 사용된 링크");

     // 토큰 사용 처리
    await db.query("UPDATE magic_links SET used=1 WHERE token=?", [token]);

     // 사용자 정보 조회
    const [userRows] = await db.query(
      "SELECT id, email, name FROM users WHERE email=? LIMIT 1",
      [rec.email]
    );

    const user = userRows[0];
    if (!user) {
      // 아직 미가입 → 가입 인증 세션 쿠키를 심고 가입 페이지로
      const signupJwt = jwt.sign(
        { typ: "signup", email: rec.email },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
      );
      res.cookie("signup_session", signupJwt, {
        ...cookieBase,
        maxAge: 10 * 60 * 1000,
      });
      return  res.send(
        `<!doctype html>
  <meta charset="utf-8"/>
  <title>이메일 인증 완료</title>
  <style>body{font:14px system-ui;padding:24px}</style>
  <h2>이메일 인증 완료 ✅</h2>
  <p>원래 가입 페이지에서 자동으로 확인됩니다.<br/>이 창은 닫아도 됩니다.</p>`
      )
    }
  } catch (e) {
    next(e);
  }
});

router.get('/signup-status', (req, res) => {
  const token = req.cookies?.signup_session;
  if (!token) return res.json({ verified: false });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.typ !== 'signup') return res.json({ verified: false });
    return res.json({ verified: true, email: payload.email });
  } catch {
    return res.json({ verified: false });
  }
});


export default router;