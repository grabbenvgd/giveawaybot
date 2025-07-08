
// kick-chat-bot.js
// Enkel Kick giveaway-bot via WebSocket (utan auth)
// OBS: för full funktion behövs inloggning/autentisering

const WebSocket = require('ws');
const express = require('express');
const app = express();
const port = 3001;

let participants = new Set();
let currentKeyword = '!join';
let currentChannel = 'tjomannenvgd';
let channelId = null;
let socket = null;

async function getChannelId(channelName) {
  const res = await fetch('https://kick.com/api/v2/channels/' + channelName);
  const data = await res.json();
  return data.id;
}

async function connectToKick(channelName, keyword) {
  currentKeyword = keyword.toLowerCase();
  currentChannel = channelName;
  participants.clear();

  channelId = await getChannelId(channelName);
  if (!channelId) {
    console.log('❌ Kunde inte hämta kanal-ID');
    return;
  }

  socket = new WebSocket('wss://chat.kick.com');

  socket.on('open', () => {
    console.log('✅ WebSocket ansluten');
    const subscribeMsg = {
      event: 'pusher:subscribe',
      data: {
        auth: '',
        channel: 'chatrooms.' + channelId
      }
    };
    socket.send(JSON.stringify(subscribeMsg));
  });

  socket.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      if (msg.event === 'App\\Events\\ChatMessageEvent') {
        const payload = JSON.parse(msg.data);
        const username = payload.sender.username;
        const message = payload.content.toLowerCase();
        if (message.includes(currentKeyword)) {
          participants.add(username);
          console.log(`✅ ${username} deltog`);
        }
      }
    } catch (err) {
      console.error('⚠️ Fel vid tolkning:', err.message);
    }
  });

  socket.on('error', (err) => {
    console.error('❌ WebSocket-fel:', err.message);
  });
}

// REST API
app.get('/start', async (req, res) => {
  const { channel, keyword } = req.query;
  if (!channel || !keyword) {
    return res.status(400).send('channel och keyword krävs');
  }
  await connectToKick(channel, keyword);
  res.send('🔄 Startade Kick giveaway för ' + channel);
});

app.get('/participants', (req, res) => {
  res.json([...participants]);
});

app.get('/winner', (req, res) => {
  const arr = [...participants];
  if (arr.length === 0) return res.json({ winner: null });
  const winner = arr[Math.floor(Math.random() * arr.length)];
  res.json({ winner });
});

// Starta server
app.listen(port, () => {
  console.log(`🚀 Kick bot server körs på http://localhost:${port}`);
});
