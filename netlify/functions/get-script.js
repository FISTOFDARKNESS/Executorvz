const crypto = require('crypto');

const SECRET_KEY = "zeta-realm-" + Date.now().toString(36);
const SCRIPT_CONTENT = `print("Zeta Realm Loaded! 🔥")
print("Time: " .. os.date())

-- Your exploit code here
local Player = game:GetService("Players").LocalPlayer
game:GetService("StarterGui"):SetCore("SendNotification", {
    Title = "Zeta Realm",
    Text = "Script executed successfully!",
    Duration = 5
})

print("Player: " .. Player.Name)
return true`;

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
            body: "ERROR: Token required. Visit /.netlify/functions/generate-token first."
        };
    }

    try {
        const parts = token.split('.');
        if (parts.length !== 2) {
            return { statusCode: 403, headers, body: "ERROR: Invalid token" };
        }

        const [timestamp, signature] = parts;
        const now = Date.now();
        const tokenTime = parseInt(timestamp);
        
        // 30 segundos de validade
        if (Math.abs(now - tokenTime) > 30000) {
            return { statusCode: 403, headers, body: "ERROR: Token expired" };
        }

        const expectedSignature = crypto
            .createHmac("sha256", SECRET_KEY)
            .update(timestamp)
            .digest("hex");
        
        if (signature !== expectedSignature) {
            return { statusCode: 403, headers, body: "ERROR: Invalid signature" };
        }

        // TOKEN VÁLIDO
        return {
            statusCode: 200,
            headers,
            body: SCRIPT_CONTENT
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: "ERROR: " + error.message
        };
    }
};
