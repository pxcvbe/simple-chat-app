const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

// Generate random color for each user
const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
]

let onlineUsers = new Map(); // ws -> { username, color, id }
let messageHistory = []; // Store last 50 messages
const MAX_HISTORY = 50;

function broadcast(data, excludeWs = null) {
    const message = JSON.stringify(data);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client !== excludeWs) {
            client.send(message);
        }
    });
}

function broadcastAll(data) {
    const message = JSON.stringify(data);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

function getUserList() {
    return Array.from(onlineUsers.values()).map(u => ({
        id: u.id,
        username: u.username,
        color: u.color
    }));
}

wss.on('connection', (ws) => {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const userColor = colors[Math.floor(Math.random() * colors.length)];

    ws.on('message', (raw) => {
        let data;
        try { data = JSON.parse(raw); } catch { return; }

        if (data.type === 'join') {
            const username = (data.username || 'Anonymous').trim().slice(0, 20) || 'Anonymous';
            onlineUsers.set(ws, { username, color: userColor, id: userId });

            // Send history + welcome to this user
            ws.send(JSON.stringify({
                type: 'welcome',
                userId,
                color: userColor,
                history: messageHistory,
                users: getUserList()
            }));

            // Notify others
            const joinMsg = {
                type: 'system',
                text: `${username} joined the chat`,
                timestamp: Date.now()
            };

            messageHistory.push(joinMsg);
            if (messageHistory.length > MAX_HISTORY) messageHistory.shift();

            broadcast({ type: 'system', text: joinMsg.text, timestamp: joinMsg.timestamp }, ws);
            broadcastAll({ type: 'users', users: getUserList() });
        }

        else if (data.type === 'message') {
            const user = onlineUsers.get(ws);
            if (!user) return;

            const text = (data.text || '').trim().slice(0, 500);
            if (!text) return;

            const msg = {
                type: 'message',
                userId: user.id,
                username: user.username,
                color: user.color,
                text,
                timestamp: Date.now()
            };

            messageHistory.push(msg);
            if (messageHistory.length > MAX_HISTORY) messageHistory.shift();

            broadcastAll(msg);
        }

        else if (data.type === 'typing') {
            const user = onlineUsers.get(ws);
            if (!user) return;
            broadcast({ type: 'typing', userId: user.id, username: user.username, isTyping: data.isTyping }, ws);
        }
    });

    ws.on('close', () => {
        const user = onlineUsers.get(ws);
        if (user) {
            onlineUsers.delete(ws);
            const leaveMsg = {
                type: 'system',
                text: `${user.username} left the chat`,
                timestamp: Date.now()
            };
            messageHistory.push(leaveMsg);
            if (messageHistory.length > MAX_HISTORY) messageHistory.shift();

            broadcastAll({ type: 'system', text: leaveMsg.text, timestamp: leaveMsg.timestamp });
            broadcastAll({ type: 'users', users: getUserList() });
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`\n🚀 Chat server running at http://localhost:${PORT}\n`);
});