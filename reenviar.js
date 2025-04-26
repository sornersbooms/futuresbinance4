
// generarSesion.js
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import input from "input";
import * as dotenv from "dotenv";
import fs from "fs";
dotenv.config();





// 🔐 Usa tu API_ID y API_HASH en un archivo .env
const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
const stringSession = new StringSession("");

(async () => {
  console.log("Iniciando generación de sesión...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("Tu número (con +): "),
    password: async () => await input.text("Tu contraseña (2FA si tienes): "),
    phoneCode: async () => await input.text("Código que te llega por Telegram: "),
    onError: (err) => console.log(err),
  });

  console.log("\n✅ Sesión creada exitosamente!");
  console.log("🔑 Guarda este stringSession en un archivo .env");

  const session = client.session.save();
  console.log("\n👉 Aquí está tu stringSession:\n\n", session, "\n");


  // Guardar el stringSession en el archivo .env
fs.appendFileSync('.env', `STRING_SESSION=${session}\n`);

console.log("\n✅ stringSession guardado en .env");

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
