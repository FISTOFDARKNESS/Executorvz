const crypto = require('crypto');

// ⚠️ IMPORTANTE: MESMA SECRET KEY do generate-token.js ⚠️
const SECRET_KEY = "zeta-realm-" + Date.now().toString(36);
// Se você mudou no generate-token, COPIE A MESMA STRING AQUI!

const SCRIPT_CONTENT = `print("=== ZETA REALM ===")
print("🔥 Script carregado com sucesso!")
print("Hora: " .. os.date())

-- Seu exploit aqui
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer

if LocalPlayer then
    -- Notificação
    local Notification = game:GetService("StarterGui"):SetCore("SendNotification", {
        Title = "Zeta Realm",
        Text = "Executando payload protegido...",
        Duration = 3
    })
    
    print("Jogador: " .. LocalPlayer.Name)
    print("Game ID: " .. game.PlaceId)
    
    -- Exemplo de função
    function teleportToSpawn()
        local character = LocalPlayer.Character
        if character then
            local spawn = workspace:FindFirstChild("SpawnLocation") 
            or workspace:FindFirstChild("Part")
            if spawn then
                character:MoveTo(spawn.Position)
                print("Teleportado para spawn")
            end
        end
    end
    
    -- Adicione seus comandos aqui
    print("Sistema Zeta pronto para comandos!")
else
    print("Aguardando jogador...")
end

return "Zeta Script Executed 🔥"`;

exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "text/plain"
    };

    // CORS preflight
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    // DEBUG: Log do token recebido
    console.log("Token recebido:", event.queryStringParameters?.token);
    console.log("Headers:", event.headers);

    const token = event.queryStringParameters?.token;
    
    if (!token) {
        console.log("ERRO: Token não fornecido");
        return {
            statusCode: 403,
            headers,
            body: "ERRO: Token necessário. Acesse /generate-token primeiro."
        };
    }

    try {
        const parts = token.split('.');
        if (parts.length !== 2) {
            console.log("ERRO: Formato de token inválido");
            return { 
                statusCode: 403, 
                headers, 
                body: "ERRO: Formato de token inválido. Use token gerado pela API." 
            };
        }

        const [timestamp, signature] = parts;
        const now = Date.now();
        const tokenTime = parseInt(timestamp);
        
        console.log("Token timestamp:", timestamp, "Now:", now);
        
        // 30 segundos de validade (mesmo do generate-token)
        if (Math.abs(now - tokenTime) > 30000) {
            console.log("ERRO: Token expirado. Diferença:", Math.abs(now - tokenTime));
            return { 
                statusCode: 403, 
                headers, 
                body: "ERRO: Token expirado. Gere um novo token." 
            };
        }

        // ⚠️ VERIFICAÇÃO CRÍTICA: Use a MESMA lógica do generate-token
        const expectedSignature = crypto
            .createHmac("sha256", SECRET_KEY)
            .update(timestamp) // ⚠️ MESMO que no generate-token!
            .digest("hex");
        
        console.log("Signature recebida:", signature);
        console.log("Signature esperada:", expectedSignature);
        
        if (signature !== expectedSignature) {
            console.log("ERRO: Assinatura inválida");
            return { 
                statusCode: 403, 
                headers, 
                body: "ERRO: Assinatura inválida. Token corrompido." 
            };
        }

        // ✅ TOKEN VÁLIDO - Entrega o script
        console.log("✅ Token válido! Entregando script...");
        return {
            statusCode: 200,
            headers,
            body: SCRIPT_CONTENT
        };

    } catch (error) {
        console.log("ERRO no processamento:", error);
        return {
            statusCode: 500,
            headers,
            body: "ERRO no servidor: " + error.message
        };
    }
};
