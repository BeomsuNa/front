import jwt from "jsonwebtoken"; /* jwt를 사용하기 위해 jsonwebtoken import */

const expirationTime = Math.floor(Date.now() / 1000) + 60*60; /* 현재시간 + @, e.g. 60*60 = 1시간 후 만료되도록 설정 */
const payload = { 
    user_id : "sample_id",
    role : "USER",
    exp : expirationTime,
}; /* payload에 담을 객체를 선언합니다. */

const secretKey = "jwt-secret-key"; /* 사용할 secret 키를 선언합니다. */
const token = jwt.sign(payload, secretKey); /* jwt의 sign 메소드를 사용해서 token을 생성합니다. */
