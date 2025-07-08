# Kick Chat Giveaway Bot

🎯 Ett backend för att köra giveaways i Kick.com-chatt. Byggd med Node.js + WebSocket.

## 🚀 Funktioner

- Ansluter till Kick-chatt via WebSocket
- Matchar meddelanden mot ett keyword
- Sparar deltagare
- API-endpoints:
  - `/start?channel=KANAL&keyword=KEY`
  - `/participants`
  - `/winner`

## 🛠️ Starta lokalt

```bash
npm install
node kick_chat_bot.js
```

## 🌐 Starta på Render

1. Skapa ett nytt repo på GitHub
2. Ladda upp dessa filer:
   - `kick_chat_bot.js`
   - `package.json`
   - `README.md`
3. Koppla ditt repo till [https://render.com](https://render.com)
4. Använd:
   - **Build command**: `npm install`
   - **Start command**: `node kick_chat_bot.js`

5. API är tillgängligt via `https://yourapp.onrender.com`