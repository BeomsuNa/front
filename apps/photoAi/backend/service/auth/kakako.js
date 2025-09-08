import express from "express";
import * as GoogleAuth from "../services/auth/google";
import * as KakaoAuth from "../services/auth/kakao";
import * as GithubAuth from "../services/auth/github";

const router = express.Router();

router.post("/:provider", async (req, res, next) => {
  try {
    const { provider } = req.params;
    const { access_token } = req.body;

    let user;

    switch (provider) {
      case "google":
        user = await GoogleAuth.verify(access_token);
        break;
      case "kakao":
        user = await KakaoAuth.verify(access_token);
        break;
      case "github":
        user = await GithubAuth.verify(access_token);
        break;
      default:
        return res.status(400).json({ error: "Unsupported provider" });
    }

    // DB에서 user 확인 or 신규 생성
    // const dbUser = await upsertUser(user);

    // JWT 발급
    const jwtToken = "signed-jwt"; // 실제는 sign(user, process.env.JWT_SECRET)
    return res.json({ token: jwtToken, user });
  } catch (err) {
    next(err);
  }
});

export default router;