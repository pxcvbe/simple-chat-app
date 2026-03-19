# P-Chat

Real-time chat app berbasis WebSocket. Tanpa database, tanpa auth-login. Masuk langsung mulai ngobrol!

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=fff&style=flat)
![License](https://img.shields.io/badge/license-MIT-blue)

<img width="1920" height="957" alt="image" src="https://github.com/user-attachments/assets/dea69b07-fcd1-4e5e-8192-0505d8d8f57f" />

---

## • Fitur •

- **Real-time messaging** - pesan terkirim instan ke semua user via WebSocket.
- **Typing indicator** - tau siapa yang sedang mengetik.
- **Online user list** - sidebar daftar isi user yang sedang online.
- **Warna unik per-user** - setiap user dapat warna yang berbeda-beda secara otomatis.
- **Message history** - 50 pesan terakhir tersimpan di memori, langsung muncul saat join.
- **System notifications** - notif saat user join atau leave.

---

## • Quickstart •

```bash
git clone https://github.com/pxcvbe/simple-chat-app.git
cd simple-chat-app
npm install
npm start
```

Buka **http://localhost:3000** di browser.

### Development mode (auto-restart)

```bash
npm run dev
```

> ⚠️ Requirements: Node.js 18+ (Keatas)

---

## → 🌐 Expose ke Internet (CloudFlare Tunnel) •

Lu bisa run langsung tanpa nge-deploy dulu (testing):

![Linux](https://img.shields.io/badge/Linux-green) ![WSL](https://img.shields.io/badge/WSL-4E9A06?style=flat&logo=linux&logoColor=white)
```bash
# Install cloudflared (WSL / Linux)
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

![Windows](https://img.shields.io/badge/Windows-blue)
```bash
# Full docs for windows
https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/as-a-service/windows/
```

# Jalankan tunnel (tanpa perlu akun)
```bash
cloudflared tunnel --url http://localhost:3000
```

Cloudflare akan generate URL publik seperti `https://random-name.trycloudflare.com` - sudah HTTPS dan WebSocket-ready.

---

## • Tech Stack •
 
| Layer | Teknologi |
|---|---|
| Runtime | Node.js |
| HTTP Server | Express |
| WebSocket | ws |
| Frontend | HTML / CSS / Vanilla JS |
 
Total dependensi: **2 package** (`express`, `ws`)

---
 
## • Note •
 
- Data pesan disimpan **in-memory** - hilang saat server restart.
- Untuk persistensi, bisa pake Redis atau SQLite.
- Untuk production multi-instance, perlu message broker (Redis Pub/Sub).

---

## 📄 License
 
MIT
