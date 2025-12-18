exports.handler = async (event) => {
    console.log(`🔥 ACCESS - IP: ${event.headers['client-ip']} | PATH: ${event.path}`);
    
    const userAgent = event.headers['user-agent'] || '';
    const isRoblox = userAgent.includes('Roblox') || userAgent.includes('Http');
    
    if (isRoblox) {
        console.log('✅ ROBLOX DETECTED');
        
        // SCRIPT LUA CORRIGIDO - SEM ESPAÇOS EXTRAS
        const luaScript = `print("hello, world")`;
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-store',
                'Access-Control-Allow-Origin': '*'
            },
            body: luaScript
        };
    }
    
    // ACESSO MANUAL - RETORNA 404 OU LIXO
    return {
        statusCode: 404,
        body: 'Not Found'
    };
};
