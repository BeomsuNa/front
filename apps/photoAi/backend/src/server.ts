// apps/your-project/backend/src/server.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRouter from './routes/auth';

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json())
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Backend 서버가 정상적으로 실행 중입니다!');
});
// 라우트
app.use('/api/auth', authRouter);

// 에러 핸들링 (간단 예시)
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});