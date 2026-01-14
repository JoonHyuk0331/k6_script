import crypto from "k6/crypto";
import encoding from "k6/encoding";

const algToHash = {
  HS256: "sha256",
  HS384: "sha384",
  HS512: "sha512",
};

function sign(data, hashAlg, secret) {
  const secretBytes = encoding.b64decode(secret, 'std');  // Base64 디코딩
  const hasher = crypto.createHMAC(hashAlg, secretBytes); // 디코딩된 바이트로 HMAC 생성
  hasher.update(data); //data 해싱
  return hasher.digest("base64rawurl"); //해싱 결과 Base64URL 인코딩
}

/**
 *
 * @param {Object} payload
 * @param {string} secret
 * @param {string|undefined} algorithm Default: "HS256"
 * @returns string
 */
export function encode(payload, secret, algorithm) {
  algorithm = algorithm || "HS256";
  const header = encoding.b64encode(
    JSON.stringify({ typ: "JWT", alg: algorithm }),
    "rawurl"
  );
  payload = encoding.b64encode(JSON.stringify(payload), "rawurl");
  const sig = sign(header + "." + payload, algToHash[algorithm], secret);
  return [header, payload, sig].join(".");
}

/**
 *
 * @param {string} token
 * @param {string} secret
 * @param {string|undefined} algorithm
 * @returns
 */

export function decode(token, secret, algorithm) {
  const parts = token.split(".");
  const header = JSON.parse(encoding.b64decode(parts[0], "rawurl", "s"));
  const payload = JSON.parse(encoding.b64decode(parts[1], "rawurl", "s"));
  algorithm = algorithm || algToHash[header.alg];
  if (sign(parts[0] + "." + parts[1], algorithm, secret) != parts[2]) {
    throw Error("JWT signature verification failed");
  }
  return payload;
}

/**
 * matchday-api용 JWT 토큰 생성
 * @param {string} userId - 사용자 ID
 * @param {string} email - 사용자 이메일
 * @param {string} role - 사용자 역할 (SUPER_ADMIN, TEAM_ADMIN, USER)
 * @param {string} secret - JWT 시크릿 키
 * @returns {string} JWT 토큰
 */
export function createAccessToken(userId, email, role, secret) {
  const now = Date.now();
  const expirationTime = 1000 * 60 * 30; // 30분
  const exp = Math.floor((now + expirationTime) / 1000);
  const iat = Math.floor(now / 1000);

  const payload = {
    sub: email,
    userId: Number(userId),
    role: role,
    userLifecycle: 'ACTIVE',
    tokenType: 'ACCESS',
    jti: generateJti(userId, 'ACCESS'),
    iat: iat,
    exp: exp,
  };

  return encode(payload, secret, 'HS256');
}

/**
 * JWT ID 생성 (Java 코드와 동일한 형식)
 * @param {string} userId - 사용자 ID
 * @param {string} tokenType - 토큰 타입 (ACCESS, REFRESH 등)
 * @returns {string} JWT ID
 */
function generateJti(userId, tokenType) {
  const timestamp = Date.now();
  const randomId = Math.random().toString(16).substring(2, 10);
  return `${userId}_${tokenType}_${timestamp}_${randomId}`;
}