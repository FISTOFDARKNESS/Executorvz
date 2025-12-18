const crypto = require('crypto');
const SECRET_KEY = "zeta-realm-master-secret-key-2024";
const SCRIPT_CONTENT = `https://pastefy.app/RBcneQxu/raw`;

exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json"
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    try {
        const timestamp = Date.now().toString();
        const signature = crypto
            .createHmac("sha256", SECRET_KEY)
            .update(timestamp)
            .digest("hex");
        
        const token = `${timestamp}.${signature}`;
        
        // URL ABSOLUTA do seu site
        const siteUrl = `https://${event.headers.host || 'api-excaliburhub.netlify.app'}`;
        const scriptUrl = `${siteUrl}/.netlify/functions/get-script?token=${token}`;
        
        const response = {
            success: true,
            token: token,
            url: scriptUrl,  // URL ABSOLUTA
            headers: {
                "X-Token": token,
                "User-Agent": "ZoClient/1.0"
            },
            expires_in: 2000, // 30 segundos
            loadstring: `loadstring(game:HttpGet("${scriptUrl}", {["X-Token"] = "${token}", ["User-Agent"] = "ZoClient/1.0"}))()`
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(response)
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
