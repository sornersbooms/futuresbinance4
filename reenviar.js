const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input"); // Para pedir datos por consola

// 🔐 Consigue estos datos en: https://my.telegram.org/auth
const apiId = 20888268; // Ej: 123456
const apiHash = "7e84980fccdfab65b4f389d6a9f4c203"; // Ej: 'abc123def456...'
const stringSession = new StringSession(""); // Almacena la sesión después del login

(async () => {
  // Inicia el cliente de Telegram
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  // Login
  await client.start({
    phoneNumber: async () => await input.text("Tu número (con +): "),
    password: async () => await input.text("Tu contraseña (2FA si tienes): "),
    phoneCode: async () => await input.text("Código recibido por Telegram: "),
    onError: (err) => console.log(err),
  });

  console.log("✅ Sesión iniciada.");
  console.log("💾 Tu stringSession: ", client.session.save());

  // Cambia estos nombres exactamente como aparecen en Telegram
  const nombreCanalOrigen = "[Coin119.com] Binance Futures RSI Signal 15 min";
  const nombreCanalDestino = "Binance futuros Señales Canal";

  // Obtener los canales
  const dialogs = await client.getDialogs({});
  const canalOrigen = dialogs.find((d) => d.name === nombreCanalOrigen);
  const canalDestino = dialogs.find((d) => d.name === nombreCanalDestino);

  // Verificar que se encontraron ambos canales
  if (!canalOrigen || !canalDestino) {
    console.error("❌ No se encontraron uno o ambos canales. Revisa los nombres.");
    return;
  }

  console.log("📡 Escuchando mensajes de:", canalOrigen.name);

  // Manejo de eventos: Reenviar mensajes entre canales
  client.addEventHandler(async (event) => {
    const mensaje = event.message;
    if (!mensaje || !mensaje.peerId) return;

    try {
      const channelIdOrigen = mensaje.peerId.channelId?.toString();
      const canalOrigenId = canalOrigen.entity.id.toString();

      // Reenviar mensaje si proviene del canal de origen
      if (channelIdOrigen === canalOrigenId) {
        await client.forwardMessages(canalDestino.entity, {
          messages: [mensaje.id],
          fromPeer: canalOrigen.entity,
        });
        console.log("📨 Mensaje reenviado:", mensaje.message);
      }
    } catch (err) {
      console.error("❌ Error reenviando mensaje:", err);
    }
  });

  //----------------------------------------------------------------------------- 

  // Diccionario de palabras en inglés a español
  const traducciones = {
    Deadcross: "Cruce de la muerte",
    "MA5 below MA20": "MA5 por debajo de MA20",
    "5 min": "5 minutos",
    Binance: "Binance",
    Futures: "Futuros",
    Recommendation: "Recomendación",
    "#Sell": "#Vender",
    "#Buy": "#Comprar",
    Ticker: "Símbolo",
    "Last Price": "Último precio",
    Target: "Objetivo",
    Bonus: "Bono",
    "NO KYC": "Sin verificación",
    "Click here": "Haz clic aquí",
    "Join now": "Únete ahora",
    "Limited offer": "Oferta limitada",
    Register: "Regístrate",
    Start: "Empezar",
    Download: "Descargar",
  };

  // Función para traducir texto usando el diccionario
  function traducirTexto(texto) {
    for (const [ingles, espanol] of Object.entries(traducciones)) {
      const regex = new RegExp(ingles, "gi");
      texto = texto.replace(regex, espanol);
    }
    return texto;
  }

  // Función principal para manejar mensajes entrantes
  client.addEventHandler(async (event) => {
    const mensaje = event.message;
    if (!mensaje || !mensaje.peerId || !mensaje.message) return;

    try {
      const canalOrigenId = canalOrigen.entity.id.toString();
      const channelIdOrigen = mensaje.peerId.channelId?.toString();

      // Procesar solo mensajes del canal de origen
      if (channelIdOrigen === canalOrigenId) {
        let textoOriginal = mensaje.message;

        // 🔴 Palabras o frases a eliminar
        const frasesAEliminar = [
          "👉 [Bitget 6200 USDT Bonus!]",
          "Powered by #ChatGPT",
          "www.coin119.com",
          "[Free Trading Signals]",
          "👉 www.coin119.com",
        ];

        // ❌ Eliminar frases
        frasesAEliminar.forEach((frase) => {
          textoOriginal = textoOriginal.replaceAll(frase, "");
        });

        // 2. Traducir texto de inglés a español
        textoOriginal = traducirTexto(textoOriginal);

        // ✅ Agregar tus propios enlaces
        const textoFinal = `${textoOriginal.trim()}\n\n✅👤 Contacto: @ProgramadorMillonary\n✅📥 Regístrate aquí: https://t.me/Yefersornersbooms`;

        // Enviar mensaje editado al canal de destino
        await client.sendMessage(canalDestino.entity, { message: textoFinal });

        console.log("✏️ Mensaje personalizado enviado.");
      }
    } catch (err) {
      console.error("❌ Error al modificar mensaje:", err);
    }
  });
})();
