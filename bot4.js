// generarSesion.js
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import input from "input";
import * as dotenv from "dotenv";
import fs from "fs";
dotenv.config();
import fetch from 'node-fetch';

// 🔐 Usa tu API_ID y API_HASH en un archivo .env o variables de entorno
const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
const sessionString = process.env.STRING_SESSION || "";
const stringSession = new StringSession(sessionString);

// LibreTranslate API URL y idioma de destino
const LIBRETRANSLATE_API_URL = 'https://libretranslate.com/translate';
const TARGET_LANGUAGE = 'es';

async function obtenerEntidad(client, identifier) {
  try {
    const entity = await client.getEntity(identifier);
    if (entity) {
      console.log(`✅ Entidad "${identifier}" encontrada:`, entity.title || entity.username || entity.id);
      return entity;
    } else {
      console.error(`❌ No se pudo encontrar la entidad con el identificador: ${identifier}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error al obtener la entidad "${identifier}":`, error);
    return null;
  }
}

(async () => {
  console.log("Iniciando el bot...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  try {
    await client.connect();
    console.log("✅ Conectado a Telegram.");

    const isAuthorized = await client.isUserAuthorized();

    if (!isAuthorized) {
      console.log("⚠️ No autorizado. Iniciando generación de nueva sesión...");
      await client.start({
        phoneNumber: async () => await input.text("Tu número (con +): "),
        password: async () => await input.text("Tu contraseña (2FA si tienes): "),
        phoneCode: async () => await input.text("Código que te llega por Telegram: "),
        onError: (err) => console.log(err),
      });

      console.log("\n✅ Nueva sesión creada exitosamente!");
      const newSession = client.session.save();
      console.log("🔑 Guarda esta STRING_SESSION como variable de entorno en Render:");
      console.log("\n👉 STRING_SESSION:", newSession, "\n");

      // Guardar el stringSession en el archivo .env (esto es útil para desarrollo local)
      fs.appendFileSync('.env', `STRING_SESSION=${newSession}\n`);
      console.log("\n✅ STRING_SESSION guardada en .env");
    } else {
      console.log("🚀 Sesión ya iniciada y autorizada.");
    }

    // Identificador del canal origen (nombre, username o enlace)
    const canalOrigenIdentifier = "https://t.me/BitcoinBulletsInsidersVip";
    // Identificador del canal destino (nombre, username o enlace)
    const canalDestinoIdentifier = "https://t.me/futurosbinancesignal";

    const canalOrigen = await obtenerEntidad(client, canalOrigenIdentifier);
    const canalDestino = await obtenerEntidad(client, canalDestinoIdentifier);

    if (!canalOrigen || !canalDestino) {
      await client.disconnect();
      return;
    }

    console.log("📡 Escuchando mensajes de:", canalOrigen.title || canalOrigen.username || canalOrigen.id);
    console.log("➡️ Enviando mensajes traducidos a:", canalDestino.title || canalDestino.username || canalDestino.id);

    // Diccionario de palabras en inglés a español
    const traducciones = {
      "Always Win Premium": "Always Win Premium",
      "Binance Futures": "Binance Futuros",
      "Bitget Futures": "Bitget Futuros",
      "ByBit USDT": "ByBit USDT",
      "HyperLiquid Futures(TRUMP/USDC)": "HyperLiquid Futuros(TRUMP/USDC)",
      "KuCoin Futures": "KuCoin Futuros",
      "OKX Futures": "OKX Futuros",
      "#TRUMP/USDT Take-Profit target 4 ✅": "#TRUMP/USDT Objetivo de Ganancia 4 ✅",
      "Profit": "Ganancia",
      "Profit: 90.5425% 📈": "Ganancia: 90.5425% 📈",
      "Period": "Período",
      "Period: 1 Days 10 Hours 59 Minutes ⏰": "Período: 1 Día 10 Horas 59 Minutos ⏰",
      "#PEOPLE/USDT Take-Profit target 4 ✅": "#PEOPLE/USDT Objetivo de Ganancia 4 ✅",
      "Profit: 83.3333% 📈": "Ganancia: 83.3333% 📈",
      "Period: 1 Days 5 Hours 24 Minutes ⏰": "Período: 1 Día 5 Horas 24 Minutos ⏰",
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
      Hodl: "Hodl",
      Fomo: "Fomo",
      Fud: "Fud",
      Rekt: "Rekt",
      Moon: "A la luna",
      Pump: "Subida repentina",
      Dump: "Caída repentina",
      Bull: "Toro (alcista)",
      Bear: "Oso (bajista)",
      Altcoin: "Altcoin (criptomoneda alternativa)",
      DeFi: "DeFi (finanzas descentralizadas)",
      NFT: "NFT (token no fungible)",
      Web3: "Web3",
      Blockchain: "Cadena de bloques",
      Wallet: "Billetera",
      Exchange: "Exchange (casa de intercambio)",
      Leverage: "Apalancamiento",
      Margin: "Margen",
      Liquidation: "Liquidación",
      Volatility: "Volatilidad",
      "All-Time High": "Máximo histórico",
      "All-Time Low": "Mínimo histórico",
      Correction: "Corrección",
      Reversal: "Reversión",
      Consolidation: "Consolidación",
      Breakout: "Ruptura (alcista)",
      Breakdown: "Ruptura (bajista)",
      Support: "Soporte",
      Resistance: "Resistencia",
      Trend: "Tendencia",
      Downtrend: "Tendencia bajista",
      Uptrend: "Tendencia alcista",
      Sideways: "Lateral",
      Analysis: "Análisis",
      Chart: "Gráfico",
      Signal: "Señal",
      Entry: "Entrada",
      Exit: "Salida",
      "Stop Loss": "Stop Loss (SL)",
      "Take Profit": "Take Profit (TP)",
      "Long Position": "Posición Larga (Compra)",
      "Short Position": "Posición Corta (Venta)",
      Trade: "Operación",
      Trader: "Trader (operador)",
      Investing: "Inversión",
      Investor: "Inversor",
      Portfolio: "Portafolio (cartera)",
      "Return on Investment": "Retorno de la Inversión (ROI)",
      Yield: "Rendimiento",
      Stake: "Staking (participación)",
      Farm: "Farming (agricultura de rendimiento)",
      Airdrop: "Airdrop (distribución gratuita de tokens)",
      Token: "Token",
      Coin: "Moneda",
      Pair: "Par",
      Volume: "Volumen",
      "Market Cap": "Capitalización de mercado",
      "Order Book": "Libro de órdenes",
      Liquidity: "Liquidez",
      Fees: "Comisiones",
      KYC: "KYC (Conozca a su cliente)",
      AML: "AML (Anti-Lavado de Dinero)",
      RSI: "RSI (Índice de Fuerza Relativa)",
      MACD: "MACD (Media Móvil de Convergencia/Divergencia)",
      EMA: "EMA (Media Móvil Exponencial)",
      SMA: "SMA (Media Móvil Simple)",
      VWAP: "VWAP (Precio Promedio Ponderado por Volumen)",
      Fibonacci: "Fibonacci",
      Ichimoku: "Ichimoku",
      "Bollinger Bands": "Bandas de Bollinger",
      ATR: "ATR (Rango Verdadero Promedio)",
      Stochastic: "Estocástico",
      "Volume Profile": "Perfil de Volumen",
      VPVR: "VPVR (Perfil de Volumen de Rango Visible)",
      Trendline: "Línea de tendencia",
      Flag: "Bandera",
      Pennant: "Triángulo banderín",
      Triangle: "Triángulo",
      Wedge: "Cuña",
      "Double Top": "Doble techo",
      "Double Bottom": "Doble suelo",
      "Head and Shoulders": "Cabeza y hombros",
      "Cup and Handle": "Taza y asa",
      "Elliot Waves": "Ondas de Elliott",
      Buy: "Comprar",
      Sell: "Vender",
      Long: "Largo (comprar)",
      Short: "Corto (vender)",
      Enter: "Entrar",
      Exit: "Salir",
      Open: "Abrir",
      Close: "Cerrar",
      "Limit Order": "Orden Límite",
      "Market Order": "Orden de Mercado",
      "Stop Order": "Orden Stop",
      "Trailing Stop": "Trailing Stop (Stop Dinámico)",
      Cancel: "Cancelar",
      Modify: "Modificar",
      Execute: "Ejecutar",
      Fill: "Llenar (ejecutar orden)",
      Bullish: "Alcista",
      Bearish: "Bajista",
      Neutral: "Neutral",
      Optimistic: "Optimista",
      Pessimistic: "Pesimista",
      Fear: "Miedo",
      Greed: "Avaricia",
      Panic: "Pánico",
      Euphoria: "Euforia",
      "Correction incoming": "Corrección en camino",
      Dip: "Retroceso",
      "Buy the dip": "Comprar en el retroceso",
      "Sell the rip": "Vender en la subida",
      "No financial advice": "Esto no es consejo financiero",
      DYOR: "DYOR (Haz tu propia investigación)",
      Whales: "Ballenas (grandes inversores)",
      Bots: "Bots (programas automatizados)",
      Manipulation: "Manipulación",
      "1 min": "1 minuto",
      "3 min": "3 minutos",
      "15 min": "15 minutos",
      "30 min": "30 minutos",
      "1 hour": "1 hora",
      "4 hours": "4 horas",
      "1 Day": "1 día",
      "1 Week": "1 semana",
      "1 Month": "1 mes",
      Kraken: "Kraken",
      Coinbase: "Coinbase",
      Deribit: "Deribit",
      TradingView: "TradingView",
      Telegram: "Telegram",
      Strong: "Fuerte",
      Weak: "Débil",
      High: "Alto",
      Low: "Bajo",
      Volatile: "Volátil",
      Stable: "Estable",
      Significant: "Significativo",
      Critical: "Crítico",
      Key: "Clave",
      Immediate: "Inmediato",
      Potential: "Potencial",
      Likely: "Probablemente",
      Possibly: "Posiblemente",
      Soon: "Pronto",
      Now: "Ahora",
      Already: "Ya",
      Just: "Solo",
      Still: "Aún",
      Very: "Muy",
      Extremely: "Extremadamente",
      "Take profits now": "Toma ganancias ahora",
      "Set your stop loss": "Coloca tu stop loss",
      "Looking for a long entry": "Buscando una entrada en largo",
      "Potential short setup": "Posible configuración para corto",
      "Breakout confirmed": "Ruptura confirmada",
      "Rejecting at resistance": "Rechazando en la resistencia",
      "Holding support": "Manteniendo el soporte",
      "Be careful with leverage": "Ten cuidado con el apalancamiento",
      "Manage your risk": "Gestiona tu riesgo",
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
        const canalOrigenId = canalOrigen.id?.toString();
        const channelIdOrigen = mensaje.peerId.channelId?.toString();

        // Procesar solo mensajes del canal de origen
        if (channelIdOrigen === canalOrigenId) {
          let textoOriginal = mensaje.message;
          const sourceLanguage = mensaje.languageCode || 'auto';

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
          const textoFinal = `${textoOriginal.trim()}\n\n✅👤 Contacto: @ProgramadorMillonary\n✅📥 Regístrate aquí: https://www.binance.com/referral/earn-together/refertoearn2000usdc/claim?hl=en&ref=GRO_14352_LM6IL&utm_source=referralmode`;

          // Enviar mensaje editado al canal de destino
          await client.sendMessage(canalDestino.entity, { message: textoFinal });

          console.log("✏️ Mensaje personalizado y traducido enviado.");
        }
      } catch (err) {
        console.error("❌ Error al modificar o traducir mensaje:", err);
      }
    });
  } catch (error) {
    console.error("❌ Error inicial:", error);
  }
})();