const crypto = require("crypto");
const SECRET = "FUCKYOUNIGGA";

const FILES = {
  "5f38a9b95530af2a5429fc6e693a328a8765534ce": `
print("Script carregado com token válido")
  `
};

exports.handler = async (event) => {
  const hash = event.path.split("/").pop();
  const token = event.headers["x-token"];
  const ua = event.headers["user-agent"] || "";

  if (ua.includes("Mozilla")) {
    return { statusCode: 404 };
  }

  if (!token || !token.includes(".")) {
    return { statusCode: 403 };
  }

  const [dataB64, sig] = token.split(".");
  const data = Buffer.from(dataB64, "base64").toString();

  const expectedSig = crypto
    .createHmac("sha256", SECRET)
    .update(data)
    .digest("hex");

  if (sig !== expectedSig) {
    return { statusCode: 403 };
  }

  const payload = JSON.parse(data);
  if (Date.now() > payload.exp) {
    return { statusCode: 403 };
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
