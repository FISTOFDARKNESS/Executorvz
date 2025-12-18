const crypto = require('crypto');

const SECRET = "excaliburhub-secret";

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "text/plain"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const token = event.queryStringParameters?.token;
  
  if (!token) {
    return {
      statusCode: 403,
      headers,
      body: "Access Forbidden: No token provided 🔒"
    };
  }

  // Divide o token em timestamp e assinatura
  const parts = token.split('.');
  if (parts.length !== 2) {
    return {
      statusCode: 403,
      headers,
      body: "Access Forbidden: Invalid token format ⚠️"
    };
  }

  const [timestamp, signature] = parts;
  
  const now = Date.now();
  const tokenTime = parseInt(timestamp);
  
  if (Math.abs(now - tokenTime) > 15000) {
    return {
      statusCode: 403,
      headers,
      body: "Access Forbidden: Token expired ⏰"
    };
  }

  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(timestamp)
    .digest("hex");

  if (signature !== expectedSignature) {
    return {
      statusCode: 403,
      headers,
      body: "Access Forbidden: Invalid signature 🔐"
    };
  }

  const script = `print("Hello from Zeta, Alpha! 🔥")`;
  
  return {
    statusCode: 200,
    headers,
    body: script
  };
};
