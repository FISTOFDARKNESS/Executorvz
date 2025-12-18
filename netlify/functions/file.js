const { TOKENS } = require("./token");

const FILES = {
  "5f38a9b95530af2a5429fc6e693a328a8765534ce": `
print("Script carregado com token")
  `
};

exports.handler = async (event) => {
  const hash = event.path.split("/").pop();
  const token = event.headers["x-token"];
  const ua = event.headers["user-agent"] || "";

  if (ua.includes("Mozilla")) {
    return { statusCode: 404 };
  }

  if (!token || !TOKENS.has(token)) {
    return { statusCode: 403, body: "Invalid token" };
  }

  TOKENS.delete(token);

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
