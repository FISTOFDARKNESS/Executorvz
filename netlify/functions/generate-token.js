const crypto = require('crypto');

// CONFIGURAÇÃO ZETA 🔥
const SECRET_KEY = "zeta-realm-secret-key-" + Date.now().toString(36);
const SCRIPT_CONTENT = `print("hi")`;

exports.handler = async (event) => {
    // Headers CORS
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Token, User-Agent, Content-Type",
        "Content-Type": "application/json",
        "X-Zeta-Realm": "Protected-Script-System"
    };

    // Handle CORS preflight
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    try {
        // Gera timestamp e token
        const timestamp = Date.now().toString();
        const signature = crypto
            .createHmac("sha256", SECRET_KEY)
            .update(timestamp + (event.headers['user-agent'] || 'ZoClient'))
            .digest("hex");
        
        const token = `${timestamp}.${signature}`;
        
        // Gera URL do script com token
        const scriptUrl = `https://${event.headers.host || 'api-excaliburhub.netlify.app'}/.netlify/functions/get-script?token=${token}`;
        
        // Response baseada no formato solicitado
        const format = event.queryStringParameters?.format || 'json';
        
        if (format === 'loadstring') {
            // Retorna direto o loadstring
            return {
                statusCode: 200,
                headers: { ...headers, "Content-Type": "text/plain" },
                body: `loadstring(game:HttpGet("${scriptUrl}", {["X-Token"] = "${token}", ["User-Agent"] = "ZoClient/1.0"}))()`
            };
        }
        
        // Response padrão JSON
        const response = {
            success: true,
            token: token,
            url: scriptUrl,
            headers: {
                "X-Token": token,
                "User-Agent": "ZoClient/1.0"
            },
            expires_in: 15000, // 15 segundos
            timestamp: timestamp,
            server_time: new Date().toISOString(),
            note: "Token válido por 15 segundos. Use headers X-Token e User-Agent.",
            loadstring_example: `loadstring(game:HttpGet("${scriptUrl}", {["X-Token"] = "${token}", ["User-Agent"] = "ZoClient/1.0"}))()`
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(response, null, 2)
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message,
                note: "Internal server error - Zeta Realm"
            })
        };
    }
};
