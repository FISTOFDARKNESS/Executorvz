const FILES = {
  "5f38a9b95530af2a5429fc6e693a328a8765534ce": `
print("Script A carregado")
  `,
  "a8765534ce5f38a9b95530af2a5429fc6e693a328": `
print("Script B carregado")
  `
};

// Tokens válidos (em memória)
const VALID_TOKENS = new Map();

// Função para limpar tokens expirados a cada 10s
setInterval(() => {
  const now = Date.now();
  for (const [token, expire] of VALID_TOKENS.entries()) {
    if (expire < now) VALID_TOKENS.delete(token);
  }
}, 10000);

exports.handler = async (event) => {
  const pathParts = event.path.split("/");
  const hash = pathParts[pathParts.length - 1];

  const headers = event.headers || {};
  const token = headers["x-token"];
  const ua = headers["user-agent"] || "";

  // Bloqueia navegador
  if (ua.includes("Mozilla")) {
    return { statusCode: 404, body: "Not found" };
  }

  // Token inválido
  if (!token || !VALID_TOKENS.has(token)) {
    return { statusCode: 403, body: "Forbidden or expired token" };
  }

  // Remove token para impedir reuso
  VALID_TOKENS.delete(token);

  // Hash inválido
  if (!FILES[hash]) {
    return { statusCode: 404, body: "Invalid file" };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" },
    body: FILES[hash],
  };
};

// Endpoint extra para gerar token
exports.generateToken = () => {
  const token = Math.random().toString(36).substring(2, 12) + Date.now();
  const expire = Date.now() + 15 * 1000; // Expira em 15s
  VALID_TOKENS.set(token, expire);
  return token;
};
