exports.handler = async (event) => {
  const hash = event.path.split("/").pop();
  const ua = event.headers["user-agent"] || "";

  // Bloqueia navegadores
  if (ua.includes("Mozilla")) {
    return {
      statusCode: 404,
      body: "Not found"
    };
  }

  // Lista de scripts
  const scripts = {
    "5f38a9b95530af2a5429fc6e693a328a8765534ce": `
      print("Script A carregado")
    `,
    "a8765534ce5f38a9b95530af2a5429fc6e693a328": `
      print("Script B carregado")
    `
  };

  if (!scripts[hash]) {
    return {
      statusCode: 404,
      body: "Invalid file"
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain"
    },
    body: scripts[hash]
  };
};
