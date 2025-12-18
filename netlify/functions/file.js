const crypto = require("crypto");

const SECRET = "excaliburhub-secret";

const FILES = {
  "5f38a9b95530af2a5429fc6e693a328a8765534ce": `
print("Script carregado com token válido")
  `
};

function validToken(token) {
  try {
    const [ts, sig] = token.split(".");
    if (!ts || !sig) return false;

    if (Date.now() - Number(ts) > 15000) return false;

    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(ts)
      .digest("hex");

    return expected === sig;
  } catch {
    return false;
  }
}

exports.handler = async (event) => {
  const hash = event.path.split("/").pop();
  const token = event.headers["x-token"];
  const ua = event.headers["user-agent"] || "";

  if (ua.includes("Mozilla")) {
    return { statusCode: 404 };
  }

  if (!token || !validToken(token)) {
    return { statusCode: 403, body: "Invalid token" };
  }

  if (!FILES[hash]) {
    return { statusCode: 404 };
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-store"
    },
    body: FILES[hash]
  };
};
