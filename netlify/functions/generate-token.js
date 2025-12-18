const crypto = require("crypto");

const SECRET = "excaliburhub-secret";

exports.handler = async (event) => {

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    // Gera timestamp atual em milissegundos
    const ts = Date.now().toString();
    
    // Gera HMAC-SHA256 correto
    const sig = crypto
      .createHmac("sha256", SECRET)
      .update(ts)
      .digest("hex");
    
    const token = `${ts}.${sig}`;
    
    // Retorna token + URL pronta pra usar
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        token: token,
        url: "https://api-excaliburhub.netlify.app/file/5f38a9b95530af2a5429fc6e693a328a8765534ce",
        headers: {
          "X-Token": token,
          "User-Agent": "ZoClient/1.0"
        },
        expires_in: 15000 // 15 segundos
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
