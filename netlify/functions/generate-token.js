const crypto = require("crypto");

const SECRET = "excaliburhub-secret";

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const ts = Date.now().toString();
  const sig = crypto.createHmac("sha256", SECRET).update(ts).digest("hex");
  const token = `${ts}.${sig}`;
  
  const directScriptUrl = `https://api-excaliburhub.netlify.app/.netlify/functions/get-script?token=${token}`;
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      token: token,
      timestamp: ts,
      signature: sig,
      debug: {
        server_time: new Date().toISOString(),
        token_valid_for_ms: 15000,
        recommended_ua: "temp",
        note: "If 404, try different User-Agent or empty UA"
      },
      loadstring_url: directScriptUrl,
      loadstring_example: `loadstring(game:HttpGet("${directScriptUrl}"))()`
    })
  };
};
