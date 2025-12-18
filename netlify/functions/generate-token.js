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
        const siteUrl = `https://${event.headers.host || 'zeta-realm.netlify.app'}`;
        const scriptUrl = `${siteUrl}/.netlify/functions/get-script?token=${token}`;
        
        const response = {
            success: true,
            token: token,
            url: scriptUrl,  // URL ABSOLUTA
            headers: {
                "X-Token": token,
                "User-Agent": "ZoClient/1.0"
            },
            expires_in: 30000, // 30 segundos
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
