const crypto = require("crypto");

const FILES = {
  "5c2a4688-69c7-49b3-9432-076b7a9fd5a6": `
print("Script A carregado")
  `,

  "a8765534ce5f38a9b95530af2a5429fc6e693a328": `
print("Script B carregado")
  `
};

const REQUIRED_HEADER = "excaliburhub";

exports.handler = async (event) => {
  const pathParts = event.path.split("/");
  const hash = pathParts[pathParts.length - 1];

  const headers = event.headers || {};
  const ua = headers["user-agent"] || "";
  const clientHeader = headers["x-client"];
  if (ua.includes("Mozilla")) {
    return {
      statusCode: 404,
      body: "Not found"
    };
  }

  if (clientHeader !== REQUIRED_HEADER) {
    return {
      statusCode: 403,
      body: "Forbidden"
    };
  }

  if (!FILES[hash]) {
    return {
      statusCode: 404,
      body: "Invalid file"
    };
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
