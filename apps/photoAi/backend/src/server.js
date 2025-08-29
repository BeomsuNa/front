import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js"; // 인증 라우트

dotenv.config();

const app = express();

// 미들웨어
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET || "")); // 쿠키 파서 전역 적용
// 기본 라우트
app.get("/", (_req,  res) => {
  res.send("Backend 서버가 정상적으로 실행 중입니다!");
});

// 인증 라우트
app.use("/api/auth", authRouter);


// 에러 핸들링
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// 서버 시작
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
