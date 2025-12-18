const crypto = require("crypto");

const TOKENS = new Map();

exports.handler = async () => {
  const token = crypto.randomBytes(16).toString("hex");
  const expire = Date.now() + 15_000;

  TOKENS.set(token, expire);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-store"
    },
    body: token
  };
};

setInterval(() => {
  const now = Date.now();
  for (const [t, exp] of TOKENS) {
    if (exp < now) TOKENS.delete(t);
  }
}, 10_000);

module.exports.TOKENS = TOKENS;
