const crypto = require('crypto');

// MESMA SECRET KEY do generate-token
const SECRET_KEY = "zeta-realm-secret-key-" + Date.now().toString(36);
const SCRIPT_CONTENT = `print("hi2")`;

exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Token, User-Agent, Content-Type",
        "Content-Type": "text/plain",
        "X-Zeta-Realm": "Protected-Script-Delivery"
    };

    // CORS preflight
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    try {
        // Pega o token da query string
        const token = event.queryStringParameters?.token;
        
        if (!token) {
            return {
                statusCode: 403,
                headers: { ...headers, "Content-Type": "application/json" },
                body: JSON.stringify({
                    error: "Token required",
                    message: "Access forbidden. No token provided.",
                    hint: "Use /api/generate-token first"
                })
            };
        }

        // Verifica headers (opcional mas recomendado)
        const clientToken = event.headers['x-token'];
        const userAgent = event.headers['user-agent'] || '';
        
        // Divide o token
        const parts = token.split('.');
        if (parts.length !== 2) {
            return {
                statusCode: 403,
                headers,
                body: "Access Denied: Invalid token format ⚠️"
            };
        }

        const [timestamp, signature] = parts;
        
        // Verifica expiração (15 segundos)
        const now = Date.now();
        const tokenTime = parseInt(timestamp);
        
        if (Math.abs(now - tokenTime) > 15000) {
            return {
                statusCode: 403,
                headers,
                body: "Access Denied: Token expired ⏰"
            };
        }

        // Verifica assinatura
        const expectedSignature = crypto
            .createHmac("sha256", SECRET_KEY)
            .update(timestamp + (userAgent.includes('ZoClient') ? 'ZoClient' : userAgent))
            .digest("hex");
        
        if (signature !== expectedSignature) {
            return {
                statusCode: 403,
                headers,
                body: "Access Denied: Invalid signature 🔐"
            };
        }

        // TOKEN VÁLIDO - Entrega o script
        return {
            statusCode: 200,
            headers,
            body: SCRIPT_CONTENT
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({
                error: "Internal Server Error",
                message: error.message
            })
        };
    }
};
