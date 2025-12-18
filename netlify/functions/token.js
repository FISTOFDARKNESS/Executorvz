const crypto = require("crypto");

const SECRET = "FUCKYOUNIGGA";

exports.handler = async () => {
  const payload = {
    exp: Date.now() + 10_000 // 10s
  };

  const data = JSON.stringify(payload);
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(data)
    .digest("hex");

  const token = Buffer.from(data).toString("base64") + "." + sig;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-store"
    },
    body: token
  };
};
