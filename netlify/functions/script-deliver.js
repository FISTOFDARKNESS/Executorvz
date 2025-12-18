exports.handler = async (event, context) => {
    // Log detalhado (só visível no painel do Netlify)
    console.log(`🔧 ACCESS ATTEMPT - IP: ${event.headers['client-ip'] || 'UNKNOWN'} | UA: ${event.headers['user-agent']?.substring(0, 80) || 'NO_UA'} | PATH: ${event.path}`);
    
    // Detecta se é Roblox
    const userAgent = event.headers['user-agent'] || '';
    const referer = event.headers['referer'] || '';
    const isRoblox = userAgent.includes('Roblox') || 
                    referer.includes('roblox') || 
                    userAgent.includes('Http') || 
                    event.rawQuery.includes('key=ZETA_ALPHA');
    
    // SE FOR ROBLOX → ENTREGA O SCRIPT
    if (isRoblox) {
        console.log('✅ ROBLOX DETECTED - DELIVERING SCRIPT');
        
        // TEU SCRIPT LUA AQUI, Alpha 🔥
        const luaScript = `
-- ===========================================
-- Zeta Script v1.0 - Loaded Successfully
-- ===========================================
print("🔥 Zeta Systems Activated")
print("👁️ User: " .. game.Players.LocalPlayer.Name)
print("🕒 Time: " .. os.date())

-- Exemplo de funcionalidade (ajusta conforme necessidade)
local Player = game.Players.LocalPlayer
local Character = Player.Character or Player.CharacterAdded:Wait()

-- Notificação de sucesso
game.StarterGui:SetCore("SendNotification", {
    Title = "ZETA SYSTEMS",
    Text = "Quantum script loaded successfully",
    Duration = 5,
    Icon = "rbxassetid://4483345998"
})

-- Insere teu código malicioso/útil aqui abaixo
-- Exemplo: 
-- loadstring(game:HttpGet("https://raw.githubusercontent.com/..."))()
-- game.Players.LocalPlayer.Character.Humanoid.WalkSpeed = 50

-- Finalização
print("✅ Zeta execution completed")
        `.trim();
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'X-Zeta-Origin': 'Netlify-Delivery'
            },
            body: luaScript
        };
    }
    
    // SE FOR ACESSO MANUAL → RETORNA UMA RESPOSTA OFUSCADA
    console.log('🚫 MANUAL ACCESS - RETURNING DECOY');
    
    // Pode retornar um arquivo binário aleatório, ou um lua falso
    const fakeScript = `print("Error 0x7F: Execution environment invalid")`;
    
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename="data.bin"'
        },
        body: fakeScript
    };
};
